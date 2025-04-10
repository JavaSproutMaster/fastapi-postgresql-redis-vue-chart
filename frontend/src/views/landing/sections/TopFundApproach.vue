<template>
  <div class="topfund-approach display-flex flex-column item-center content-center">
    <p class="title">{{ topFundApproach?.title }}</p>
    <p class="content">{{ topFundApproach?.content }}</p>
    <ApproachTable :tabledata="topFundApproach?.table"/>
    <a :href="topFundApproach?.link?.href" >{{ topFundApproach?.link?.text }}</a>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { LOADING } from '@/store/actions/application';

import Container from '@/components/ContainerComponent.vue';

import ApproachTable from '../components/ApproachTable.vue';

export default defineComponent({
  name: 'topFundApproach',
  components: {
    ApproachTable,
  },
  props: {
    topFundApproach: {
      type: Object,
      required: false,
    },
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.commit(LOADING, false);
    });
  },
});
</script>

<style>
  .topfund-approach {
    background-color: #EDEDED;
    padding: 40px;
    p {
      margin: 10px;
    }
    .title {
      font-family: Gilroy;
      font-weight: 800;
      font-size: 32px;
      letter-spacing: 0%;
      text-transform: uppercase;
    }
    .content {
      font-family: Gilroy;
      font-weight: 500;
      font-size: 20px;
      letter-spacing: 2%;
    }
    a {
      font-weight: 600;
      font-size: 20px;
      letter-spacing: 2%;
      text-decoration: underline;
      text-decoration-style: solid;
      text-decoration-offset: 0%;
      text-decoration-thickness: 0%;
    }
  }
</style>
