<!-- eslint-disable max-len -->
<template>
  <Table :data="computedTableData" :comments="comments" v-on:add-comment="createComment"
    :innerPeriod="innerPeriod"
    v-on:update-comment="saveComment" v-on:delete-comment="deleteComment" :listId="list?.id" v-on:sort-field="sortField"
    :compiler="compile" :updating="updating" class="list-table">
    <Category :colspan="1" class="company-name">
      <Button type="transparent">Base</Button>
      <Button type="transparent" :visually-disabled="true">Lens</Button>
      <Button type="transparent" :visually-disabled="true">Holdings</Button>
    </Category>
    <Category :colspan="valuationFieldLen" :cat="'valuation'">
      Valuation
    </Category>
    <Category :colspan="historicalPerformanceFieldLen" class="list-buttons"
      :cat="'performance'">
      Historical Performance:
      <Button type="transparent" @click="innerPeriod = '10Y'" :visually-disabled="innerPeriod !== '10Y'">10Y</Button>
      <Button type="transparent" @click="innerPeriod = '5Y'" :visually-disabled="innerPeriod !== '5Y'">5Y</Button>
      <Button type="transparent" @click="innerPeriod = '1Y'" :visually-disabled="innerPeriod !== '1Y'">1Y</Button>
    </Category>
    <Category :colspan="forecastFieldLen" class="list-buttons list-buttons__gap" :cat="'forecast'">
      Forecast:
      <Button type="transparent">Averages</Button>
      <Button type="transparent" :visually-disabled="true">Analysts</Button>
      <Button type="transparent" :visually-disabled="true">Custom</Button>
    </Category>
    <Category :colspan="fundamentalFieldLen" :cat="'fundamentals'">
      Fundamentals
    </Category>
    <Category
      :colspan="removedFields.includes('comment') ? 0 : viewType === 'extended' ? 1 : 3" :cat="'comment'">
      Comments
    </Category>

    <Column class="sort-column" data-key="name">
      Sort by:
      <Button type="transparent" class="sort-button" @click="sortMenu = !sortMenu">
        {{ sort.title }}
        <img src="@/assets/icons/arrow-down.svg" alt="Arrow" :class="{
          'reversed-arrow': sortMenu
        }">
        <div class="sort-menu" v-if="sortMenu">
          <button v-for="(item, index) in sortItems" :key="index" class="sort-button" :class="{
            'sort-button__active':
              sort.key === item.key
          }" @click="sortName(item)">{{ item.title }}</button>
        </div>
      </Button>
    </Column>

    <Row class="list-name" data-key="name" v-slot="{ instance, index }">
      <div class="list-counter">
        {{ (index + 1).toString().padStart(2, '0') }}
      </div>
      <ListCompanyLinkComponent :company="instance" />
    </Row>

    <!-- <Row class="list-price" data-key="stockPrice" v-slot="{ instance }" v-if="!removedFields.includes('stockPrice')">
      <p style="white-space: nowrap;">
        {{ (Math.round(instance.stockPrice * 10) / 10).toLocaleString('en-US') }}
        <span class="list-price__green" v-if="instance.stockPriceChange >= 0">(+{{
          Math.round(instance.stockPriceChange * 10) / 10 }})%</span>
        <span class="list-price__red" v-else>
          ({{ Math.round(instance.stockPriceChange * 10) / 10 }})%
        </span>
      </p>
    </Row> -->

    <!-- <Row data-key="change" v-slot="{ instance }" v-if="!removedFields.includes('change')">
      <div class="list-change">
        <div class="list-change-circle" :style="{
          left: `${priceChange(instance)}%`
        }" />
      </div>
    </Row> -->

    <!-- <Row data-key="totalReturn" v-slot="{ instance }" v-if="!removedFields.includes('totalReturn')">
      <p v-if="isHighLighted && innerPeriod === '10Y'">
        <span class="list-price__green" v-if="instance.totalReturn10y >= 0">
          {{Math.round(instance.totalReturn10y * 10) / 10 }}%</span>
        <span class="list-price__red" v-else>
          ({{Math.abs(Math.round(instance.totalReturn10y * 10) / 10) }})%
        </span>
      </p>
      <p v-if="isHighLighted && innerPeriod === '5Y'">
        <span class="list-price__green" v-if="instance.totalReturn5y >= 0">
          {{ Math.round(instance.totalReturn5y * 10) / 10 }}%</span>
        <span class="list-price__red" v-else>
          ({{ Math.abs(Math.round(instance.totalReturn5y * 10) / 10) }})%
        </span>
      </p>
      <p v-if="isHighLighted && innerPeriod === '1Y'">
        <span class="list-price__green" v-if="instance.totalReturnLtm >= 0">
          {{ Math.round(instance.totalReturnLtm * 10) / 10 }}%</span>
        <span class="list-price__red" v-else>
          ({{ Math.abs(Math.round(instance.totalReturnLtm * 10) / 10) }})%
        </span>
      </p>
      <p v-if="!isHighLighted">
        {{ render.percentage(Math.round(
        innerPeriod === '10Y' ? instance.totalReturn10y * 10 :
        innerPeriod === '5Y' ? instance.totalReturn5y * 10 :
        innerPeriod === '1Y' ? instance.totalReturnLtm * 10 : 0
        ) / 10) }}
      </p>
    </Row> -->

    <!-- <Row data-key="priceChange" v-if="!removedFields.includes('priceChange')">-</Row> -->
    <!-- <Row data-key="leverage" v-slot="{ instance }" v-if="!removedFields.includes('leverage')">
      <p v-if="instance.leverage > 0">
        {{ Math.round(instance.leverage * 100) / 100 }}
      </p>
      <p v-else>
        -
      </p>
    </Row> -->

    <Row data-key="comment" v-if="!removedFields.includes('comment')"></Row>

    <Line class="list-total">
      <Row>
        Total
        <Help style="
        padding: 8px 0;
        margin-left: 4px;"
        align="right"
        hoverWidth="217px"
        hoverPadding="12px 16px 12px 16px">
          <p class="help-description"
            v-text="`Assuming equal weights`">
          </p>
        </Help>
      </Row>

      <Row v-if="!removedFields.includes('stockPrice')">
        <span class="list-price__green" v-if="averageStockPriceChange >= 0">+{{
          Math.round(averageStockPriceChange * 10) / 10 }}%</span>
        <span class="list-price__red" v-else>
          ({{ Math.round(averageStockPriceChange * 10) / 10 }})%
        </span>
      </Row>

      <Row v-if="!removedFields.includes('change')">
        <div class="list-change">
          <div class="list-change-circle" :style="{
            left: `${averageChange}%`
          }" />
        </div>
      </Row>

      <Row v-for="(column, index) in allowedColumns" :key="index"
        :colspan="(column.key === 'comment' && viewType === 'condensed') ? 3 : 0">
        <div v-if="column.key !== 'comment'"
          :class="(isHighLighted && column.handler) ? highlightClass(column.handler(average(column))) : ''">
          {{ (column.handler ? column.handler(average(column)) : average(column)) }}
        </div>
        <div v-if="!removedFields.includes('comment') && index === allowedColumns.length - 1" style="width: 100%;">
          <ListCommentComponent :symbol="'total'" :comment="comments.find(c => c.symbol === 'total')"
            v-on:new-comment="createComment" v-on:edit-comment="saveComment" v-on:delete-comment="deleteComment" />
        </div>
      </Row>
    </Line>
  </Table>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType,
  onUpdated,
  reactive,
} from 'vue';
import { useStore } from 'vuex';
import {
  TableComponent as Table,
  CategoryComponent as Category,
  ColumnComponent as Column,
  RowComponent as Row,
  LineComponent as Line,
} from '@/components/ui/table-column';
import Help from '@/components/ui/HelpComponent.vue';

