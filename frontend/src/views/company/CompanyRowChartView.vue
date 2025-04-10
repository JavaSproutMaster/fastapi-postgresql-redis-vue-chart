<template>
  <Container>
    <div class="financial-path">
      <div>
        {{ symbol }}
      </div>
      <div class="financial-path-ellapse">
      </div>
      <div>
        FINANCIALS
      </div>
      <div class="financial-path-ellapse">
      </div>
      <div>
        PL
      </div>
      <div class="financial-path-ellapse">
      </div>
      <div class="first-row-label">
        {{ firstRow?.name }}
      </div>
    </div>
    <Header :company="company" />
    <div class="company-summary">
      <div class="company-summary-left">
        <div class="performance">
          <div class="performance-menu">
            <a href="#summary">Summary</a>
            <a href="#notes">Notes</a>
            <a href="#question-answers">Q&A</a>
            <a class="active" href="#financials">Financials</a>
            <a href="#financials">Forecast</a>
            <a href="#value-estimate">Other</a>
          </div>
        </div>
      </div>
    </div>
    <Financials id="financials" :company="company" />
    <Reports :company="company" />
  </Container>
  <ForecastModal v-on:save="createForecast" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import { useCompany } from '@/controllers/company';

import { LOADING, HIDE_MODAL, SELECTED_ROWS } from '@/store/actions/application';

import Container from '@/components/ContainerComponent.vue';

import ForecastModal from '@/components/modals/ForecastModal.vue';

import { TableRow } from '@/components/ui/table/types';
import Header from './CompanyHeader.vue';
import Financials from './financials/chartTable.vue';
import Reports from './CompanyReports.vue';
import { tableRows } from './financials/data/rows';

export default defineComponent({
  name: 'CompanyRowChartView',
  components: {
    Container,
    ForecastModal,
    Header,
    Financials,
    Reports,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const symbol = route.params.symbol as string;
    const firstRow = tableRows.find((row) => row.key === route.params.rowKey) as TableRow;
    const company = useCompany(symbol);
    store.commit(SELECTED_ROWS, [firstRow]);
    store.commit(LOADING, true);

    const createForecast = (name: string) => {
      company.createForecast(name).then(() => {
        store.commit(HIDE_MODAL);
      });
    };

    onMounted(() => {
      company.update().finally(() => {
        store.commit(LOADING, false);
      });
    });

    return {
      symbol,
      firstRow,
      company,
      createForecast,
    };
  },
});
</script>

<style>
.container .financial-path {
  font-weight: 600;
  font-size: 12px;
  line-height: 14.32px;
  padding-bottom: 17px;
  color: #131313;
  display: inline-flex;
  gap: 8px;
  align-items: center;
}
.container .financial-path .financial-path-ellapse {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #131313;
}
.container .financial-path .first-row-label {
  color: #808080;
  margin-left: 4px;
  font-weight: 600;
}

.company-summary {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.company-summary > .company-summary-left {
  flex: 1;
}

.company-summary > .company-summary-right {
  flex: 0 0 467px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
