<template>
  <div class="financials-header">
    <div class="financials-title">
      <h1>Financials</h1>
      <p>all figures in US$ Millions except per share data</p>
    </div>
    <div class="financials-control financials-control__type">
      <Button
        v-for="(type, index) in typeControl"
        :key="index"
        :type="selectedType === type ? 'secondary' : 'transparent'"
        size="small"
        @click="changeType(type)"
      >{{ type }}</Button>
    </div>
    <div class="financials-control">
      <p>Periods:</p>
      <div class="financials-control-values">
        <Button
          v-for="(period, index) in periodControl"
          :key="index"
          :visuallyDisabled="selectedPeriod !== period"
          type="transparent"
          size="small"
          @click="changePeriod(period)"
        >{{ period }}</Button>
      </div>
    </div>
    <div class="financials-control">
      <p>View:</p>
      <div class="financials-control-values">
        <Button
          v-for="(view, index) in viewControl"
          :key="index"
          :visuallyDisabled="selectedView !== view"
          type="transparent"
          size="small"
          @click="changeView(view)"
        >{{ view }}</Button>
      </div>
    </div>
    <div class="financials-control">
      <div class="financials-forecast" style="display: inline-flex">
        <p>Forecast:</p>
        <Help style="
        padding: 8px 0;
        margin-left: 4px;"
        align="top_right"
        hoverWidth="225px"
        hoverPadding="12px 20px 12px 20px">
          <div style="
          color: #3348FB;
          text-align: left;">
            <div style="margin-bottom: 8px;">
              <p class="help-subtitle">
                Averages
              </p>
              <p class="help-description"
              v-text="`based on historical growth rates (CAGR) and average margins for last
              10 or max, available and up to 10 years.`">
              </p>
            </div>
            <div style="margin-bottom: 8px;">
              <p class="help-subtitle">
                  Analysts
              </p>
              <p class="help-description"
                v-text="`consensus estimates of analysts that cover the stock.`">
              </p>
            </div>
            <div>
              <p class="help-subtitle">
                Custom
              </p>
              <p class="help-description"
              v-text="`you can edit default forecast based on averages or analysts consensus
              and use it to calculate fair value based on your assumptions.`">
              </p>
            </div>
          </div>
        </Help>
      </div>
      <div class="financials-control-values">
        <Button
          v-for="(forecast, index) in forecastControl"
          :key="index"
          :visually-disabled="selectedForecast !== forecast"
          type="transparent"
          size="small"
          @click="company.setForecast(
            forecast === forecastControl.CUSTOM ? company.forecasts[0] : undefined
          )"
        >{{ forecast }}</Button>
      </div>
    </div>
    <div class="financials-control">
      <p>ㅤ</p>
      <div class="financials-control-values">
        Show forecast vs demo <Checkbox v-model:value="isCompare" />
      </div>
    </div>
    <Button
      style="cursor: default !important;"
      :visually-disabled="isCommentEnabled"
      @click="toggleComment"
      v-if="route.name === 'company'"
    >Add Comment</Button>
    <Button
      style="cursor: default !important;"
      :visually-disabled="isCommentEnabled"
      @click="toggleComment"
      v-if="route.name === 'companyFinancial'"
    >Share</Button>

</div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType,
} from 'vue';
import { useStore } from 'vuex';

import Help from '@/components/ui/HelpComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Checkbox from '@/components/ui/CheckboxComponent.vue';

import { CompanyController } from '@/controllers/company/types';

import { COMMENT_CURSOR, PERIOD_TYPE, VIEW_TYPE } from '@/store/actions/application';

import { useRoute } from 'vue-router';
import * as controls from './data/controls';

export default defineComponent({
  name: 'FinancialsHeader',
  components: {
    Button,
    Help,
    Checkbox,
  },
  props: {
    company: {
      type: Object as PropType<CompanyController>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const isCompare = ref(false);
    const selectedType = ref(localStorage.getItem('financials-type') || controls.typeControl.TABLE);
    const selectedPeriod = ref(localStorage.getItem('financials-period') || controls.periodControl.ANNUAL);
    const selectedView = ref(localStorage.getItem('financials-view') || controls.viewControl.EXTENDED);

    const selectedForecast = computed(() => {
      if (props.company.forecast.value !== undefined) {
        return 'custom';
      }
      return 'averages';
    });
    const changeType = (newType: controls.typeControl) => {
      localStorage.setItem('financials-type', newType);
      selectedType.value = newType;
    };

    const changePeriod = (newPeriod: controls.periodControl) => {
      localStorage.setItem('financials-period', newPeriod);
      selectedPeriod.value = newPeriod;
      store.commit(PERIOD_TYPE, newPeriod.toUpperCase());
    };

    const changeView = (newView: controls.viewControl) => {
      localStorage.setItem('financials-view', newView);
      selectedView.value = newView;
      store.commit(VIEW_TYPE, newView.toUpperCase());
    };

    const isCommentEnabled = computed(() => store.state.application.commentCursor);

    const toggleComment = () => {
      store.commit(COMMENT_CURSOR, !store.state.application.commentCursor);
    };

    return {
      isCompare,
      route,
      selectedType,
      selectedPeriod,
      selectedView,
      selectedForecast,
      ...controls,
      changeType,
      changePeriod,
      changeView,
      isCommentEnabled,
      toggleComment,
    };
  },
});
</script>

<style scoped>
.financials-header {
  display: flex;
  flex-wrap: wrap;
  column-gap: 24px;
  grid-gap: 10px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.financials-header > .financials-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.financials-header > .financials-title > p {
  font-size: 12px;
  color: var(--theme-text-color-2);
  max-width: 134px;
  line-height: 14px;
}

.financials-header > .financials-control.financials-control__type {
  display: flex;
  align-items: center;
}

.financials-header > .financials-control.financials-control__type > button {
  padding: 5px 16px !important;
}

.financials-header > .financials-control > p {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
  text-transform: uppercase;
}

.financials-header > .financials-control .financials-forecast > p {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
  text-transform: uppercase;
}

.financials-header > .financials-control > .financials-control-values {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-link-color);
  text-transform: uppercase;
}

.financials-header > .financials-control > .financials-control-values > * {
  cursor: pointer;
}

@media screen and (max-width: 1352px) {
  .financials-header,
  .financials-header p,
  .financials-header button,
  .financials-header > .financials-control > .financials-control-values {
    font-size: 10px !important;
  }
}

@media screen and (max-width: 1220px) {
  .financials-header > button {
    padding: 9px 18px !important;
  }

  .financials-header > .financials-control.financials-control__type > button {
    padding: 4px 14px !important;
  }
}

.help-subtitle {
  font-weight: 600;
  font-size: 12px;
  line-height: 14.32px;
}

.help-description {
  padding-bottom: 4px;
  font-weight: 400;
  font-size: 12px;
  line-height: 13.92px;
}
</style>
