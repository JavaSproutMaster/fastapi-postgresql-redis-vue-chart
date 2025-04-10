<template>
  <div class="company-chart">
    <div class="company-chart-header">
      <template v-if="type === 'rebased'">
        <p>%</p>
        <p>ㅤ</p>
      </template>
      <template v-else-if="kind === 'basic'">
        <!-- <p v-if="data.datasets.some((row) => row.yAxisID === 'y-right')">
          US$ Per<br>Share</p> -->
      </template>
      <template v-else>
        <!-- <p v-if="leftAxis === 'percentage'" style="padding-left: 20px;">%</p> -->
        <p v-if="leftAxis=='millions'">{{ company.data.currency === 'USD' ? 'US$' :
        company.data.currency }}<br/>Millions</p>
        <!-- <p v-if="leftAxis=='pershare'">US$ Per<br>Share</p> -->
        <p v-if="leftAxis==='percentage'">%</p>
        <p v-if="leftAxis==='ratio'">{{ company.data.currency === 'USD' ? 'US$' :
        company.data.currency }}</p>
        <p v-if="!leftAxis"></p>
        <p v-if="rightAxis === 'pershare'">{{ company.data.currency === 'USD' ? 'US$' :
        company.data.currency }} Per<br>Share</p>
        <p
        style="
          padding-right: 10px;
        "
        v-else-if="rightAxis === 'percentage'">
          %
        </p>
        <!-- <p v-if="data.datasets.some((row) => row.yAxisID === 'y-right')">
          US$ Per<br>Share</p> -->
      </template>
    </div>
    <div class="company-chart-wrapper"
    :style="{
      height: kind === 'basic' ? '198px' : '420px'
    }">
      <div class="company-chart-wrapper-preloader" v-if="loading">
        <VueSpinner size="40" color="var(--theme-link-color)" />
      </div>
      <Line :data="data" :options="options" v-if="!loading" />
    </div>
    <ul class="company-chart-legend">
      <li
        v-for="(item, index) in data.datasets"
        :key="index"
      >
        <span :style="{background: item.borderColor as string}"></span>
        <p>{{ item.label }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
} from 'vue';
import { useStore } from 'vuex';

import { Line } from 'vue-chartjs';
import { VueSpinner } from 'vue3-spinners';
import { ChartField } from '@/components/ui/table-column/types';

import { chartFields, companyChartOptions, initialChartParams } from '@/data/chart';
import { percentage } from '@/services/renderers';

import { CompanyController } from '@/controllers/company/types';
import { ChartOptions } from 'chart.js';

import { useChart } from './controller';

