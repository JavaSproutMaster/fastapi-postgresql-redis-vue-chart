<!-- eslint-disable max-len -->
<template>
  <div class="performance">
    <div class="performance-menu">
      <a class="active" href="#summary">Summary</a>
      <a href="#notes">Notes</a>
      <a href="#question-answers">Q&A</a>
      <a href="#financials">Financials</a>
      <a href="#financials">Forecast</a>
      <a href="#value-estimate">Other</a>
    </div>
    <Card class="performance-chart" :loading="company.financials.actual.length === 0">
      <div class="performance-header">
        <h4>Financial Performance</h4>
        <div class="performance-params">
          <div class="performance-params-btn">Compare</div>
          <Dropdown class="list-header-button"
          :gap="'4px'"
          :menuWidth="'200px'" :menuTransform="'none'">
            <div class="performance-params-btn">Add Parameter</div>
            <template #content>
              <CollapseComponent
              :bg-color="'#F4F6FF'"
              :text="'Per Share'" :active="selectedFieldsAddParams === 'perShare'" :btnWidth="'100%'"
                v-on:click-collapse="toggleCollapseAddPrams('perShare')">
                <div class="list-column-fields">
                  <div v-for="(field, index) in filteredPerShareFields" :key="index" class="list-column-field-item">
                    <Checkbox v-model:value="field.value" v-on:update:value="toggleFields(field)" />
                    {{ field.name }}
                  </div>
                </div>
              </CollapseComponent>
              <CollapseComponent
              :bg-color="'#F4F6FF'"
              :text="'PL'" :active="selectedFieldsAddParams === 'pl'" :btnWidth="'100%'"
                v-on:click-collapse="toggleCollapseAddPrams('pl')">
                <div class="list-column-fields">
                  <div v-for="(field, index) in filteredPlFields" :key="index" class="list-column-field-item">
                    <Checkbox v-model:value="field.value" v-on:update:value="toggleFields(field)" />
                    {{ field.name }}
                  </div>
                </div>
              </CollapseComponent>
              <CollapseComponent
              :bg-color="'#F4F6FF'"
              :text="'CF'" :active="selectedFieldsAddParams === 'cf'" :btnWidth="'100%'"
                v-on:click-collapse="toggleCollapseAddPrams('cf')">
                <div class="list-column-fields">
                  <div v-for="(field, index) in filteredCfFields" :key="index" class="list-column-field-item">
                    <Checkbox v-model:value="field.value" v-on:update:value="toggleFields(field)" />
                    <div>
                      {{ field.name }}
                    </div>
                  </div>
                </div>
              </CollapseComponent>
              <CollapseComponent
              :bg-color="'#F4F6FF'"
              :text="'BS'" :active="selectedFieldsAddParams === 'bs'" :btnWidth="'100%'"
                v-on:click-collapse="toggleCollapseAddPrams('bs')">
                <div class="list-column-fields">
                  <div v-for="(field, index) in filteredBsFields" :key="index" class="list-column-field-item">
                    <Checkbox v-model:value="field.value" v-on:update:value="toggleFields(field)" />
                    {{ field.name }}
                  </div>
                </div>
              </CollapseComponent>
              <CollapseComponent
              :bg-color="'#F4F6FF'"
              :text="'Valuation'" :active="selectedFieldsAddParams === 'valuation'" :btnWidth="'100%'"
                v-on:click-collapse="toggleCollapseAddPrams('valuation')">
                <div class="list-column-fields">
                  <div v-for="(field, index) in filteredValuationFields" :key="index" class="list-column-field-item">
                    <Checkbox v-model:value="field.value" v-on:update:value="toggleFields(field)" />
                    {{ field.name }}
                  </div>
                </div>
              </CollapseComponent>
              <CollapseComponent
              :bg-color="'#F4F6FF'"
              :text="'Other'" :active="selectedFieldsAddParams === 'other'" :btnWidth="'100%'"
                v-on:click-collapse="toggleCollapseAddPrams('other')">
                <div class="list-column-fields">
                  <div v-for="(field, index) in filteredOtherFields" :key="index" class="list-column-field-item">
                    <Checkbox v-model:value="field.value" v-on:update:value="toggleFields(field)" />
                    {{ field.name }}
                  </div>
                </div>
              </CollapseComponent>
            </template>
          </Dropdown>
          <div class="performance-params-btn">Expand</div>
          <div class="performance-params-btn">Share <img src="@/assets/icons/share.svg" alt="Share"></div>
        </div>
      </div>
      <!-- <div class="performance-control performance-control-top">
        <div class="performance-control-stats">
          <p>
            5Y price score: 110
            <Help />
          </p>
          <p>10Y return: 267.5%</p>
        </div>
      </div> -->
      <div class="performance-control">
        <div class="performance-control-buttons">
          <Button
            v-for="(type, index) in availableTypes"
            :key="index"
            :type="currentType === type ? 'secondary' : 'transparent'"
            size="small"
            @click="selectType(type)"
          >{{ type }}</Button>
          <Button type="transparent" size="small">Log</Button>
        </div>
        <div class="performance-control-stats">
          <p>
            5Y price score: 110
            <Help />
          </p>
          <p>10Y return: {{ totalReturn10Y }}</p>
          <!-- <p></p> -->
        </div>
        <div class="performance-control-range">
          DATE RANGE:
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
      <Chart :company="company" :period="currentRange" :type="currentType" :rows="updatedChartParams"/>
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
import Help from '@/components/ui/HelpComponent.vue';
import { DropdownComponent as Dropdown } from '@/components/ui/dropdown';

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
import Checkbox from '@/components/ui/CheckboxComponent.vue';
import CollapseComponent from '@/components/ui/CollapseComponent.vue';

