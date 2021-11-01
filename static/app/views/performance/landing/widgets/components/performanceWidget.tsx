import {Fragment, useCallback, useRef, useState} from 'react';
import {withRouter} from 'react-router';
import styled from '@emotion/styled';

import ErrorPanel from 'app/components/charts/errorPanel';
import Placeholder from 'app/components/placeholder';
import {IconWarning} from 'app/icons/iconWarning';
import space from 'app/styles/space';
import {Organization} from 'app/types';
import trackAdvancedAnalyticsEvent from 'app/utils/analytics/trackAdvancedAnalyticsEvent';
import useApi from 'app/utils/useApi';
import getPerformanceWidgetContainer from 'app/views/performance/landing/widgets/components/performanceWidgetContainer';

import {
  GenericPerformanceWidgetProps,
  WidgetDataConstraint,
  WidgetDataProps,
  WidgetDataResult,
  WidgetPropUnion,
} from '../types';
import {PerformanceWidgetSetting} from '../widgetDefinitions';

import {DataStateSwitch} from './dataStateSwitch';
import {QueryHandler} from './queryHandler';
import {WidgetHeader} from './widgetHeader';

// Generic performance widget for type T, where T defines all the data contained in the widget.
export function GenericPerformanceWidget<T extends WidgetDataConstraint>(
  props: WidgetPropUnion<T>
) {
  // Use object keyed to chart setting so switching between charts of a similar type doesn't retain data with query components still having inflight requests.
  const [allWidgetData, setWidgetData] = useState<{[chartSetting: string]: T}>({});
  const widgetData = allWidgetData[props.chartSetting] ?? {};
  const widgetDataRef = useRef(widgetData);

  const setWidgetDataForKey = useCallback(
    (dataKey: string, result?: WidgetDataResult) => {
      const _widgetData = widgetDataRef.current;
      const newWidgetData = {..._widgetData, [dataKey]: result};
      widgetDataRef.current = newWidgetData;
      setWidgetData({[props.chartSetting]: newWidgetData});
    },
    [allWidgetData, setWidgetData]
  );
  const removeWidgetDataForKey = useCallback(
    (dataKey: string) => {
      const _widgetData = widgetDataRef.current;
      const newWidgetData = {..._widgetData};
      delete newWidgetData[dataKey];
      widgetDataRef.current = newWidgetData;
      setWidgetData({[props.chartSetting]: newWidgetData});
    },
    [allWidgetData, setWidgetData]
  );
  const widgetProps = {widgetData, setWidgetDataForKey, removeWidgetDataForKey};

  const queries = Object.entries(props.Queries).map(([key, definition]) => ({
    ...definition,
    queryKey: key,
  }));

  const api = useApi();

  const totalHeight = props.Visualizations.reduce((acc, curr) => acc + curr.height, 0);

  return (
    <Fragment>
      <QueryHandler
        widgetData={widgetData}
        setWidgetDataForKey={setWidgetDataForKey}
        removeWidgetDataForKey={removeWidgetDataForKey}
        queryProps={props}
        queries={queries}
        api={api}
      />
      <_DataDisplay<T> {...props} {...widgetProps} totalHeight={totalHeight} />
    </Fragment>
  );
}

function trackDataComponentClicks(
  chartSetting: PerformanceWidgetSetting,
  organization: Organization
) {
  trackAdvancedAnalyticsEvent('performance_views.landingv3.widget.interaction', {
    organization,
    widget_type: chartSetting,
  });
}

function _DataDisplay<T extends WidgetDataConstraint>(
  props: GenericPerformanceWidgetProps<T> & WidgetDataProps<T> & {totalHeight: number}
) {
  const {Visualizations, chartHeight, totalHeight, containerType, EmptyComponent} = props;

  const Container = getPerformanceWidgetContainer({
    containerType,
  });

  const numberKeys = Object.keys(props.Queries).length;
  const missingDataKeys = Object.values(props.widgetData).length !== numberKeys;
  const hasData =
    !missingDataKeys && Object.values(props.widgetData).every(d => !d || d.hasData);
  const isLoading = Object.values(props.widgetData).some(d => !d || d.isLoading);
  const isErrored =
    !missingDataKeys && Object.values(props.widgetData).some(d => d && d.isErrored);

  const paddingOffset = 32; // space(2) * 2;

  return (
    <Container data-test-id="performance-widget-container">
      <ContentContainer>
        <WidgetHeader<T> {...props} />
      </ContentContainer>
      <DataStateSwitch
        isLoading={isLoading}
        isErrored={isErrored}
        hasData={hasData}
        errorComponent={<DefaultErrorComponent height={totalHeight - paddingOffset} />}
        dataComponents={Visualizations.map((Visualization, index) => (
          <ContentContainer
            key={index}
            noPadding={Visualization.noPadding}
            bottomPadding={Visualization.bottomPadding}
            data-test-id="widget-state-has-data"
            onClick={() =>
              trackDataComponentClicks(props.chartSetting, props.organization)
            }
          >
            <Visualization.component
              grid={defaultGrid}
              queryFields={Visualization.fields}
              widgetData={props.widgetData}
              height={chartHeight}
            />
          </ContentContainer>
        ))}
        loadingComponent={<Placeholder height={`${totalHeight - paddingOffset}px`} />}
        emptyComponent={
          EmptyComponent ? (
            <EmptyComponent />
          ) : (
            <Placeholder height={`${totalHeight - paddingOffset}px`} />
          )
        }
      />
    </Container>
  );
}

export const DataDisplay = withRouter(_DataDisplay);

const DefaultErrorComponent = (props: {height: number}) => {
  return (
    <ErrorPanel height={`${props.height}px`}>
      <IconWarning color="gray300" size="lg" />
    </ErrorPanel>
  );
};

const defaultGrid = {
  left: space(0),
  right: space(0),
  top: space(2),
  bottom: space(0),
};

const ContentContainer = styled('div')<{noPadding?: boolean; bottomPadding?: boolean}>`
  padding-left: ${p => (p.noPadding ? space(0) : space(2))};
  padding-right: ${p => (p.noPadding ? space(0) : space(2))};
  padding-bottom: ${p => (p.bottomPadding ? space(1) : space(0))};
`;
GenericPerformanceWidget.defaultProps = {
  containerType: 'panel',
  chartHeight: 200,
};
