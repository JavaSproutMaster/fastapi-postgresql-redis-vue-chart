<template>
  <Card class="summary">
    <div class="summary-logo">
      <ImageLoader :imageUrl="logoUrl" :maxWidth="100"/>
    </div>
    <div class="summary-stats">
      <p>Founded: <span>{{ company.data.founded?.toLocaleString() }}</span></p>
      <p>Employees: <span>{{ company.data.employees?.toLocaleString() }}</span></p>
    </div>
    <div class="summary-text">
      <p>
        Business Summary:
        <span>{{ company.data.summary }}</span>
      </p>
    </div>
  </Card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import ImageLoader from '@/components/ui/ImageLoader.vue';
import Card from '@/components/ui/CardComponent.vue';

import { CompanyController } from '@/controllers/company/types';

export default defineComponent({
  name: 'CompanySummary',
  components: {
    Card,
    ImageLoader,
  },
  props: {
    company: {
      type: Object as PropType<CompanyController>,
      required: true,
    },
  },
  setup(props) {
    const logoUrl = computed(() => {
      const { logo } = props.company.data;
      if (logo && logo.length > 0 && !logo.includes('https://')) {
        return `/files/companies/img/${logo}`;
      }
      return logo;
    });

    return {
      logoUrl,
    };
  },
});
</script>

<style>
.summary {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.summary > * {
  border: 1px solid var(--theme-text-gray-2);
  border-radius: 8px;
  padding: 24px;
  border-radius: 8px;
}

.summary p {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.summary p > span {
  font-weight: 400;
}
.summary > .summary-logo {
  width: auto;
  display: flex;
  align-items: center;
  background: #2f2f2f;
}
.summary > .summary-logo > div > img {
  /* max-height: 73px; */
  /* width: 70px; */
  max-height: 149px;
}

.summary > .summary-stats {
  /* flex: .15; */
}

.summary > .summary-text {
  flex: 1;
}
</style>
