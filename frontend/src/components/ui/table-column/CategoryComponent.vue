<template>
  <th :colspan="spanLen" v-if="spanLen > 0" >
    <div class="table-category"
    :class="{'comment_category' : cat==='comment'}">
      <slot />
    </div>
  </th>
</template>

<script lang="ts">
import {
  valuationColumns, historicalPerformanceColumns, forecastColumns, fundmentalColumns,
} from '@/data/list';
import { removeFields } from '@/views/list/data';
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'CategoryComponent',
  props: {
    colspan: {
      type: Number,
      default: 1,
    },
    cat: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const store = useStore();
    const viewType = computed(() => store.state.application.listViewType);

    const spanLen = computed(() => {
      const removedFields = store.state.application.listRemoveFields;
      const valuationFieldLen = valuationColumns
        .filter((column) => !removedFields.includes(column.key)).length;
      const historicalPerformanceFieldLen = historicalPerformanceColumns
        .filter((column) => !removedFields.includes(column.key)).length;
      const forecastFieldLen = forecastColumns
        .filter((column) => !removedFields.includes(column.key)).length;
      const fundamentalFieldLen = fundmentalColumns
        .filter((column) => !removedFields.includes(column.key)).length;
      // eslint-disable-next-line no-nested-ternary
      const commentFieldLen = removedFields.includes('comment') ? 0 : (viewType.value === 'extended' ? 1 : 3);
      const myCat = props.cat;
      let result = 1;
      switch (myCat) {
        case 'valuation':
          result = valuationFieldLen;
          break;
        case 'performance':
          result = historicalPerformanceFieldLen;
          break;
        case 'forecast':
          result = forecastFieldLen;
          break;
        case 'fundamentals':
          result = fundamentalFieldLen;
          break;
        case 'comment':
          result = commentFieldLen;
          break;
        default:
          result = 1;
          break;
      }
      return result;
    });
    return {
      spanLen,
    };
  },
});
</script>

<style scoped>
th {
  background: var(--theme-link-color);
  border-left: 1px solid var(--theme-text-color-contrast);
  height: 44px;
}

.table-category {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-text-color-contrast);
  font-size: 10px;
  font-weight: 800;
  line-height: 110%;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.comment_category {
  padding: 0 5px;
}

</style>
