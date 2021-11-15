import {Fragment, FunctionComponent, useMemo, useState} from 'react';
import styled from '@emotion/styled';
import {Location} from 'history';
import pick from 'lodash/pick';

import Button from 'app/components/button';
import _EventsRequest from 'app/components/charts/eventsRequest';
import {getInterval} from 'app/components/charts/utils';
import Truncate from 'app/components/truncate';
import {t} from 'app/locale';
import space from 'app/styles/space';
import {Organization} from 'app/types';
import {defined} from 'app/utils';
import DiscoverQuery, {TableDataRow} from 'app/utils/discover/discoverQuery';
import EventView from 'app/utils/discover/eventView';
import {WebVital} from 'app/utils/discover/fields';
import {VitalData} from 'app/utils/performance/vitals/vitalsCardsDiscoverQuery';
import {decodeList} from 'app/utils/queryString';
import {MutableSearch} from 'app/utils/tokenizeSearch';
import withApi from 'app/utils/withApi';
import {vitalDetailRouteWithQuery} from 'app/views/performance/vitalDetail/utils';
import {_VitalChart} from 'app/views/performance/vitalDetail/vitalChart';

import {excludeTransaction} from '../../utils';
import {VitalBar} from '../../vitalsCards';
import {GenericPerformanceWidget} from '../components/performanceWidget';
import SelectableList, {
  GrowLink,
  ListClose,
  RightAlignedCell,
  Subtitle,
} from '../components/selectableList';
import {transformDiscoverToList} from '../transforms/transformDiscoverToList';
import {transformEventsRequestToVitals} from '../transforms/transformEventsToVitals';
import {QueryDefinition, WidgetDataResult} from '../types';
import {eventsRequestQueryProps} from '../utils';
import {ChartDefinition, PerformanceWidgetSetting} from '../widgetDefinitions';

type Props = {
  title: string;
  titleTooltip: string;
  fields: string[];
  chartColor?: string;

  eventView: EventView;
  location: Location;
  organization: Organization;
  chartSetting: PerformanceWidgetSetting;
  chartDefinition: ChartDefinition;

  ContainerActions: FunctionComponent<{isLoading: boolean}>;
};

type DataType = {
  list: WidgetDataResult & ReturnType<typeof transformDiscoverToList>;
  chart: WidgetDataResult & ReturnType<typeof transformEventsRequestToVitals>;
};

export function transformFieldsWithStops(props: {
  field: string;
  fields: string[];
  vitalStops: ChartDefinition['vitalStops'];
}) {
  const {field, fields, vitalStops} = props;
  const poorStop = vitalStops?.poor;
  const mehStop = vitalStops?.meh;

  if (!defined(poorStop) || !defined(mehStop)) {
    return {
      sortField: fields[0],
      fieldsList: fields,
    };
  }

  const poorCountField = `count_if(${field},greaterOrEquals,${poorStop})`;
  const mehCountField = `equation|count_if(${field},greaterOrEquals,${mehStop}) - count_if(${field},greaterOrEquals,${poorStop})`;
  const goodCountField = `equation|count_if(${field},greaterOrEquals,0) - count_if(${field},greaterOrEquals,${mehStop})`;

  const otherRequiredFieldsForQuery = [
    `count_if(${field},greaterOrEquals,${mehStop})`,
    `count_if(${field},greaterOrEquals,0)`,
  ];

  const vitalFields = {
    poorCountField,
    mehCountField,
    goodCountField,
  };

  const fieldsList = [
    poorCountField,
    ...otherRequiredFieldsForQuery,
    mehCountField,
    goodCountField,
  ];

  return {
    sortField: poorCountField,
    vitalFields,
    fieldsList,
  };
}

