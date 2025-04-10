<!-- eslint-disable max-len -->
<template>
  <div class="table-vertical">
    <div class="table-updating" v-if="updating">
      <VueSpinner size="30" color="var(--theme-link-color)" />
    </div>
    <table>
      <thead>
        <tr class="table-categories">
          <template v-for="(category, index) in categories" >
            <component :key="index" :is="category"
              v-if="viewType === 'extended' || (viewType === 'condensed' && category.props?.cat !== 'forecast')" />
          </template>
        </tr>
        <tr class="table-columns">
          <template v-for="(column, index) in data.columns" :key="index">
            <component :is="columnOverride(column.key?.toString() || '')"
              v-if="column.key && columnOverride(column.key)" />
            <ColumnComponent :colspan="column.key==='comment' && viewType === 'condensed' ? 3 : 1" v-else>
              <TableHeaderSortComponent :field="column" v-on:sort-field="handleSort" />
            </ColumnComponent>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data.data" :key="index">
          <template v-for="(column, idx) in data.columns" :key="idx">
            <!-- <component :is="rowOverride(column.key?.toString() || '')" :index="index" :instance="row"
              v-if="idx < data.columns.length-1 && column.key && rowOverride(column.key)" />
            <RowComponent v-else-if="column.key !== 'comment'">
              <div :class="isHighLighted ? highlightClass(handleValue(column, row)) : ''">
                {{ handleValue(column, row) }}
              </div>
            </RowComponent>
            <component class="comment" style="position: relative;" :is="rowOverride(column.key?.toString() || '')"
              :colspan="viewType==='extended'?1:3"
              :index="index" :instance="row" v-else-if="column.key === 'comment'">
              <div style="width: 100%;">
                <ListCommentComponent :symbol="row.symbol"
                  :comment="comments.find(c => c.symbol === row.symbol)" v-on:new-comment="createComment"
                  v-on:edit-comment="saveComment" v-on:delete-comment="deleteComment" />
              </div>
            </component> -->
            <component :is="rowOverride(column.key?.toString() || '')" :index="index" :instance="row"
            v-if="column.key === 'name'" />
            <RowComponent v-else-if="column.key === 'stockPrice'">
              <p style="white-space: nowrap;">
                {{ (Math.round(handleValue(column, row) * 10) / 10).toLocaleString('en-US') }}
                <span class="positive" v-if="row.stockPriceChange >= 0">(+{{
                  Math.round(row.stockPriceChange * 10) / 10 }})%</span>
                <span class="negative" v-else>
                  ({{ Math.round(row.stockPriceChange * 10) / 10 }})%
                </span>
              </p>
            </RowComponent>
            <RowComponent v-else-if="column.key === 'change'">
              <div class="list-change">
                <div class="list-change-circle" :style="{
                  left: `${priceChange(row)}%`
                }" />
              </div>
            </RowComponent>

            <RowComponent v-else-if="column.key === 'priceChange'">-</RowComponent>
            <RowComponent v-else-if="column.key === 'leverage'">
              <p v-if="row.leverage > 0">
                {{ Math.round(row.leverage * 100) / 100 }}
              </p>
              <p v-else>
                -
              </p>
            </RowComponent>

            <RowComponent v-else-if="column.key !== 'comment'">
              <div :class="isHighLighted ? highlightClass(handleValue(column, row)) : ''">
                {{ handleValue(column, row) }}
              </div>
            </RowComponent>
            <component class="comment" style="position: relative;" :is="rowOverride(column.key?.toString() || '')"
              :colspan="viewType==='extended'?1:3"
              :index="index" :instance="row" v-else-if="column.key === 'comment'">
              <div style="width: 100%;">
                <ListCommentComponent :symbol="row.symbol"
                  :comment="comments.find(c => c.symbol === row.symbol)" v-on:new-comment="createComment"
                  v-on:edit-comment="saveComment" v-on:delete-comment="deleteComment" />
              </div>
            </component>
          </template>
        </tr>

        <component v-for="(line, index) in lines" :key="index" :is="line" />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useSlots,
  PropType,
  Component,
  computed,
  ref,
  watch,
} from 'vue';

import { VueSpinner } from 'vue3-spinners';

import { nestedKey } from '@/services/nested-key';

import ListCommentComponent from '@/views/list/CommentComponent.vue';
import * as api from '@/rest-api/lists';
import { List, ListComment } from '@/rest-api/lists/assets';
import { useRoute } from 'vue-router';
import { sortColumns } from '@/data/list';
import { useStore } from 'vuex';
import * as render from '@/services/renderers';
import { TableData, SortColumn } from './types';
import TableHeaderSortComponent from './TableHeaderSortComponent.vue';
import ColumnComponent from './ColumnComponent.vue';
import RowComponent from './RowComponent.vue';
import { TableColumn } from './types/column';