import Button from '@/components/ui/ButtonComponent.vue';
import * as api from '@/rest-api/lists';

import { TableData } from '@/components/ui/table/types';
import { SortColumn } from '@/components/ui/table-column/types';

import {
  tableData,
  tableDataCondensed,
  valuationColumns,
  historicalPerformanceColumns,
  forecastColumns,
  fundmentalColumns,
} from '@/data/list';

import { List, ListComment, ListCompany1 } from '@/rest-api/lists/assets';
import { Company } from '@/rest-api/companies/assets';

import { useCompiler } from '@/controllers/compiler';

import * as render from '@/services/renderers';
import { nestedKey } from '@/services/nested-key';
import { SHOW_MODAL } from '@/store/actions/application';
import ListCommentComponent from './CommentComponent.vue';
import ListCompanyLinkComponent from './ListCompanyLinkComponent.vue';
import { viewControl } from '../company/financials/data/controls';

export default defineComponent({
  name: 'TableView',
  components: {
    Table,
    Category,
    Column,
    Button,
    Row,
    Line,
    Help,
    ListCommentComponent,
    ListCompanyLinkComponent,
  },
  props: {
    list: {
      type: Object as PropType<List>,
      required: false,
    },
    period: {
      type: String,
      required: true,
    },
    updating: {
      type: Boolean,
      required: true,
    },
    removedFields: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  emits: ['update:period'],
  setup(props, { emit }) {
    const store = useStore();
    const sortMenu = ref(false);
    const comments: ListComment[] = reactive([]);
    const viewType = computed(() => store.state.application.listViewType);
    const isHighLighted = computed(() => store.state.application.listHighlight);
    const sortItems = [
      {
        key: 'marketCap',
        title: 'Market Cap',
      },
      {
        key: 'name',
        title: 'A-Z',
      },
    ];
    const initTableData = computed(() => {
      if (viewType.value === viewControl.EXTENDED) return tableData;
      return tableDataCondensed;
    });
    const highlightClass = (value: any) => {
      if (typeof value === 'string' && value.includes('%')) {
        return value.includes('(') ? 'negative' : 'positive';
      }
      return '';
    };
    const valuationFieldLen = computed(() => valuationColumns
      .filter((column) => !props.removedFields.includes(column.key)).length);
    const historicalPerformanceFieldLen = computed(() => historicalPerformanceColumns
      .filter((column) => !props.removedFields.includes(column.key)).length);
    const forecastFieldLen = computed(() => forecastColumns
      .filter((column) => !props.removedFields.includes(column.key)).length);
    const fundamentalFieldLen = computed(() => fundmentalColumns
      .filter((column) => !props.removedFields.includes(column.key)).length);
    // eslint-disable-next-line no-nested-ternary
    const commentFieldLen = computed(() => (props.removedFields.includes('comment') ? 0
      : (viewType.value === 'extended' ? 1 : 3)));
    const sort = ref(sortItems[0]);
    const sortFieldName = ref<SortColumn | undefined>(undefined);
    const sortDirect = ref(0);
    const sortName = (item: any) => {
      sort.value = item;
      sortFieldName.value = undefined;
      sortDirect.value = 0;
    };
    const createComment = (comment: ListComment) => {
      if (!props.list) return;
      api.createListComment(props.list.id, comment.symbol || 'total', comment.text).then((payload: any) => {
        if (payload.status === 403) {
          store.commit(SHOW_MODAL, 'duplicate-list');
        } else {
          Object.assign(comment, payload);
          comments.push(comment);
        }
      });
    };

    const sortField = (param: SortColumn, direct: number) => {
      sortFieldName.value = param;
      sortDirect.value = direct;
    };

    const saveComment = (comment: ListComment) => {
      if (!props.list) return;
      if (comment) {
        if (!comment) return;
        if (!comment.id) {
          api.createListComment(props.list.id, comment.symbol || 'total', comment.text)
            .then((payload: any) => {
              if (payload.status === 403) {
                store.commit(SHOW_MODAL, 'duplicate-list');
              } else Object.assign(comment, payload);
            });
        } else {
          api.updateListComment(comment.id, comment.text).then((res: any) => {
            if (res.status === 403) {
              store.commit(SHOW_MODAL, 'duplicate-list');
            }
          });
        }
      }
    };

    const deleteComment = (comment: ListComment) => {
      if (comment === undefined) {
        return;
      }
      if (comment.id !== undefined) {
        api.removeListComment(comment.id).then((res: any) => {
          if (res.status === 403) {
            store.commit(SHOW_MODAL, 'duplicate-list');
          } else {
            Object.assign(comment, null);
            comments.forEach((c, index) => {
              if (c.id === comment.id) {
                comments.splice(index, 1);
              }
            });
          }
        });
      }
    };
    // const innerPeriod = ref('10Y');
    const innerPeriod = computed({
      get() {
        return props.period;
      },
      set(newValue) {
        emit('update:period', newValue);
      },
    });
    // const changePeriod = (len: string) => {
    //   innerPeriod.value = len;
    // };
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
    const computedTableData = computed(() => {
      if (!props.list) {
        return {};
      }

      const newData = { ...initTableData.value };

      if (Array.isArray(props.removedFields) && props.removedFields.length !== 0) {
        newData.columns = [];
        const filteredFields = initTableData.value.columns
          .filter((c) => !props.removedFields.includes(c.key));
        newData.columns = filteredFields;
      }

      newData.data = props.list.companies;
      const listComments: ListComment[] = [];
      props.list.companies.forEach((c) => {
        if (c.comment) {
          listComments.push(c.comment);
        }
      });
      if (props.list.totalComment) listComments.push(props.list.totalComment);

      Object.assign(comments, listComments);

      const data: TableData = {
        categories: [
          {
            name: 'Actual',
            key: 'actual',
            values: props.list ? props.list.companies : [],
          },
        ],
        rows: (newData as any).rows || [],
        column: 'name',
        columnName: 'Fiscal',
      };
      const { compile, clearCache } = useCompiler(ref(data), true);

      const handleValue = (column: SortColumn, row: object): any => {
        const value = nestedKey(column.key, row);
        const compiled = compile(value, row);
        return compiled;
      };

      if (sortFieldName.value) {
        newData.data.sort((a, b) => {
          let valA = 0;
          let valB = 0;
          const field = sortFieldName.value;
          switch (field?.key) {
            case 'stockPrice':
              valA = a.stockPriceChange;
              valB = b.stockPriceChange;
              break;
            case 'change':
              valA = priceChange(a);
              valB = priceChange(b);
              break;
            case 'priceEarningsRatioLtm':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'freeCashFlowYield':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'freeCashFlowGrowth':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'earningsPerShareGrowth':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'earningsPerShare5y':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'roa':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'roe':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'revenue':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'netIncome':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'cashFlowFromOperatingActivities':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'capex':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'freeCashFlow':
              valA = handleValue(field, a);
              valB = handleValue(field, b);
              break;
            case 'leverage':
              valA = a.leverage;
              valB = b.leverage;
              break;
            case 'totalReturn':
              if (innerPeriod.value === '10Y') {
                valA = a.totalReturn10y;
                valB = b.totalReturn10y;
              }
              if (innerPeriod.value === '5Y') {
                valA = a.totalReturn5y;
                valB = b.totalReturn5y;
              }
              if (innerPeriod.value === '1Y') {
                valA = a.totalReturnLtm;
                valB = b.totalReturnLtm;
              }
              break;
            default:
              return -1;
          }
          if (sortDirect.value === 1) return (valA - valB);
          return (valB - valA);
        });
      } else if (sort.value.key === 'marketCap') {
        newData.data.sort(
          (a, b) => (b.marketCap - a.marketCap),
        );
      } else if (sort.value.key === 'name') {
        newData.data.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }

          return 1;
        });
      }
      return newData;
    });

    const compilerData = computed(() => {
      const data: TableData = {
        categories: [
          {
            name: 'Actual',
            key: 'actual',
            values: props.list ? props.list.companies : [],
          },
        ],
        rows: (computedTableData.value as any).rows || [],
        column: 'name',
        columnName: 'Fiscal',
      };

      return data;
    });

    const { compile, clearCache } = useCompiler(compilerData, true);
    const averageStockPriceChange = computed(() => {
      if (!props.list || props.list.companies.length === 0) {
        return 0;
      }

      const totalPriceChange = props.list.companies.reduce(
        (partialSum, instance) => (partialSum + instance.stockPriceChange),
        0,
      );

      const averagePriceChange = totalPriceChange / props.list.companies.length;
      return averagePriceChange;
    });

    const averageChange = computed(() => {
      if (!props.list || props.list.companies.length === 0) {
        return 0;
      }

      const totalPrice = props.list.companies.reduce(
        (partialSum, instance) => (partialSum + instance.stockPrice), // eslint-disable-line
        0,
      );
      const totalChange = props.list.companies.reduce(
        (partialSum, instance) => (partialSum + priceChange(instance)),
        0,
      );
      const result = totalChange / props.list.companies.length;

      // const range = (maxPrice - lowPrice);
      // const offset = (averagePrice - lowPrice);

      // const result = (offset / range) * 100;

      if (result > 100) {
        return 100;
      }

      if (result < 0) {
        return 0;
      }

      return result;
    });

    const average = (column: any): number | undefined => {
      const values = props.list?.companies.map((item) => nestedKey(column.key, item)) || [];

      if (column.key === 'totalReturn') {
        let sumTotalReturn;
        if (innerPeriod.value === '10Y') {
          sumTotalReturn = props.list?.companies.reduce(
            (partialSum, value) => partialSum + value.totalReturn10y,
            0,
          );
        }
        if (innerPeriod.value === '5Y') {
          sumTotalReturn = props.list?.companies.reduce(
            (partialSum, value) => partialSum + value.totalReturn5y,
            0,
          );
        }
        if (innerPeriod.value === '1Y') {
          sumTotalReturn = props.list?.companies.reduce(
            (partialSum, value) => partialSum + value.totalReturnLtm,
            0,
          );
        }
        return (sumTotalReturn || 0) / values.length;
      }
      if (values.length === 0 || (typeof values[0] === 'object' && Object.keys(values[0]).length === 0)) {
        return undefined;
      }

      const sum = values.reduce(
        (partialSum, value, index) => partialSum + compile(value, props.list?.companies[index]) || 0,  // eslint-disable-line
        0,
      );

      return sum / values.length;
    };

    const allowedColumns = computed(() => {
      const remainFields = initTableData.value.columns
        .filter((c) => !props.removedFields.includes(c.key));
      if (Object.keys(computedTableData.value).length === 0) {
        return [];
      }

      const columns = remainFields.filter(
        (column: any) => (['name', 'stockPrice', 'change'].indexOf(column.key) === -1),
      );

      return columns;
    });

    onUpdated(() => {
      clearCache();
    });

    return {
      computedTableData,
      viewType,
      sortMenu,
      sort,
      sortItems,
      render,
      innerPeriod,
      allowedColumns,
      comments,
      valuationFieldLen,
      historicalPerformanceFieldLen,
      forecastFieldLen,
      fundamentalFieldLen,
      commentFieldLen,
      isHighLighted,
      viewControl,
      priceChange,
      // changePeriod,
      averageChange,
      averageStockPriceChange,
      compile,
      highlightClass,
      sortName,
      sortField,
      saveComment,
      deleteComment,
      average,
      createComment,
    };
  },
});
</script>

