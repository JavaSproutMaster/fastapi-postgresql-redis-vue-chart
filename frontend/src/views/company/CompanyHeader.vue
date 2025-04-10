<template>
  <Card class="company-header">
    <div class="company-title">
      <h2>{{ company.data.name }}</h2>
      <p>{{ `${company.data.shortName}: ${company.data.symbol}` }} </p>
    </div>
    <div class="company-price">
      <div class="company-price-row">
        <p style="font-weight: 600;">Stock price</p>
        <p>{{ Math.round(company.data.stockPrice * 100) / 100 }} {{ company.data.currency }}</p>
      </div>
      <div class="company-price-row">
        <p v-if="chartPeriod === '1D'">{{ lastUpdatedDate }}</p>
        <p v-else>{{ `                  ` }}</p>
        <p :style="{
          color: stockPriceColor,
        }">({{ stockPriceChange >= 0 ? `+${stockPriceChange}`:
        stockPriceChange }}%) {{lastUpdatedDay}}</p>
      </div>
    </div>
    <div class="company-keywords">
      <div
        class="company-keyword"
        v-for="(keyword, index) in keywords"
        :key="index"
      >{{ keyword }}</div>
    </div>
    <div class="company-rollup">
      <img src="@/assets/icons/roll-up.svg" alt="Roll Up">
    </div>
  </Card>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  onUnmounted,
  watch,
  reactive,
  onMounted,
} from 'vue';

import Card from '@/components/ui/CardComponent.vue';
import * as api from '@/rest-api/companies';

import { CompanyController } from '@/controllers/company/types';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'CompanyView',
  components: {
    Card,
  },
  props: {
    company: {
      type: Object as PropType<CompanyController>,
      required: true,
    },
  },
  setup(props) {
    const date = ref(new Date());
    const store = useStore();
    const chartPeriod = computed(() => store.state.application.chartPeriod);
    const preChartPeriod = ref();
    const updateStockPriceInRange = () => {
      if (chartPeriod.value === '1D') {
        return;
      }
      props.company.updateStockPriceInPeriod(chartPeriod.value);
    };
    const dateIntervalId = setInterval(() => {
      date.value = new Date();
    }, 1000);

    const companyIntervalId = setInterval(() => {
      props.company.updatePrimaryData();
    }, 5000);

    const stockPrice = computed(() => {
      if (chartPeriod.value === '1D' || (chartPeriod.value !== props.company.stockPriceInPeriod.period
      && preChartPeriod.value === '1D')
      ) {
        return ((
          Math.round(props.company.data.stockPrice * 100) / 100
        ).toLocaleString());
      }

      return ((
        Math.round(props.company.stockPriceInPeriod.value * 100) / 100
      ).toLocaleString());
    });
    const stockPriceChange = computed(() => {
      let change = 0;
      if (chartPeriod.value === '1D' || (chartPeriod.value !== props.company.stockPriceInPeriod.period
      && preChartPeriod.value === '1D')
      ) {
        change = (Math.round(props.company.data.stockPriceChange * 100) / 100);
      } else {
        const startPrice: number = props.company.stockPriceInPeriod.value;
        const lastPrice: number = props.company.data.stockPrice;
        change = Math.round(((lastPrice - startPrice) / startPrice) * 10000) / 100;
      }
      return change;
    });

    const stockPriceColor = computed(() => {
      if (stockPriceChange.value > 0) {
        return '#21B232';
      }

      return '#FC382C';
    });
    const lastUpdatedDate = computed(() => {
      const latestUpdateTime = new Date(props.company.data.latestUpdate);

      // Convert to EDT
      const options: any = {
        timeZone: 'America/New_York',
        // year: 'numeric',
        month: 'short', // Use 'short' for abbreviated month name
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };

      const edtTime = latestUpdateTime.toLocaleString('en-US', options);
      const offset = new Date().getTimezoneOffset(); // Offset in minutes
      const timeZoneAbbreviation = offset === 240 ? 'EDT' : 'EST';
      // Append 'EDT' to the formatted string
      const formattedTime = edtTime.replace(/(\d{2}:\d{2})/, `$1 ${timeZoneAbbreviation}`);
      return formattedTime;
    });

    const lastUpdatedDay = computed(() => {
      if (chartPeriod.value === '1D' || (chartPeriod.value !== props.company.stockPriceInPeriod.period
      && preChartPeriod.value === '1D')
      ) {
        const date = new Date(props.company.data.latestUpdate);
        const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'long', timeZone: 'America/New_York' };
        const edtDay = date.toLocaleDateString('en-US', dayOptions);
        return edtDay;
      }
      const pd = props.company.stockPriceInPeriod.period;
      const value = parseInt(pd.slice(0, -1), 10);
      const type = pd.slice(-1);
      let label;
      if (type.toLowerCase() === 'y') {
        label = value > 1 ? 'years' : 'year';
      } else if (type.toLowerCase() === 'm') {
        label = value > 1 ? 'months' : 'month';
      } else if (type.toLowerCase() === 'd') {
        label = value > 1 ? 'days' : 'day';
      }
      return `${value} ${label}`;
    });

    const isWeekend = computed(() => date.value.getDay() === 0 || date.value.getDay() >= 5);

    const keywords = computed(() => props.company.data.keywords.split(','));

    watch(chartPeriod, (newPeriod, oldPeriod) => {
      preChartPeriod.value = oldPeriod;
      updateStockPriceInRange();
    });
    props.company.updateStockPriceInPeriod(chartPeriod.value);
    onUnmounted(() => {
      clearInterval(dateIntervalId);
      clearInterval(companyIntervalId);
    });

    return {
      stockPrice,
      chartPeriod,
      stockPriceChange,
      isWeekend,
      stockPriceColor,
      lastUpdatedDate,
      keywords,
      lastUpdatedDay,
    };
  },
});
</script>

<style>
.company-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.company-header > .company-title > p {
  font-size: 14px;
  font-weight: 600;
}

.company-header > .company-price {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.company-header > .company-price > .company-price-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-header > .company-price > .company-price-row > p:first-child {
  min-width: 110px;
  font-size: 14px;
}

.company-header > .company-price > .company-price-row > p:last-child {
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
}

.company-header > .company-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 280px;
}

.company-header > .company-keywords > .company-keyword {
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text-gray);
  border: 1px solid var(--theme-text-gray);
  border-radius: 100px;
  padding: 4px 12px;
}

.company-header > .company-rollup {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