import { useStore } from 'vuex';
import { CHART_PARAMS, CHART_PERIOD } from '@/store/actions/application';
import { ChartField, CheckBoxField } from '@/components/ui/table-column/types';
import { percentage } from '@/services/renderers';
import Chart from './chart';

export default defineComponent({
  name: 'CompanyFinancialPerformance',
  components: {
    Button,
    Card,
    Help,
    Chart,
    Dropdown,
    Checkbox,
    CollapseComponent,
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
    const filteredPerShareFields = ref(perShareFields);
    const filteredCfFields = ref(cfFields);
    const filteredBsFields = ref(bsFields);
    const filteredPlFields = ref(plFields);
    const filteredValuationFields = ref(valuationFields);
    const filteredOtherFields = ref(otherFields);
    const storedType = localStorage.getItem('chart-type');
    const currentType = ref<string>(storedType || availableTypes[0]);
    const selectedFieldsAddParams = ref<string | undefined>(undefined);
    const totalReturn10Y = computed(() => percentage(props.company.valuation.totalReturn10y));
    const initialFilteredFields = (initFields: CheckBoxField[], checkedFields: string[]) => {
      if (checkedFields.length === 0) return initFields;
      const fields: CheckBoxField[] = initFields.map((f: CheckBoxField) => ({
        ...f, // Spread the existing properties of f
        value: checkedFields.includes(f.key), // Set the value based on the condition
      }));
      return fields;
    };
    const storedParams = JSON.parse(localStorage.getItem('chart-params') || JSON.stringify(initialChartParams));
    const updatedChartParams = computed(() => {
      const rows = store.state.application.chartParams.map((key: string) => {
        const chartRow: any = chartFields.find((field: ChartField) => field.key === key);
        return chartRow;
      }).filter(Boolean);
      return rows;
    });
    const chartParams = ref<string[]>(storedParams);
    const initialFields = () => {
      filteredPerShareFields.value = initialFilteredFields(perShareFields, storedParams);
      filteredCfFields.value = initialFilteredFields(cfFields, storedParams);
      filteredBsFields.value = initialFilteredFields(bsFields, storedParams);
      filteredPlFields.value = initialFilteredFields(plFields, storedParams);
      filteredValuationFields.value = initialFilteredFields(valuationFields, storedParams);
      filteredOtherFields.value = initialFilteredFields(otherFields, storedParams);
    };
    const selectRange = (range: string): void => {
      store.commit(CHART_PERIOD, range);
      localStorage.setItem('chart-range', range);
      currentRange.value = range;
    };
    const toggleFields = (field: CheckBoxField) => {
      // check the fields
      // let currentFields: CheckBoxField[] = [];
      // const selectedParams = chartParams.value;

      const exist = chartParams.value.find((f: string) => f === field.key);
      if (!exist) chartParams.value.push(field.key);
      else {
        chartParams.value.forEach((f: string, index: number) => {
          if (f === field.key) {
            chartParams.value.splice(index, 1);
          }
        });
      }
      // chartParams.value = selectedParams;
      localStorage.setItem('chart-params', JSON.stringify(chartParams.value));
      store.commit(CHART_PARAMS, chartParams.value);
    };
    const toggleCollapseAddPrams = (val: string) => {
      if (selectedFieldsAddParams.value === val) {
        selectedFieldsAddParams.value = undefined;
      } else selectedFieldsAddParams.value = val;
    };
    const selectType = (type: string): void => {
      localStorage.setItem('chart-type', type);
      currentType.value = type;
    };

    onMounted(() => {
      initialFields();
    });

    return {
      availableRanges,
      availableTypes,
      currentRange,
      storedType,
      currentType,
      perShareFields,
      cfFields,
      bsFields,
      plFields,
      valuationFields,
      otherFields,
      filteredPerShareFields,
      filteredCfFields,
      filteredBsFields,
      filteredPlFields,
      filteredValuationFields,
      filteredOtherFields,
      chartParams,
      selectedFieldsAddParams,
      updatedChartParams,
      totalReturn10Y,
      toggleFields,
      selectRange,
      selectType,
      toggleCollapseAddPrams,
    };
  },
});
</script>

<style>
.performance {
  margin-bottom: 16px;
}

.performance > .performance-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.performance  > .performance-menu > a {
  border-radius: 100px;
  padding: 5px 12px;
  color: var(--theme-link-color);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
}

.performance > .performance-menu > .active {
  background: var(--theme-link-color);
  color: var(--theme-text-color-contrast);
}

.performance > .performance-chart > .performance-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.performance > .performance-chart > .performance-header > .performance-params {
  display: flex;
  align-items: center;
  gap: 16px;
}

.performance > .performance-chart > .performance-header > .performance-params
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

.performance > .performance-chart > .performance-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
  font-weight: 600;
  gap: 16px;
}

.performance > .performance-chart > .performance-control.performance-control-top {
  display: none;
  justify-content: center;
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