export default defineComponent({
  name: 'CompanyChart',
  components: {
    Line,
    VueSpinner,
  },
  props: {
    type: {
      type: String,
      enum: ['rebased', 'absolut'],
      default: 'absolut',
    },
    period: {
      type: String,
      enum: ['10Y', '5Y', '1Y', '6M', '1M', '5D', '1D'],
      default: '10Y',
    },
    company: {
      type: Object as PropType<CompanyController>,
      required: true,
    },
    rows: {
      type: Object as PropType<ChartField[]>,
      required: false,
    },
    kind: {
      type: String,
      enum: ['basic'],
      required: false,
    },
  },
  setup(props) {
    const store = useStore();
    const type = computed(() => props.type);
    const period = computed(() => props.period);
    const isPercentOnLeftAxis = computed(() => {
      let isPershareAxis = false;
      let isPercentAxis = false;
      let isMillionsAxis = false;
      if (props.rows?.length && props.rows?.length > 0) {
        props.rows.forEach((row) => {
          if (row.handler === 'pershare') isPershareAxis = true;
          if (row.handler === 'percentage') isPercentAxis = true;
          if (row.handler === 'millions') isMillionsAxis = true;
        });
      }
      if (props.period === '1D' || props.period === '5D') return false;
      return !isMillionsAxis && isPershareAxis && isPercentAxis;
    });
    const leftAxis = computed(() => {
      if (props.period === '1D' || props.period === '5D' || type.value === 'rebased') return 'ratio';
      if (props.rows?.length && props.rows?.length > 0) {
        const leftRows: ChartField[] = props.rows.filter((field: ChartField) => field.axis === 'y-left');

        if (leftRows && leftRows.length > 0 && leftRows.filter((r: ChartField) => r.handler === 'millions').length > 0) {
          return 'millions';
        }
        if (leftRows && leftRows.length > 0 && leftRows.every((r: ChartField) => r.handler === 'ratio')) {
          return 'ratio';
        }
        // if (!leftRows || leftRows.length === 0) {
        //   return null;
        // }
        // if (leftRows.length === 1 && leftRows[0].handler !== undefined) {
        //   return leftRows[0].handler;
        // }
        // const isRatio = !leftRows.every((row: ChartField) => row.handler === 'percentage');
        // if (isRatio) {
        //   return 'ratio';
        // }
        // return leftRows?.length > 0 && 'millions';
      }
      if (isPercentOnLeftAxis.value) return 'percentage';
      return null;
    });
    const rightAxis = computed(() => {
      if (props.type === 'rebased') return '';
      if (props.rows?.length && props.rows?.length > 0) {
        const rightRows: ChartField[] = props.rows?.filter((field: ChartField) => field.axis === 'y-right');
        if (!rightRows || rightRows.length === 0) {
          return null;
        }
        if (rightRows.length === 1) {
          return rightRows[0].handler;
        }

        const isRatio = !rightRows.every((row: ChartField) => row.handler === 'percentage');

        if (isRatio) {
          return 'pershare';
        }
        return rightRows?.length > 0 && 'percentage';
      }
      return '';
    });
    const options = computed(() => {
      const opt: ChartOptions = {
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
            callbacks: {
              label: (tooltipItem) => {
                // Customize the hover label hereF
                let label = tooltipItem?.dataset?.label;
                const value = tooltipItem.formattedValue;
                if (type.value === 'rebased' || tooltipItem?.dataset?.label === 'Dividend Yield') {
                  label = `${label}: ${parseFloat(value).toFixed(2)} %`;
                  return label;
                }
                return `${label}: ${value}`;
              },
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
              display: false,
              padding: 8,
              color: '#131313',
              font: {
                size: 10,
                family: 'Gilroy',
                style: 'normal',
                lineHeight: 2,
              },
              align: 'inner',
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
            ticks: {
              display: isPercentOnLeftAxis.value || leftAxis.value != null,
              padding: 8,
              color: '#131313',
              font: {
                size: 10,
                family: 'Gilroy',
                style: 'normal',
                lineHeight: 2,
              },
              callback: (tickValue, index, ticks) => {
                let value: any = tickValue;
                if (typeof tickValue === 'number') {
                  // const value = tickValue / 10e5;
                  // if (isPercentOnLeftAxis.value) {
                  if (type.value !== 'rebased' && leftAxis.value === 'millions') {
                    value /= 10e5;
                  }
                  // }
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
      // if (!opt.scales || !opt.scales['y-left'] || !opt.scales['y-left'].ticks) {
      //   return opt;
      // }
      // if (reactiveDataset.some((row) => row.yAxisID === 'y-left')) {
      //   opt.scales['y-left'].ticks.display = true;
      // }
      if (opt.scales && opt.scales['y-left'] && opt.scales['y-left'].ticks) {
        if (leftAxis.value || isPercentOnLeftAxis.value) {
          opt.scales['y-left'].ticks.display = true;
        }
      }
      if (!opt.scales || !opt.scales['y-right'] || !opt.scales['y-right'].ticks) {
        return opt;
      }
      if (rightAxis.value) {
        opt.scales['y-right'].ticks.display = true;
      }

      // if (reactiveDataset.some((row) => row.yAxisID === 'y-right')) {
      //   opt.scales['y-right'].ticks.display = true;
      // }

      return opt;
    });
    const { loading, data } = useChart(
      type,
      period,
      props.company,
      leftAxis.value,
      rightAxis.value,
      isPercentOnLeftAxis.value,
      props.kind,
    );
    return {
      data,
      loading,
      options,
      leftAxis,
      rightAxis,
    };
  },
});
</script>

<style>
.company-chart {
  max-width: 100%;
  width: 100%;
}

.company-chart > .company-chart-wrapper {
  position: relative;
}

.company-chart > .company-chart-wrapper > .company-chart-wrapper-preloader {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: var(--theme-text-color-contrast);
}

.company-chart > .company-chart-wrapper > canvas {
  max-width: 100% !important;
  width: 100% !important;
}

.company-chart > .company-chart-legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  list-style-type: none;
  padding: 0 20px;
  height: 16px;
}

.company-chart > .company-chart-legend > li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.company-chart > .company-chart-legend > li > span {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.company-chart > .company-chart-legend > li > p {
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-text-color-2);
}

.company-chart > .company-chart-header {
  padding: 0 0 0 15px;
  flex: 0 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.company-chart > .company-chart-header > p {
  font-size: 10px;
  font-weight: 400;
  color: var(--theme-text-color-2);
  text-transform: uppercase;
}
</style>
