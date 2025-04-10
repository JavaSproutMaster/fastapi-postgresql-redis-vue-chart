import {
  ref,
  computed,
  reactive,
  watch,
  Ref,
} from 'vue';

import {
  ChartData as ChartJSData,
  ChartOptions,
  ChartDataset,
} from 'chart.js';

import { CompanyController } from '@/controllers/company/types';
import { Chart, ChartData } from '@/rest-api/companies/assets';
import { chartFields, companyChartOptions } from '@/data/chart';
import { ChartField } from '@/components/ui/table-column/types';
import { useStore } from 'vuex';

export const useChart = ( // eslint-disable-line
  type: Ref<string>,
  period: Ref<string>,
  company: CompanyController,
  leftAxis: any,
  rightAxis: any,
  isPercentOnLeftAxis: boolean,
  kind?: string,
) => {
  const store = useStore();
  const loading = ref(true);
  const reactiveDataset: ChartDataset<'line'>[] = reactive([]);
  const data: ChartJSData<'line'> = {
    labels: [],
    datasets: [],
  };
  const chartParams = computed(() => {
    if (!kind) {
      return store.state.application.chartParams;
    }
    return ['stockPrice'];
  });

  const createDataset = (label: string, values: ChartData[], color: string, axis: string) => {
    const dataset: any[] = [];
    if (!data.labels?.length) return;

    for (let i = 0; i < data.labels.length; i += 1) {
      const aLabel = data.labels[i];
      const filteredValues = values.filter((value) => value.label === aLabel);
      const value = filteredValues.length > 0 ? filteredValues[0].value : null;
      if (type.value === 'rebased') {
        if (i === 0) {
          dataset.push(0);
        } else if (filteredValues.length === 0) dataset.push(null);
        else if (filteredValues.length > 0) {
          if (value) {
            dataset.push(((value - values[0].value) / Math.abs(values[0].value)) * 100);
          } else dataset.push(null);
        }
      } else {
        dataset.push(value);
      }
    }

    const object = {
      label,
      data: dataset,
      yAxisID: axis,
      borderWidth: 3,
      pointRadius: 0,
      borderColor: color,
      fill: true,
      backgroundColor: 'transparent',
    };
    if (dataset.length > 0) {
      reactiveDataset.push(object);
      data.datasets?.push(object);
    }
  };

  const update = () => {
    loading.value = true;

    data.labels = [];
    data.datasets = [];
    reactiveDataset.splice(0);

    company.getChartData(period.value).then((payload) => {
      Object.keys(payload).forEach((key) => {
        const chartKey = key as keyof Chart;
        // if (chartKey === 'stockPrice') {
        //   for (let i = 0; i < payload[chartKey].length; i += 1) {
        //     const values = payload[chartKey];
        //     data.labels?.push(values[i].label);
        //   }
        // }
        if (!chartParams.value?.includes(chartKey.toString())) return;
        for (let i = 0; i < payload[chartKey].length; i += 1) {
          const values = payload[chartKey];
          if (!data.labels?.includes(values[i].label)) {
            data.labels?.push(values[i].label);
          }
        }
      });
      // if (period.value === '10Y' || period.value === '5Y' ||
      // period.value === '1Y') data.labels?.sort();
      // console.log(chartParams.value);
      Object.keys(payload).forEach((key) => {
        const chartKey = key as keyof Chart;
        // console.log(chartKey);
        if (!chartParams.value?.includes(chartKey.toString())) return;
        let label = '';
        let color = '';
        let axis = 'y-right';
        chartFields.forEach((field: ChartField) => {
          if (chartKey === field.key) {
            label = field.name;
            color = field.color;
            if (type.value === 'rebased') {
              axis = 'y-left';
            } else if (field.handler === 'percentage' && isPercentOnLeftAxis) {
              axis = 'y-left';
            } else {
              axis = field.axis;
            }
          }
        });
        // console.log(label);
        // console.log(payload[chartKey]);
        createDataset(label, payload[chartKey], color, axis);
      });
    }).finally(() => {
      loading.value = false;
    });
  };

  const computedData = computed(() => data);

  watch(() => [period.value, type.value, chartParams.value.length], update);

  update();

  return {
    loading,
    data: computedData,
  };
};