export default defineComponent({
  name: 'TableComponent',
  components: {
    VueSpinner,
    ColumnComponent,
    RowComponent,
    ListCommentComponent,
    TableHeaderSortComponent,
  },
  props: {
    data: {
      type: Object as PropType<TableData>,
      required: true,
    },
    comments: {
      type: Array as PropType<ListComment[]>,
      required: true,
    },
    listId: {
      type: Number,
      required: false,
    },
    compiler: {
      type: Function,
      required: true,
    },
    updating: {
      type: Boolean,
      required: true,
    },
    innerPeriod: {
      type: String,
      required: true,
    },
  },
  emits: ['addComment', 'updateComment', 'deleteComment', 'sortField'],
  setup(props, { emit }) {
    const store = useStore();
    const slots = useSlots();
    const defaultSlot = slots.default && slots.default();
    const categories = defaultSlot?.filter((item) => (item.type as any).name === 'CategoryComponent') || [];
    const columns = defaultSlot?.filter((item) => (item.type as any).name === 'ColumnComponent') || [];
    const rows = defaultSlot?.filter((item) => (item.type as any).name === 'RowComponent') || [];
    const lines = defaultSlot?.filter((item) => (item.type as any).name === 'LineComponent') || [];
    const sortFieldName = ref<SortColumn | undefined>(sortColumns[0]);
    const direct = ref(0);
    const viewType = computed(() => store.state.application.listViewType);
    const isHighLighted = computed(() => store.state.application.listHighlight);
    const columnOverride = (key: string): Component | undefined => columns.find((x) => x.props && x.props['data-key'] === key);
    const rowOverride = (key: string): Component | undefined => rows.find((x) => x.props && x.props['data-key'] === key);

    const handleValue = (column: TableColumn, row: any): any => {
      if (column.key === 'leverage') return render.singleRatio(row.leverage);

      const value = nestedKey(column.key, row);
      const compiled = props.compiler(value, row);
      return column.handler ? column.handler(compiled) : compiled;
    };
    const highlightClass = (value: any) => {
      if (typeof value === 'string' && value.includes('%')) {
        return value.includes('(') ? 'negative' : 'positive';
      }
      return '';
    };
    const priceChange = (instance: any): number => {
      const range = (instance.week52High - instance.week52Low);
      const offset = (instance.stockPrice - instance.week52Low);

      const result = (offset / range) * 100;

      if (result > 100) {
        return 100;
      }

      if (result < 0) {
        return 0;
      }

      return result;
    };
    const handleSort = (field: string) => {
      if (sortFieldName.value?.key === field && direct.value === 1) {
        emit('sortField', undefined, 0);

        sortFieldName.value = undefined;
        direct.value = 0;
        return;
      }
      if (sortFieldName.value?.key === field) {
        direct.value = 1 - direct.value;
      } else {
        sortFieldName.value = sortColumns.find((s: SortColumn) => s.key === field);
        direct.value = 0;
      }
      emit('sortField', sortFieldName.value, direct.value);
    };
    const createComment = (comment: ListComment) => {
      if (!props.listId) return;
      // api.createListComment(props.listId, comment.symbol, comment.text);
      emit('addComment', comment);
    };

    const saveComment = (comment: ListComment) => {
      if (!props.data) return;
      emit('updateComment', comment);
    };

    const deleteComment = (comment: ListComment) => {
      emit('deleteComment', comment);
    };

    return {
      categories,
      columns,
      lines,
      isHighLighted,
      viewType,
      render,
      createComment,
      saveComment,
      deleteComment,
      handleSort,
      columnOverride,
      rowOverride,
      handleValue,
      highlightClass,
      priceChange,
    };
  },
});
</script>

<style scoped>
.table-vertical {
  position: relative;
  display: flex;
  /* border-top-left-radius: 16px;
  border-top-right-radius: 16px; */
  font-size: var(--font-size-12);
  font-weight: 500;
  text-align: left;
  height: 100%;
  width: 100%;
  /* border-radius: 16px;
  overflow: hidden; */
}

.table-vertical table {
  border: none;
  border-collapse: collapse;
  width: 100%;
}

.table-vertical tbody > tr:nth-child(2n - 1) {
  background: var(--theme-light-color-1);
}

.table-vertical tbody > tr:nth-child(2n) {
  background: var(--theme-text-color-contrast);
}
.table-vertical table>tbody>tr:hover {
  background-color: #E3E8FD !important;
}
.table-columns {
  background: #D6DBFD;
}

.table-updating {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 88px;
  left: 0;
  height: calc(100% - 88px);
  width: 100%;
  background: rgba(255, 255, 255, .75);
  z-index: 2;
}
</style>

<style>
.table-vertical table thead > tr > th:first-child {
  border: none;
}
.list-change {
  position: relative;
  height: 2px;
  width: 40px;
  background: var(--theme-text-gray-2);
}

.list-change-circle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--theme-text-gray-3);
}
</style>