export function VitalWidget(props: Props) {
  const {ContainerActions, eventView, organization, location} = props;
  const [selectedListIndex, setSelectListIndex] = useState<number>(0);
  const field = props.fields[0];

  const {fieldsList, vitalFields, sortField} = transformFieldsWithStops({
    field,
    fields: props.fields,
    vitalStops: props.chartDefinition.vitalStops,
  });

  const Queries = {
    list: useMemo<QueryDefinition<DataType, WidgetDataResult>>(
      () => ({
        fields: sortField,
        component: provided => {
          const _eventView = props.eventView.clone();

          const fieldFromProps = fieldsList.map(propField => ({
            field: propField,
          }));

          _eventView.sorts = [{kind: 'desc', field: sortField}];

          _eventView.fields = [
            {field: 'transaction'},
            {field: 'title'},
            {field: 'project.id'},
            ...fieldFromProps,
          ];
          const mutableSearch = new MutableSearch(_eventView.query);
          _eventView.query = mutableSearch.formatString();
          return (
            <DiscoverQuery
              {...provided}
              eventView={_eventView}
              location={props.location}
              limit={3}
            />
          );
        },
        transform: transformDiscoverToList,
      }),
      [props.eventView, fieldsList, props.organization.slug]
    ),
    chart: useMemo<QueryDefinition<DataType, WidgetDataResult>>(
      () => ({
        enabled: widgetData => {
          return !!widgetData?.list?.data?.length;
        },
        fields: fieldsList,
        component: provided => {
          const _eventView = props.eventView.clone();

          _eventView.additionalConditions.setFilterValues('transaction', [
            provided.widgetData.list.data[selectedListIndex].transaction as string,
          ]);

          return (
            <EventsRequest
              {...pick(provided, eventsRequestQueryProps)}
              limit={1}
              currentSeriesNames={[sortField]}
              includePrevious={false}
              partial={false}
              includeTransformedData
              query={_eventView.getQueryWithAdditionalConditions()}
              interval={getInterval(
                {
                  start: provided.start,
                  end: provided.end,
                  period: provided.period,
                },
                'medium'
              )}
            />
          );
        },
        transform: transformEventsRequestToVitals,
      }),
      [props.eventView, selectedListIndex, props.chartSetting, props.organization.slug]
    ),
  };

  const settingToVital: {[x: string]: WebVital} = {
    [PerformanceWidgetSetting.WORST_LCP_VITALS]: WebVital.LCP,
    [PerformanceWidgetSetting.WORST_FCP_VITALS]: WebVital.FCP,
    [PerformanceWidgetSetting.WORST_FID_VITALS]: WebVital.FID,
    [PerformanceWidgetSetting.WORST_CLS_VITALS]: WebVital.CLS,
  };

  const handleViewAllClick = () => {
    // TODO(k-fish): Add analytics.
  };

  return (
    <GenericPerformanceWidget<DataType>
      {...props}
      Subtitle={provided => {
        const listItem = provided.widgetData.list?.data[selectedListIndex];

        if (!listItem) {
          return <Subtitle> </Subtitle>;
        }

        const data = {
          [settingToVital[props.chartSetting]]: getVitalDataForListItem(listItem),
        };

        return (
          <Subtitle>
            <VitalBar
              isLoading={provided.widgetData.list?.isLoading}
              vital={settingToVital[props.chartSetting]}
              data={data}
              showBar={false}
              showDurationDetail={false}
              showDetail
            />
          </Subtitle>
        );
      }}
      HeaderActions={provided => {
        const vital = settingToVital[props.chartSetting];
        const target = vitalDetailRouteWithQuery({
          orgSlug: organization.slug,
          query: eventView.generateQueryStringObject(),
          vitalName: vital,
          projectID: decodeList(location.query.project),
        });

        return (
          <Fragment>
            <div>
              <Button
                onClick={handleViewAllClick}
                to={target}
                size="small"
                data-test-id="view-all-button"
              >
                {t('View All')}
              </Button>
            </div>
            <ContainerActions {...provided.widgetData.chart} />
          </Fragment>
        );
      }}
      Queries={Queries}
      Visualizations={[
        {
          component: provided => (
            <_VitalChart
              {...provided.widgetData.chart}
              {...provided}
              field={field}
              vitalFields={vitalFields}
              organization={organization}
              query={eventView.query}
              project={eventView.project}
              environment={eventView.environment}
              grid={{
                left: space(0),
                right: space(0),
                top: space(2),
                bottom: space(2),
              }}
            />
          ),
          height: 160,
        },
        {
          component: provided => (
            <SelectableList
              selectedIndex={selectedListIndex}
              setSelectedIndex={setSelectListIndex}
              items={provided.widgetData.list.data.map(listItem => () => {
                const transaction = listItem.transaction as string;
                const _eventView = eventView.clone();

                const initialConditions = new MutableSearch(_eventView.query);
                initialConditions.addFilterValues('transaction', [transaction]);

                const vital = settingToVital[props.chartSetting];

                _eventView.query = initialConditions.formatString();

                const target = vitalDetailRouteWithQuery({
                  orgSlug: organization.slug,
                  query: _eventView.generateQueryStringObject(),
                  vitalName: vital,
                  projectID: decodeList(location.query.project),
                });

                const data = {
                  [settingToVital[props.chartSetting]]: getVitalDataForListItem(listItem),
                };

                return (
                  <Fragment>
                    <GrowLink to={target}>
                      <Truncate value={transaction} maxLength={40} />
                    </GrowLink>
                    <VitalBarCell>
                      <VitalBar
                        isLoading={provided.widgetData.list?.isLoading}
                        vital={settingToVital[props.chartSetting]}
                        data={data}
                        showBar
                        showDurationDetail={false}
                        showDetail={false}
                        barHeight={24}
                      />
                    </VitalBarCell>
                    <ListClose
                      setSelectListIndex={setSelectListIndex}
                      onClick={() => excludeTransaction(listItem.transaction, props)}
                    />
                  </Fragment>
                );
              })}
            />
          ),
          height: 200,
          noPadding: true,
        },
      ]}
    />
  );
}

function getVitalDataForListItem(listItem: TableDataRow) {
  const poorData: number =
    (listItem.count_if_measurements_lcp_greaterOrEquals_4000 as number) || 0;
  const mehData: number = (listItem['equation[0]'] as number) || 0;
  const goodData: number = (listItem['equation[1]'] as number) || 0;
  const _vitalData = {
    poor: poorData,
    meh: mehData,
    good: goodData,
    p75: 0,
  };
  const vitalData: VitalData = {
    ..._vitalData,
    total: _vitalData.poor + _vitalData.meh + _vitalData.good,
  };

  return vitalData;
}

const VitalBarCell = styled(RightAlignedCell)`
  width: 120px;
  margin-left: ${space(1)};
  margin-right: ${space(1)};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const EventsRequest = withApi(_EventsRequest);