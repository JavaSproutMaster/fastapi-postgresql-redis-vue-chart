<template>
  <div class="financials-chart">
    <Card>
      <div class="financials-chart-control">
        <div
          v-for="(row, index) in tableRows.slice(0, 30)"
          :key="index"
          class="financials-chart-value"
        >
          <Checkbox
            type="big"
            :value="selectedRows.includes(row)"
            @click="toggleSelect(row, index)"
          />
          <span>{{ (index + 1).toString().padStart(2, '0') }}</span>
          <p>{{ row.name }}</p>
        </div>
      </div>
    </Card>
    <Card>
      <div class="financials-chart-header">
        <p v-if="showPercentOnLeftAxis" style="padding-left: 20px;">%</p>
        <p v-else-if="isLeftAxis">{{ company.data.currency === 'USD' ? 'US$' :
        company.data.currency }}<br>Millions</p>
        <p v-else></p>
        <button @click="forecastMenu = !forecastMenu">
          {{ company.forecast.value ? company.forecast.value.name : 'Forecast' }}
          <img
            :class="{
              'reversed-arrow': forecastMenu,
            }"
            src="@/assets/icons/arrow-down-smooth.svg"
            alt="Arrow"
          >
          <div class="forecast-menu" v-if="forecastMenu">
            <button
              class="forecast-button"
              :class="{
                'forecast-button__active': !company.forecast.value,
              }"
              @click="company.setForecast(undefined)"
            >Averages</button>
            <button
              v-for="(forecast, index) in company.forecasts"
              :key="index"
              class="forecast-button"
              :class="{
                'forecast-button__active': forecast.id == company.forecast.value?.id
              }"
              @click="company.setForecast(forecast)"
            >{{ forecast.name }}</button>
          </div>
        </button>
        <p v-if="rightAxis === 'ratio'">{{ company.data.currency === 'USD' ? 'US$' :
        company.data.currency }} Per<br>Share</p>
        <p v-else-if="rightAxis === 'percentage'">%</p>
        <p v-else></p>
      </div>
      <Line :data="chartData" :options="chartOptions" />
      <ul class="financials-chart-legend">
        <li
          v-for="(item, index) in chartData.datasets"
          :key="index"
        >
          <span :style="{ background: getDataColor(item) }"></span>
          <p>{{ item.label }}</p>
        </li>
      </ul>
    </Card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  PropType,
  onUpdated,
  ref,
} from 'vue';

import { Line } from 'vue-chartjs';
import { ChartDataset, ChartOptions, ChartData as ChartJSData } from 'chart.js';

import Card from '@/components/ui/CardComponent.vue';
import Checkbox from '@/components/ui/CheckboxComponent.vue';

import { TableData, TableRow } from '@/components/ui/table/types';

import { Financial } from '@/rest-api/companies/assets';

import { useCompiler } from '@/controllers/compiler';
import { CompanyController } from '@/controllers/company/types';

import { percentage } from '@/services/renderers';

import { ratio } from '@/components/ui/table/types/renderers';
import { useStore } from 'vuex';
import { SELECTED_ROWS } from '@/store/actions/application';
import chartOptions from './data/chart';
import { tableRows, chartRows } from './data/rows';
import { viewControl } from './data/controls';

