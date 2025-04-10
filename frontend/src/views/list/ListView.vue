<template>
  <Container class="lists-container">
    <Header :list="list" v-on:update="update" v-on:remove-symbols="removeCompanies" />
    <Table :list="list" :updating="updating" v-model:period="period"
    :removedFields="removedFields"/>
  </Container>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import * as api from '@/rest-api/lists';
import { List } from '@/rest-api/lists/assets';

import { LOADING } from '@/store/actions/application';

import Container from '@/components/ContainerComponent.vue';

import Header from './HeaderView.vue';
import Table from './TableView.vue';

export default defineComponent({
  name: 'ListView',
  components: {
    Container,
    Header,
    Table,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const updating = ref(false);
    const period = ref('10Y');
    const list = ref<List>();

    store.commit(LOADING, true);
    const removedFields = computed(() => store.state.application.listRemoveFields);
    const stockPriceInterval = setInterval(() => {
      const receivedList = list.value;
      receivedList?.companies?.forEach((company) => {
        const instance = company as any;
        api.updatePrice(company.symbol).then((payload) => {
          if (payload && instance.symbol === payload.symbol) {
            instance.stockPrice = payload.stockPrice;
            instance.stockPriceChange = payload.priceChange;
          }
        });
      });
      list.value = receivedList;
    }, 20 * 1000);
    const update = () => {
      updating.value = true;
      api.get(Number(route.params.id), period.value).then((payload) => {
        const receivedList = payload;
        // eslint-disable-next-line max-len
        // receivedList.companies.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLocaleLowerCase()));
        // console.log(receivedList.companies);
        receivedList.companies.forEach((company) => {
          const instance = company as any;
          if (period.value === '10Y') {
            instance.totalReturn = company.totalReturn10y;
            instance.freeCashFlowGrowth = company.freeCashFlowPerShare10y;
            instance.earningsPerShareGrowth = company.earningsPerShare10y;
          } else if (period.value === '5Y') {
            instance.totalReturn = company.totalReturn5y;
            instance.freeCashFlowGrowth = company.freeCashFlowPerShare5y;
            instance.earningsPerShareGrowth = company.earningsPerShare5y;
          } else {
            instance.totalReturn = company.totalReturnLtm;
            instance.freeCashFlowGrowth = company.freeCashFlowPerShareLtm;
            instance.earningsPerShareGrowth = company.earningsPerShareLtm;
          }
          // instance.roa='=financials.0.netIncome<this>/financials.0.totalAssets<this>*100';
          // instance.roe='=financials.0.netIncome<this>/financials.0.shareholdersEquity<this>*100';

          instance.roa = company.roa;
          instance.roe = company.roe;
        });
        list.value = receivedList;
        store.commit(LOADING, false);
        updating.value = false;
      });
    };

    const updateDuration = () => {
      updating.value = true;
      const receivedList = list.value;

      if (receivedList) {
        receivedList.companies.forEach((company) => {
          const instance = company as any;
          if (period.value === '10Y') {
            instance.freeCashFlowGrowth = company.freeCashFlowPerShare10y;
            instance.earningsPerShareGrowth = company.earningsPerShare10y;
          } else if (period.value === '5Y') {
            instance.freeCashFlowGrowth = company.freeCashFlowPerShare5y;
            instance.earningsPerShareGrowth = company.earningsPerShare5y;
          } else {
            instance.freeCashFlowGrowth = company.freeCashFlowPerShareLtm;
            instance.earningsPerShareGrowth = company.earningsPerShareLtm;
          }

          instance.roa = company.roa;
          instance.roe = company.roe;
        });
      }
      list.value = receivedList;
      store.commit(LOADING, false);
      updating.value = false;
    };
    const removeCompanies = (companies2Remove: string[]) => {
      const receivedList = list.value;
      if (receivedList) {
        const removedCompanies = receivedList.companies
          .filter((com) => !companies2Remove.includes(com.symbol));
        receivedList.companies = removedCompanies;
      }
      list.value = receivedList;
    };
    watch(period, () => {
      updateDuration();
    });

    onMounted(() => {
      update();
    });

    onUnmounted(() => {
      clearInterval(stockPriceInterval);
    });
    return {
      list,
      period,
      updating,
      removedFields,
      update,
      removeCompanies,
    };
  },
});
</script>
