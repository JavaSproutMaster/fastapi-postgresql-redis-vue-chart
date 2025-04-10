<template>
  <table>
    <!-- Table Header -->
    <thead v-if="tabledata?.header.length > 0">
      <tr>
        <th></th>
        <th
          v-for="(col, index) in tabledata?.header"
          :key="index"
          :style="getHeaderStyle(index)"
        >
          {{ col }}
        </th>
      </tr>
    </thead>
    <!-- Table Body -->
    <tbody>
      <tr v-for="(row, rowIndex) in tabledata?.body" :key="rowIndex">
        <td
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          :style="getBodyStyle(colIndex)"
        >
          {{ cell }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { LOADING } from '@/store/actions/application';

import Container from '@/components/ContainerComponent.vue';

export default defineComponent({
  name: 'approachTable',
  props: {
    tabledata: {
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
  methods: {
    getBodyStyle(index: number) {
      if (index === 1) {
        return { backgroundColor: '#D6DBFD', color: '#131313' };
      }
      return { backgroundColor: '#E6E6E6', color: '#1A1A1A' };
    },
    getHeaderStyle(idx: number) {
      if (idx === 0) {
        return { backgroundColor: '#3348FB', color: '#E6E6E6', width: '50%' };
      }
      return { backgroundColor: '#CCCCCC', color: '#131313', width: '25%' };
    },
  },
});
</script>

<style scoped>
  table {
    font-family: Gilroy;
    width: 80%;
    border: 1px soild;
    border-collapse: collapse;
    border-radius: 16px;
    overflow: hidden;
    text-align: center;
    margin: 20px;
  }
  thead {
    background-color: #CCCCCC;
    font-weight: 800;
    font-size: 24px;
    letter-spacing: 2%;
    text-transform: uppercase;
  }
  th {
    padding: 16px;
    gap: 10px;
  }
  tbody {
    font-weight: 500;
    font-size: 18px;
    letter-spacing: 2%;
  }
  tr {
    margin-bottom: 2px;
  }
  td {
    padding: 16px 24px;
    gap: 10px;
  }
</style>