export default defineComponent({
  name: 'FinancialsChart',
  components: {
    Card,
    Checkbox,
    Line,
  },
  props: {
    company: {
      type: Object as PropType<CompanyController>,
      required: true,
    },
    data: {
      type: Object as PropType<TableData>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const selectedRows:TableRow[] = reactive(store.state.application.selectedRows);
    const forecastMenu = ref(false);

    const computedData = computed(() => props.data);
    const myChartRows = ref(chartRows);
    const { compile, clearCache } = useCompiler(computedData);

    const hexToRGB = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      } : undefined;
    };

    const showPercentOnLeftAxis = ref(false);

    const chartData = computed<ChartJSData<'line' | 'bar'>>(() => {
      let actualData = props.company.financials.actual;
      if (props.data && props.data.column === 'quarterlyPeriod') {
        actualData = props.company.financials.quarterly;
      }

      const viewCount = props.data?.viewCount ? props.data?.viewCount : 11;
      const financials = [
        // ...props.company.financials.actual,
        ...actualData.slice(-viewCount),
        ...props.company.financials.estimated,
        ...props.company.financials.projected,
      ];

      clearCache();

      const data: ChartJSData<'line' | 'bar'> = {
        labels: [],
        datasets: [],
      };

      const actual = props.company.financials.actual.length;

      selectedRows.forEach((row) => {
        const rowKey = row.key as keyof typeof chartRows;

        if (myChartRows.value[rowKey] === undefined) {
          return;
        }
        if (myChartRows.value[rowKey].type === 'percent') myChartRows.value[rowKey].axis = 'y-left';
        if (showPercentOnLeftAxis.value && myChartRows.value[rowKey].axis === 'y-right' && myChartRows.value[rowKey].type === 'percent') {
          myChartRows.value[rowKey].axis = 'y-left';
        } else if (!showPercentOnLeftAxis.value && myChartRows.value[rowKey].axis === 'y-left' && myChartRows.value[rowKey].type === 'percent') {
          myChartRows.value[rowKey].axis = 'y-right';
        }
        const chartRow = myChartRows.value[rowKey];
        const dataset: number[] = [];

        financials.forEach((financial) => {
          let label = financial.year;
          if (props.data && props.data.column === 'quarterlyPeriod' && financial.quarter) {
            // label = `Q${financial.quarter}'${financial.year}`;
            label = financial.quarterlyPeriod;
          }

          if (data.labels && !data.labels.includes(label)) {
            data.labels.push(label);
          }

          const key = row.key as keyof Financial;
          let value = compile(financial[key] !== undefined ? financial[key] : 0, financial);

          if (typeof value !== 'number') {
            value = 0;
          }

          dataset.push(value);
        });

        let datasetSpecify: any;
        const datasetDefault: ChartDataset<'line' | 'bar'> = {
          label: row.name,
          data: dataset,
          yAxisID: chartRow.axis,
          pointRadius: 0,
          fill: true,
        };

        if (chartRow.axis === 'y-right') {
          datasetSpecify = {
            type: 'line',
            borderWidth: 3,
            borderColor: (context: any) => {
              const rgb = hexToRGB(chartRow.color);
              if (context.dataset && rgb && context.dataset.data.length > 0) {
                const { ctx, chartArea } = context.chart;
                if (!chartArea) {
                  // If chartArea is not defined, return a default color or gradient
                  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
                }
                const transparentIndex = props.data?.viewCount === 6 ? 6 : actual;
                const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
                gradient.addColorStop((transparentIndex + 0.5) / context.dataset.data.length, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
                gradient.addColorStop((transparentIndex + 0.5) / context.dataset.data.length, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .4)`);
                gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .4)`);
                return gradient;
              }
              return undefined;
            },
            backgroundColor: 'transparent',
          };
        } else {
          datasetSpecify = {
            type: 'bar',
            backgroundColor: (color: any) => {
              if (color.index >= actual) {
                const rgb = hexToRGB(chartRow.color);
                if (rgb !== undefined) {
                  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .4)`;
                }
              }
              return color.index < actual ? chartRow.color : 'black';
            },
            barThickness: 6,
            borderRadius: 2,
          };
        }

        data.datasets?.push({
          ...datasetDefault,
          ...datasetSpecify,
        });
      });

      return data;
    });

    const toggleSelect = (row: TableRow, selectedIndex: number) => {
      const index = selectedRows.indexOf(row);
      if (index >= 0) {
        selectedRows.splice(index, 1);
      } else {
        selectedRows.push(row);
      }
      let isPershareAxis = false;
      let isPercentAxis = false;
      let isMillionsAxis = false;

      selectedRows.forEach((row) => {
        const rowKey = row.key as keyof typeof chartRows;
        const chartRow = myChartRows.value[rowKey];
        if (chartRow === undefined) {
          return;
        }

        if (chartRow.type === 'millions') isMillionsAxis = true;
        if (chartRow.type === 'percent') isPercentAxis = true;
        if (chartRow.type === 'perShare') isPershareAxis = true;
      });
      const isPercentOnLeftAxis = !isMillionsAxis && isPershareAxis && isPercentAxis;
      showPercentOnLeftAxis.value = isPercentOnLeftAxis;
      store.commit(SELECTED_ROWS, selectedRows);
    };
    const isLeftAxis = computed(() => selectedRows.some((row) => {
      const rowKey = row.key as keyof typeof chartRows;
      const chartRow = myChartRows.value[rowKey];
      return chartRow && chartRow.axis === 'y-left';
    }));
    const chartOptions = computed<ChartOptions>(() => {
      const leftAxisRange = showPercentOnLeftAxis.value ? 100 : 10e5;
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            titleFont: {
              size: 12,
              family: 'Gilroy',
            },
            bodyFont: {
              size: 12,
              family: 'Gilroy',
              style: 'normal',
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          'y-right': {
            type: 'linear',
            position: 'right',
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              display: true,
              padding: 10,
              color: '#808080',
              font: {
                size: 10,
                family: 'Gilroy',
                style: 'normal',
                lineHeight: 2,
              },
            },
          },
          'y-left': {
            type: 'linear',
            position: 'left',
            grid: {
              display: true,
              drawOnChartArea: true,
              drawTicks: false,
            },
            border: {
              display: false,
            },
            suggestedMin: 0,
            suggestedMax: leftAxisRange,
            ticks: {
              display: showPercentOnLeftAxis.value || isLeftAxis.value,
              padding: 10,
              color: '#808080',
              font: {
                size: 10,
                family: 'Gilroy',
                style: 'normal',
                lineHeight: 2,
              },
              callback: (tickValue, index, ticks) => {
                if (typeof tickValue === 'number') {
                  // const value = tickValue / 10e5;
                  const value = showPercentOnLeftAxis.value ? tickValue : tickValue / 10e5;
                  if (value < 0) {
                    return `(${Math.abs(value).toLocaleString()})`;
                  }

                  return value.toLocaleString();
                }

                return tickValue;
              },
            },
          },
          x: {
            offset: true,
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              display: true,
              color: '#808080',
              padding: 20,
              font: {
                size: 10,
                family: 'Gilroy',
                style: 'normal',
                lineHeight: 2,
              },
            },
          },
        },
      };
    });
    // check if right axis represents a percentage...
    const rightAxis = computed(() => {
      const rows = selectedRows.filter((row) => {
        const rowKey = row.key as keyof typeof chartRows;
        const chartRow = myChartRows.value[rowKey];
        return chartRow.axis === 'y-right';
      });

      const isRatio = !rows.every((row) => row.handler === percentage);

      if (isRatio) {
        return 'ratio';
      }

      return rows.length > 0 && 'percentage';
    });

    const getDataColor = (item: ChartDataset): string => {
      if (typeof item.backgroundColor === 'function') {
        const color = item.backgroundColor({ index: 0 } as any, {});

        if (color !== undefined) {
          return color as string;
        }
      }
      const tableRow = tableRows.find((row) => row.name === item.label);
      if (tableRow === undefined) {
        return 'black';
      }
      const rowKey = tableRow.key as keyof typeof chartRows;
      const chartRow = chartRows[rowKey];
      if (chartRow === undefined) {
        return 'black';
      }
      return chartRow.color;
    };

    onUpdated(() => {
      clearCache();
    });

    return {
      forecastMenu,
      selectedRows,
      showPercentOnLeftAxis,
      tableRows,
      chartOptions,
      chartData,
      toggleSelect,
      getDataColor,
      isLeftAxis,
      rightAxis,
    };
  },
});
</script>

<style scoped>
.financials-chart {
  display: flex;
  gap: 16px;
  max-height: 562px;
}

.financials-chart > .card {
  max-height: 100%;
  padding-right: 16px;
}

.financials-chart > .card:last-child {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.financials-chart > .card:last-child canvas {
  height: calc(100% - 60px) !important;
  max-height: 100%;
  max-width: 100% !important;
  width: 100% !important;
  flex: 0 0 calc(100% - 60px);
}

.financials-chart .financials-chart-control {
  max-height: 100%;
  overflow-y: auto;
  padding-right: 16px;
}

.financials-chart .financials-chart-control::-webkit-scrollbar {
  width: 4px;
}

.financials-chart .financials-chart-control::-webkit-scrollbar-track {
  background: var(--theme-text-gray-2);
}

.financials-chart .financials-chart-control::-webkit-scrollbar-thumb {
  border-radius: 5px;
  border: 3px solid var(--theme-link-color);
}

.financials-chart .financials-chart-control > .financials-chart-value {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 0 6px 0;
  border-bottom: 1px solid var(--theme-background-color);
  padding-right: 16px;
}

.financials-chart .financials-chart-control > .financials-chart-value:last-child {
  border-bottom: none;
}

.financials-chart .financials-chart-control > .financials-chart-value > span {
  display: block;
  width: 12px;
  font-size: 10px;
  font-weight: 400;
  color: var(--theme-text-gray-3);
}

.financials-chart .financials-chart-control > .financials-chart-value > p {
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-text-color-2);
}

.financials-chart .financials-chart-legend {
  flex: 0 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  list-style-type: none;
  padding: 0 20px;
  height: 16px;
}

.financials-chart .financials-chart-legend > li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.financials-chart .financials-chart-legend > li > span {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.financials-chart .financials-chart-legend > li > p {
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-text-color-2);
}

.financials-chart .financials-chart-header {
  flex: 0 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.financials-chart .financials-chart-header > p {
  font-size: 10px;
  font-weight: 400;
  color: var(--theme-text-color-2);
  text-transform: uppercase;
}

.financials-chart .financials-chart-header > p:first-child {
  text-align: right;
}

.financials-chart .financials-chart-header > button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 800;
  color: var(--theme-text-color-2);
  border: none;
  outline: none;
  background: none;
  text-transform: uppercase;
  cursor: pointer;
}

.financials-chart .forecast-menu {
  position: absolute;
  top: calc(100% + 15px);
  left: 50%;
  transform: translateX(-50%);
  width: 286px;
  background: var(--theme-text-color-contrast);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0px 8px 18px 0px rgba(0, 0, 0, 0.06);
  z-index: 2;
}

.financials-chart .forecast-menu > .forecast-button {
  width: 100%;
  outline: none;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  background: none;
  text-align: left;
  cursor: pointer;
}

.financials-chart .forecast-menu > .forecast-button__active {
  background: #F4F6FF;
}

.financials-chart .reversed-arrow {
  transform: rotateX(180deg);
}
</style>