<style scoped>
.company-name {
  /* width: 228px; */
}

.company-name .button {
  color: var(--theme-text-color-contrast) !important;
  border: 1px solid var(--theme-text-color-contrast);
  padding: 4px 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.company-name .button.button__disabled {
  border: none;
  padding: 4px 13px;
}

.sort-button {
  position: relative;
  display: flex !important;
  align-items: center !important;
  font-size: 12px;
  font-weight: 600;
  text-transform: none;
  gap: 4.3px;
}

.sort-button>img {
  margin-top: 1px;
}

.sort-menu {
  position: absolute;
  top: calc(100% + 15px);
  left: 50%;
  transform: translateX(-20%);
  width: 153px;
  background: var(--theme-text-color-contrast);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0px 8px 18px 0px rgba(0, 0, 0, 0.06);
  z-index: 2;
}

.sort-menu>.sort-button {
  width: 100%;
  outline: none;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  background: none;
  text-align: left;
  cursor: pointer;
  text-align: left;
  justify-content: flex-start;
}

.sort-menu>.sort-button__active {
  background: #F4F6FF;
}

.list-buttons .button {
  font-size: 10px;
  font-weight: 800;
  line-height: 110%;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--theme-text-color-contrast);
}

.list-buttons .button.button__disabled {
  color: #AEB7FB;
}

