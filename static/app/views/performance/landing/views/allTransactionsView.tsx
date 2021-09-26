import {usePageError} from 'app/utils/performance/contexts/pageError';

import Table from '../../table';
import {DoubleChartRow, MiniChartRow} from '../widgets/components/miniChartRow';
import {PerformanceWidgetSetting} from '../widgets/widgetDefinitions';

import {BasePerformanceViewProps} from './types';

export function AllTransactionsView(props: BasePerformanceViewProps) {
  return (
    <div>
      <MiniChartRow
        {...props}
        allowedCharts={[
          PerformanceWidgetSetting.USER_MISERY_AREA,
          PerformanceWidgetSetting.TPM_AREA,
          PerformanceWidgetSetting.FAILURE_RATE_AREA,
          PerformanceWidgetSetting.APDEX_AREA,
          PerformanceWidgetSetting.P50_DURATION_AREA,
          PerformanceWidgetSetting.P95_DURATION_AREA,
          PerformanceWidgetSetting.P99_DURATION_AREA,
        ]}
      />
      <DoubleChartRow
        {...props}
        allowedCharts={[
          PerformanceWidgetSetting.TPM_AREA,
          // TODO(k-fish): Temporarily adding extra charts here while trends widgets are in progress.
          PerformanceWidgetSetting.TPM_AREA,
          PerformanceWidgetSetting.TPM_AREA,
          PerformanceWidgetSetting.MOST_IMPROVED,
          PerformanceWidgetSetting.MOST_REGRESSED,
        ]}
      />
      {/* Existing chart network call: https://sentry.io/api/0/organizations/sentry/events-stats/?interval=5m&partial=1&project=11276&query=transaction.duration%3A%3C15m%20event.type%3Atransaction&statsPeriod=24h&yAxis=apdex%28%29&yAxis=tpm%28%29 */}
      <Table {...props} setError={usePageError().setPageError} />
    </div>
  );
}
