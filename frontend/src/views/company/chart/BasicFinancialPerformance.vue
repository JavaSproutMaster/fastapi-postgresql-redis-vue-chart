<!-- eslint-disable max-len -->
<template>
  <div class="performance">
    <Card class="performance-chart">
      <div class="performance-header">
        <h4>Financial Performance</h4>
        <button class="toggle-expand down"
        @click="expand = !expand"
        v-if="expand">
          <img src="@/assets/icons/arrow-up-round.svg" alt="arrow-up" />
        </button>
        <button
        @click="expand = !expand"
        class="toggle-expand up" v-else>
          <img src="@/assets/icons/arrow-down-round.svg" alt="arrow-up" />
        </button>
      </div>
      <div class="performance-control" v-if="expand">
        <div class="performance-control-range">
          <p>DATE RANGE:</p>
          <Button
            v-for="(range, index) in availableRanges"
            :key="index"
            type="transparent"
            size="small"
            :visually-disabled="currentRange !== range"
            @click="selectRange(range)"
          >{{ range }}</Button>
        </div>
      </div>
      <Chart :company="company" :period="currentRange" :type="currentType" :rows="updatedChartParams"
      :kind="'basic'" v-if="expand"/>
    </Card>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
} from 'vue';

import Button from '@/components/ui/ButtonComponent.vue';
import Card from '@/components/ui/CardComponent.vue';
import { CompanyController } from '@/controllers/company/types';

import {
  perShareFields,
  availableRanges,
  availableTypes,
  bsFields, cfFields,
  otherFields,
  plFields,
  valuationFields,
  initialChartParams,
  chartFields,
} from '@/data/chart';

import { useStore } from 'vuex';
import { CHART_PARAMS, CHART_PERIOD } from '@/store/actions/application';
import { ChartField, CheckBoxField } from '@/components/ui/table-column/types';
import { percentage } from '@/services/renderers';
import Chart from './component.vue';

export default defineComponent({
  name: 'BasicFinancialPerformance',
  components: {
    Button,
    Card,
    Chart,
  },
  props: {
    company: {
      type: Object as PropType<CompanyController>,
      required: true,
    },
  },
  setup(props) {
    const storedRange = localStorage.getItem('chart-range');
    const currentRange = ref<string>(storedRange || availableRanges[0]);
    const store = useStore();
    const expand = ref(true);
    const currentType = ref<string>(availableTypes[1]);
    const totalReturn10Y = computed(() => percentage(props.company.valuation.totalReturn10y));
    const updatedChartParams = computed(() => {
      const storedParams = ['stockPrice'];
      const rows = storedParams.map((key: string) => {
        const chartRow: any = chartFields.find((field: ChartField) => field.key === key);
        return chartRow;
      }).filter(Boolean);
      return rows;
    });

    const selectRange = (range: string): void => {
      store.commit(CHART_PERIOD, range);
      localStorage.setItem('chart-range', range);
      currentRange.value = range;
    };

    return {
      expand,
      availableRanges,
      availableTypes,
      currentRange,
      currentType,
      updatedChartParams,
      selectRange,
    };
  },
});
</script>

<style>
.notes-body-right .performance > .performance-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.notes-body-right .performance > .performance-chart > .performance-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0px;
}
.notes-body-right .performance > .performance-chart > .performance-header > .performance-params {
  display: flex;
  align-items: center;
  gap: 16px;
}
.notes-body-right .performance > .performance-chart > .performance-header > .performance-params
.performance-params-btn {
  display: flex;
  align-items: center;
  border: none;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--theme-link-color);
  background: none;
}
.notes-body-right .performance > .performance-chart > .performance-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
}
.performance > .performance-chart > .performance-control > .performance-control-buttons {
  display: flex;
  gap: 18px;
}
.performance > .performance-chart > .performance-control > .performance-control-stats {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--theme-text-gray-2);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 8px;
}
.performance > .performance-chart > .performance-control > .performance-control-stats > p {
  display: flex;
  align-items: center;
  gap: 5px;
}
.performance > .performance-chart > .performance-control > .performance-control-range {
  display: flex;
  align-items: center;
  font-size: 12px;
  flex-wrap: wrap;
  font-weight: 600;
  gap: 10px;
}
.performance > .performance-chart > .performance-control.performance-control-top {
  display: none;
  justify-content: center;
}
button.toggle-expand {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}
@media screen and (max-width: 1370px) {
  .performance > .performance-chart > .performance-control.performance-control-top {
    display: flex;
  }
  /* .performance > .performance-chart > .performance-control:not(.performance-control-top)
  > .performance-control-stats {
    display: none;
  } */
}
.list-column-fields {
  width: 144px;
  padding: 0 6px;
}
.list-column-field-item {
  width: 140px;
  display: flex;
  align-items: center;
  text-align: left;
  padding: 7px 0;
  font-size: 12px;
  font-weight: 600;
  gap: 8px;
}
.list-column-field-item>.checkbox {
  border-radius: 2px;
  width: 12px !important;
  height: 12px !important;
  border-radius: 1px;
  border: 1.4px solid #9AA6FA !important;
  width: 18px;
  height: 18px;
}
.list-column-field-item> div {
  width: 121px;
}
</style>