.list-counter {
  font-size: 10px;
  font-weight: 400;
  line-height: 110%;
  letter-spacing: 0.2px;
  color: var(--theme-text-gray-3);
  width: 10px;
}

.list-price {
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.28px;
}

.list-price__green {
  color: #21B232;
}

.list-price__red {
  color: #FC382C;
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

.list-total {
  background: #F4F6FF;
  font-weight: 600;
}
.list-total:hover {
  background-color: #E3E8FD !important;
}
</style>

<style>
.list-table tr>th:first-child,
.list-table tr>td:first-child {
  padding-left: 24px;
}

.table-vertical table thead>tr:first-child>th:first-child {
  border-top-left-radius: 16px;
}

.table-vertical table thead>tr:first-child>th:last-child {
  border-top-right-radius: 16px;
}

.list-table table tbody tr:last-child>td:first-child {
  border-bottom-left-radius: 16px;
}

.list-table table tbody tr:last-child>td:last-child {
  border-bottom-right-radius: 16px;
}

.company-name>.table-category {
  justify-content: flex-start;
}

.sort-column>.table-column {
  display: flex;
  align-items: center;
  gap: 2px;
}

.list-buttons>.table-category {
  gap: 8px;
}

.list-buttons.list-buttons__gap>.table-category {
  gap: 10px;
}

.list-name>.table-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.list-name>.table-row>p {
  font-size: 14px;
  font-weight: 600;
  line-height: 150%;
  letter-spacing: 0.28px;
  color: var(--theme-text-color-2);
  white-space: nowrap;
}

.list-total .table-row {
  font-weight: 600;
  position: relative;
}

.table-row .positive {
  color: #21b232;
}

.table-row .negative {
  color: #FC382C;
}
</style>
