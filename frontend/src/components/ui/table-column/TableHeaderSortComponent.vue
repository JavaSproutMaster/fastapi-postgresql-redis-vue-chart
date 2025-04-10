<template>
  <div style="justify-content: space-between; display: flex;align-items: center; width: 98%;">
    <button @click="sort" style="text-align: start;">
      <div v-if="field?.key === 'comment'" >
        <img src="@/assets/icons/comment.svg" alt="Comment">
      </div>
      <div v-else>{{ field?.name }}</div>
    </button>
    <div class="sort-icons" v-if="field?.key !== 'comment'">
      <div class="sort-up">
        <img src="@/assets/icons/arrow-up-round.svg" alt="Arrow" />
      </div>
      <div class="sort-down">
        <img src="@/assets/icons/arrow-down-round.svg" alt="Arrow" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { TableColumn } from './types/column';

export default defineComponent({
  name: 'TableHeaderSortComponent',
  props: {
    field: {
      type: Object as PropType<TableColumn>,
      required: false,
    },
  },
  emits: ['sortField'],
  setup(props, { emit }) {
    const sort = () => {
      emit('sortField', props.field?.key);
    };
    return {
      sort,
    };
  },
});
</script>

<style scoped>
.table-column button {
    font-size: 12px;
    border: none;
    background: none;
    font-weight: 600;
    cursor: pointer;
}

.table-column:hover button {
  color: var(--theme-link-color);
}
.table-column .sort-icons {
  visibility: hidden;
  position: relative;
  /* margin: auto; */
}
.table-column:hover .sort-icons {
  visibility: visible;
}
.table-column .sort-icons div {
  width: 16px;
  height: 8px;
  text-align: center;
}
.table-column .sort-icons .sort-down {
  bottom: 2px;
}
.table-column .sort-icons img {
  width: 7.43px;
  height: 4.37px;
  vertical-align: super;
}
</style>
