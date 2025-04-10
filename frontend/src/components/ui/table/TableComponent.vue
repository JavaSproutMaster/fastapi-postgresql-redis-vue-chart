<template>
  <div
    class="table"
    style="position: relative"
    :class="{
      'table__comment': isCommentEnabled
    }"
  >
    <div class="table-modal" v-if="commentModal && isCommentModalShown" ref="modal">
      <div class="table-modal-content">
        <Card>
          <div class="table-modal-header">
            <div class="table-modal-header-section">
              <img src="@/assets/icons/info.svg" alt="Info">
              <p>Comments are saved automatically</p>
            </div>
            <button @click="isCommentModalShown = false">
              <img src="@/assets/icons/cross.svg" alt="Cross">
            </button>
          </div>
          <div class="table-modal-comments">
            <div
              v-for="(comment, index) in data.comments"
              :key="index"
              class="table-modal-comment"
              :class="{
                'table-modal-comment__expand': activeComment === index,
              }"
            >
              <div class="table-modal-comment-visible">
                <span>
                  {{ (getRowIndexByField(comment.field) + 1).toString().padStart(2, '0') }}
                </span>
                <p>{{ data.rows[getRowIndexByField(comment.field)]?.name.replace('ㅤ', '') }}</p>
                <p class="table-comment-spoiler" v-if="activeComment !== index">
                  {{ comment.text }}</p>
                <button @click="activeComment = activeComment === index ? undefined : index">
                  <img src="@/assets/icons/arrow-small.svg" alt="Arrow">
                </button>
              </div>
              <div class="table-modal-comment-hidden" v-if="activeComment === index">
                <div class="table-modal-comment-title">
                  <input
                    type="text"
                    v-model="comment.title"
                    placeholder="Enter header text"
                    @change="saveComment(index)"
                    v-if="!comment.column"
                  >
                  <p v-else>{{ new Date(comment.createdAt).toLocaleDateString() }}</p>
                  <div class="table-modal-comment-control">
                    <button @click="deleteComment(index)">
                      <img src="@/assets/icons/trash.svg" alt="Trash">
                    </button>
                  </div>
                </div>
                <p v-if="!comment.column">{{ new Date(comment.createdAt).toLocaleDateString() }}</p>

                <Textarea
                  v-model:value="comment.text"
                  placeholder="Enter comment text"
                  @change="saveComment(index)"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
    <table>
      <ForecastEditingAskModal v-if="forecastEditingShow"/>
      <thead>
        <tr v-if="!data.hideCategories">
          <th
            v-for="(category, index) in data.categories.filter((x) => !x.hidden)"
            :key="index"
            :colspan="
              (index === 0 ?
              category.values.slice(0, data.viewCount).length :
              (index === 3 && data?.viewCount === 6) ? 10 : category.values.length) + (
                index === 0 || index === category.values.length - 1 || (
                  data.comments !== undefined && index === data.categories.filter((x) => !x.hidden)
                  .length - 1
                ) ? 1 : 0
              )
            "
            class="table-category"
          >{{ category.name.toLowerCase() === 'quarterly' ? 'ACTUAL' : category.name }}</th>
        </tr>
        <tr class="table-columns">
          <th>{{ data.columnName || '' }}</th>
          <th
            v-for="(column, index) in columns"
            :key="index"
          >{{ column }}</th>
          <th class="table-comment"
          :class="{'table-comment-condensed-th': data.viewCount === 6}"
          :colspan="(data?.viewCount === 6) ? 6 : 0"
          v-if="data.comments !== undefined">
          <button style="display: inline-flex; align-items: center;">
            <img src="@/assets/icons/comment.svg" alt="Comment">
            <span
                class="table-comment-condensed"
                v-if="data.viewCount === 6">
              Press on the icon to read the comments
            </span>
          </button>
          </th>
        </tr>
        <tr class="table-functions" v-if="hasFunctions">
          <template v-for="(category, index) in data.categories.filter(x => !x.hidden)"
            :key="index">
            <th
              :colspan="
                (index === 0 ?
                category.values.slice(0, data.viewCount).length :
                (index === 3 && data?.viewCount === 6) ? 10 : category.values.length) + (
                  index === 0 || index === category.values.length - 1 || (
                  data.comments !== undefined && index === data.categories.filter((x) => !x.hidden)
                  .length - 1
                  ) ? 1 : 0
                )
              "
            >
              <template v-if="category.key === 'projected'">
                <slot name="functions" />
              </template>
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, index) in data.rows" :key="index">
          <tr v-if="!row.hidden">
            <td class="table-row" @click="handleClick(row)">
              <span v-if="row.showCounter">{{ (index + 1).toString().padStart(2, '0') }}</span>
              <span class="financial-indicator"
              v-if="data?.title === 'financials'">{{ row.name }}</span>
              {{ data?.title !== 'financials' ? row.name : null }}
              <Help align="bottom" v-if="row.help">{{ row.help }}</Help>
            </td>
            <template
              v-for="(category, index) in data.categories.filter((x) => !x.hidden)"
              :key="index"
            >
              <td
                v-for="(value, index) in (category.key === 'actual' || category.key === 'quarterly'
                ? category.values.slice(-(data.viewCount ? data.viewCount : 0)) : category.values)"
                :key="index"
                :style="{
                  'font-size': override(row, category).size || '',
                  'font-weight': override(row, category).weight || '',
                  'color': row.editable && category.editable
                    ? 'var(--theme-link-color)' : (category.color || ''),
                    'cursor': (row.editable && category.editable) ? 'pointer' : '',
                  }"
                class="table-value"
                @dblclick="createComment($event, row.key, value[data.column])"
                @click="
                  (data.comments !== undefined && isCommentEnabled
                    && !(row.editable && category.editable)) ?
                  createComment($event, row.key, value[data.column]) : (
                    (row.editable && category.editable) ? (
                      data.editEvent ?
                      onFieldChange() :
                      editValue(
                        value,
                        row.key,
                        handleValue(row, value[row.key], value, category, false),
                      )
                    ) :
                    undefined
                  )
                "
              >
                <Help
                  style="
                    padding: 8px 0;
                    margin-left: 4px;"
                  align="left"
                  hoverWidth="217px"
                  hoverPadding="12px 16px 12px 16px"
                  v-if="row.terminalHelp && data.tableType === 'estimateTable' && index === 4" >
                  <p class="help-description"
                    v-text="row.terminalHelp">
                  </p>
                </Help>
                <div v-else>
                  {{editableContext == value && editableKey == row.key ? undefined :
                    value[row.key] || value[row.key] === 0
                      ? handleValue(row, value[row.key], value, category)
                      : '-'
                  }}
                </div>
                <button
                  class="table-circle"
                  @click="showComment(getCommentIndex(row.key, value[data.column]))"
                  v-if="(getCommentIndex(row.key, value[data.column]) !== -1) &&
                  (editableContext !== value || editableKey !== row.key)"
                >• </button>
                <div style="display: block"
                v-if="editableContext == value && editableKey == row.key">
                  <div style="position: relative;">
                    <p style="position: absolute; right: 3px; top: 4px;">%</p>
                    <input
                      type="text"
                      v-model="value[row.key]"
                      class="table-editable"
                    />
                    <!-- <Input
                      v-model:value="value[row.key]"
                      :field="'forecastField'"
                      class="table-editable"
                      @change="onEditEvent"
                      /> -->
                  </div>
                </div>
                <!-- <input
                  type="text"
                  v-model="value[row.key]"
                  class="table-editable"
                  @input="onEditEvent"
                  v-if="editableContext == value && editableKey == row.key"
                /> -->
                <div class="table-new-comment"></div>
              </td>
            </template>
            <td
              class="table-comment"
              :colspan="data?.viewCount === 6 ? 6 : 0"
              @click="(data.comments !== undefined && isCommentEnabled) &&
                createComment($event, row.key)"
              @dblclick="createComment($event, row.key)"
              v-if="data.comments !== undefined"
            >
              <button
                style="display: inline-flex; align-items: center;"
                @click="isCommentModalShown = true"
                v-if="(data.comments || []).filter((x) => (x.field === row.key &&
                  ((x.column === undefined || x.column === null) ||
                  (data.column === 'quarterlyPeriod' ? x.column?.toString().indexOf('Q') === 0 :
                  x.column?.toString().indexOf('Q') === -1)))).length > 0"
              >
                <img src="@/assets/icons/comment.svg" alt="Comment" style="margin-top: 2px;">
                <span
                class="table-comment-condensed"
                v-if="data.viewCount === 6">
                  {{(data.comments || []).filter((x) => (x.field === row.key &&
                  ((x.column === undefined || x.column === null) ||
                  (data.column === 'quarterlyPeriod' ? x.column?.toString().indexOf('Q') === 0 :
                  x.column?.toString().indexOf('Q') === -1))))
                  .map((x) => x.text).join(", ")}}
                </span>
              </button>
            </td>
          </tr>
          <tr class="table-spacer" v-if="row.separate"></tr>
        </template>
        <component
          v-for="(row, index) in rows.filter(row =>!row.hidden)"
          :key="index"
          :is="row"
          :index="data.rows.filter(row =>!row.hidden).length + index"
          :comments="data.comments !== undefined"
        />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  nextTick,
  computed,
  ref,
  onUpdated,
  useSlots,
  watch,
} from 'vue';
import { useStore } from 'vuex';

import { useCompiler } from '@/controllers/compiler';

import { COMMENT_CURSOR, SELECTED_ROWS } from '@/store/actions/application';
import { useRouter, useRoute } from 'vue-router';
import { typeControl } from '@/views/company/financials/data/controls';
import Input from '@/components/ui/InputComponent.vue';
import ForecastEditingAskModal from '../ForecastEditingAskModalComponent.vue';
import Card from '../CardComponent.vue';
import Textarea from '../TextareaComponent.vue';
import Help from '../HelpComponent.vue';
import {
  TableCategory,
  TableData,
  TableOverride,
  TableRow,
} from './types';

export default defineComponent({
  name: 'TableComponent',
  components: {
    Card,
    Textarea,
    Help,
    Input,
    ForecastEditingAskModal,
  },
  props: {
    data: {
      type: Object as PropType<TableData>,
      required: true,
    },
    commentModal: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ['edit', 'newComment', 'editComment', 'deleteComment'],
  setup(props, { emit }) {
    const store = useStore();
    const modal = ref();
    const router = useRouter();
    const route = useRoute();
    const slots = useSlots();
    const defaultSlot = slots.default && slots.default();
    const rows = defaultSlot?.filter((item) => (item.type as any).name === 'RowComponent') || [];
    const hasFunctions = !!slots.functions;
    const forecastEditingShow = computed(() => props.data.columnName === 'Fiscal' && !store.state.application.forecastEditingModalShow && route.name === 'company');
    const editableContext = ref<any>();
    const editableKey = ref<string>();

    const isCommentModalShown = ref(false);
    const activeComment = ref<number | undefined>(undefined);

    const computedData = computed(() => props.data);
    const { compile, clearCache } = useCompiler(computedData);
    const updatePosition = () => {
      if (!modal.value) {
        return;
      }

      const scale = Math.abs(window.innerWidth / 1512);

      modal.value.style.height = `${window.innerHeight / scale}px`;
      modal.value.style.top = '0px';

      nextTick(() => {
        modal.value.style.top = `${window.scrollY / scale}px`;
      });
    };

    watch(isCommentModalShown, () => {
      window.addEventListener('scroll', updatePosition);

      nextTick(() => {
        updatePosition();
      });
    });

    const isCommentEnabled = computed(() => store.state.application.commentCursor);

    const columns = computed(() => {
      const data: string[] = [];
      props.data.categories.forEach((category) => {
        if (!category.hidden) {
          // select the last viewCount values from category
          category.values.slice(-(props.data.viewCount ? props.data.viewCount : 0))
            .forEach((value) => {
              if (props.data.column === 'quarterlyPeriod' && value.quarter) {
                data.push(value.quarterlyPeriod);
              } else data.push(value.year);
            });
        }
      });

      return data;
    });

    const override = (row: TableRow, category: TableCategory): TableRow | TableOverride => {
      if (row.override && row.override[category.name]) {
        return row.override[category.name];
      }
      return row;
    };

    const handleValue = (
      row: TableRow,
      value: number | string,
      context: any,
      category: TableCategory,
      render = true,
    ) => {
      let expression: string | number | undefined = Number(value);

      if (Number.isNaN(expression)) {
        expression = value.toString();
      }

      expression = compile(expression, context);

      if (typeof expression === 'string') {
        return expression;
      }

      const overrided = override(row, category);

      return overrided.handler && render ? overrided.handler(expression) : expression;
    };

    const onFieldChange = (column?: string, field?: string, value?: number) => {
      emit('edit', column, field, value);
    };
    const handleClick = async (row: any) => {
      if (props.data.title === 'financials') {
        localStorage.setItem('financials-type', typeControl.CHART);
        const initialSelectedRows: TableRow[] = [row];
        store.commit(SELECTED_ROWS, initialSelectedRows);
        const symbol = route.params.symbol as string;
        await router.push({ name: 'companyFinancial', params: { id: symbol, rowKey: row.key } });
      }
    };
    const editValue = (context: any, key: string, value: any) => {
      // setTimeout(() => {
      // context[key] = value; // eslint-disable-line
      // editableContext.value = context;
      // editableKey.value = key;
      // }, 300);
      nextTick(() => {
        context[key] = value; // eslint-disable-line
        editableContext.value = context;
        editableKey.value = key;
        const editable = document.querySelector('.table-editable');

        if (editable === undefined) {
          return;
        }

        const onClickOutside = (event: Event | KeyboardEvent) => {
          if (event.type !== 'keydown' || (event as KeyboardEvent).code !== 'Enter') {
            const target = event.target as HTMLElement;

            if (target.classList.contains('table-editable') || target.classList.contains('table-value')) {
              return;
            }
          }
          if (editableContext.value && editableKey.value) {
            // console.log(props.data.column);
            const numeric = Number(editableContext.value[editableKey.value as string]);
            if (!Number.isNaN(numeric)) {
              onFieldChange(
                editableContext.value.year,
                editableKey.value,
                numeric,
              );
            }
          }

          editableContext.value = undefined;
          editableKey.value = undefined;

          window.removeEventListener('mousedown', onClickOutside);
          window.removeEventListener('keydown', onClickOutside);
        };

        window.addEventListener('mousedown', onClickOutside);
        window.addEventListener('keydown', onClickOutside);
      });
    };

    const onEditEvent = (event: Event) => {
      const target = event.target as HTMLInputElement;
      target.value = target.value.replace(',', '.');
    };

    const showComment = (index: number) => {
      activeComment.value = index;
      isCommentModalShown.value = true;
      store.commit(COMMENT_CURSOR, false);
    };

    const closeComment = () => {
      isCommentModalShown.value = false;
      window.removeEventListener('scroll', updatePosition);

      store.commit(COMMENT_CURSOR, true);
    };

    const createComment = (event: MouseEvent, field: string, column?: string) => {
      if (editableContext.value) return;
      // Get mouse coordinates relative to the document
      emit('newComment', {
        column,
        field,
        title: '',
        text: '',
        createdAt: (new Date()).toISOString(),
      });
      if ((props.data.comments?.length || 0) > 0) {
        showComment(0);
      }
    };

    // get index if this cell has a comment on (field, column)
    // field: rowField : "Earnings per share", column: columnLabel: "Q12023"
    const getCommentIndex = (field: string, column: string) => (
      props.data.comments || []).findIndex((x) => (x.field === field
      && (x.column !== undefined && x.column !== null && x.column?.toString()
      === column?.toString())));

    const saveComment = (index: number) => {
      emit('editComment', index);
    };

    const deleteComment = (index: number) => {
      emit('deleteComment', index);
    };

    const getRowIndexByField = (field: string) => props.data.rows.findIndex((x) => x.key === field);

    onUpdated(() => clearCache());

    return {
      rows,
      columns,
      modal,
      forecastEditingShow,
      hasFunctions,
      handleValue,
      editValue,
      handleClick,
      onFieldChange,
      onEditEvent,
      editableContext,
      editableKey,
      activeComment,
      isCommentModalShown,
      isCommentEnabled,
      createComment,
      getCommentIndex,
      showComment,
      closeComment,
      saveComment,
      deleteComment,
      getRowIndexByField,
      override,
    };
  },
});
</script>

<style>
.table {
  --font-size-8: 8px;
  --font-size-10: 10px;
  --font-size-12: 12px;
  --font-size-14: 14px;
  display: flex;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  font-size: var(--font-size-12);
  font-weight: 500;
  text-align: left;
  height: 100%;
}

.table.table__comment {
  cursor: url('@/assets/icons/cursor.svg'), auto;
}

.table > .table-modal {
  position: fixed;
  width: 100%;
  left: 0;
  /* position: fixed;
  top: 50%;
  left: 50%; */
  display: flex;
  transform: translate(0%, 0%);
  align-items: center;
  justify-content: center;
  z-index: 99;
  background: rgba(0, 0, 0, .7);
}
.table > .table-modal .table-modal-content {
  width: 464px;
  /* align-items: ; */
}
.table > .table-modal .table-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
}

.table > .table-modal .table-modal-header > .table-modal-header-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table > .table-modal .table-modal-header > .table-modal-header-section > p {
  font-size: var(--font-size-14);
  font-weight: 600;
}

.table > .table-modal .table-modal-comment {
  border-top: 1px solid var(--theme-text-gray-2);
  padding: 9px 0;
}

.table > .table-modal .table-modal-comment .table-modal-comment-visible {
  position: relative;
  display: flex;
  gap: 8px;
  align-items: center;
}

.table > .table-modal .table-modal-comment .table-modal-comment-visible > span {
  font-size: var(--font-size-10);
  color: var(--theme-text-gray);
}

.table > .table-modal > .card {
  padding-bottom: 0;
}

.table > .table-modal .table-modal-comment .table-modal-comment-visible > p {
  font-size: var(--font-size-12);
  font-weight: 500;
  color: var(--theme-text-color-2);
}

.table > .table-modal .table-modal-comment .table-modal-comment-visible > .table-comment-spoiler {
  color: #B3B3B3;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 165px;
  overflow: hidden;
}

.table > .table-modal .table-modal-comment .table-modal-comment-visible > button {
  position: absolute;
  top: 50%;
  right: 0;
  top: 50%;
  transform: translateY(-50%) rotateX(180deg);
}

.table > .table-modal .table-modal-comment.table-modal-comment__expand
.table-modal-comment-visible > button {
  transform: translateY(-50%);
}

.table > .table-modal .table-modal-comment .table-modal-comment-hidden {
  background: #F4F6FF;
  padding: 16px;
  border-radius: 16px;
  margin-top: 9px;
}

.table > .table-modal .table-modal-comment .table-modal-comment-hidden input,
.table > .table-modal .table-modal-comment .table-modal-comment-hidden textarea {
  background: none;
  outline: none;
  border: none;
  color: var(--theme-text-color-2);
}

.table > .table-modal .table-modal-comment .table-modal-comment-hidden input::placeholder,
.table > .table-modal .table-modal-comment .table-modal-comment-hidden textarea::placeholder {
  color: var(--theme-text-color-2);
}

.table > .table-modal .table-modal-comment .table-modal-comment-hidden textarea {
  display: block;
  height: auto;
  width: 100%;
  resize: none;
}

.table > .table-modal .table-modal-comment .table-modal-comment-hidden
.table-modal-comment-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.table > .table-modal .table-modal-comment .table-modal-comment-hidden
.table-modal-comment-title > input {
  text-transform: uppercase;
  font-size: var(--font-size-14);
  font-weight: 800;
}

.table > .table-modal .table-modal-comment .table-modal-comment-hidden > p {
  font-size: var(--font-size-12);
  font-weight: 600;
  color: #B3B3B3;
  margin-bottom: 16px;
}

.table > .table-modal button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
}

.table table {
  border: none;
  border-collapse: collapse;
  width: 100%;
}

.table table > thead {
  /* position: sticky; */
  top: 0;
  z-index: 3;
}

.table table > thead > tr:first-child > th:first-child {
  border-top-left-radius: 16px;
}

.table table > thead > tr:first-child > th:last-child {
  border-top-right-radius: 16px;
}

.table table > thead,
.table table > tbody {
  width: 100%;
  border: none;
  border-collapse: collapse;
}

.table tr {
  height: 32px;
}

.table th, .table td {
  height: 100%;
  /* min-width: 61px;
  width: 61px; */
  padding: 0 3px;
}

.table .table-category {
  background: var(--theme-link-color);
  font-weight: 800;
  font-size: var(--font-size-10);
  color: var(--theme-text-color-contrast);
  text-transform: uppercase;
  text-align: center;
  border-right: 1px solid var(--theme-background-color);
}

.table .table-columns {
  background: var(--theme-table-color);
}

.table tbody > tr > th {
  position: relative;
  z-index: 0;
}

.table tbody > tr > .table-row > .helper {
  display: inline-block;
  margin-left: 4px;
  margin-bottom: -2px;
}

.table .table-columns > th,
.table tbody > tr > .table-row:first-child {
  font-weight: 600;
}

.table .table-columns > th:first-child {
  padding-left: 45px;
  min-width: calc(170px + 45px);
  box-sizing: border-box;
}

.table .table-functions {
  background: #F4F6FF;
}

.table .table-functions th > * {
  margin-right: 36px;
  font-weight: 500;
  font-size: var(--font-size-10) !important;
}
.table .table-functions th > .condensed {
  margin-right: 32px;
}
.table .table-functions th > *:last-child {
  margin-right: 0;
}

.table tbody > tr > .table-row:first-child {
  padding-left: 24px;
  min-width: calc(154px + 24px);
  box-sizing: border-box;
}

.table tbody > tr > .table-row:first-child:hover {
  padding-left: 24px;
  min-width: calc(154px + 24px);
  box-sizing: border-box;
}
.table tbody > tr > .table-row .financial-indicator {
  font-weight: 600;
  min-width: calc(154px + 24px);
  box-sizing: border-box;
  font-size: var(--font-size-12);
  color: var(--theme-text-color);
}
.table tbody > tr > .table-row .financial-indicator:hover {
  color: var(--theme-link-color);
  cursor: pointer;
}
.table tbody > tr > .table-row > span {
  font-size: var(--font-size-10);
  font-weight: 400;
  color: var(--theme-text-gray-3);
  padding-right: 8px;
}
.table tbody > tr > .table-row > label {
  font-size: var(--font-size-12);
  font-weight: 500;
  color: var(--theme-text-gray);
  padding-right: 8px;
}
.table tbody > tr > td {
  --padding-right: 7px;
  border-top: 1px solid var(--theme-background-color);
  background: var(--theme-text-color-contrast);
  padding-right: var(--padding-right);
}

.table tbody > tr > td:last-child {
  padding-right: 0;
}

.table .table-spacer {
  height: 16px;
}

.table .table-value {
  position: relative;
}

.table .table-comment {
  position: relative;
  /* width: 36px;
  min-width: 36px; */
  padding-right: 24px;
  box-sizing: border-box;
}

.table .table-comment.table-comment-condensed-th {
  width: 300px;
  min-width: 300px;
}

.table .table-comment.table-comment-condensed-th >span {
  margin-left: 4px;
  color: #3348fa;
}

.table .table-comment > button {
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
}

.table .table-editable {
  /* position: absolute;
  top: 20%;
  left: 50%; */
  max-width: 100%;
  width: 100%;
  height: 120%;
  /* transform: translate(-50%, -20%); */
  border: none;
  outline: none;
  border-radius: 8px;
  box-shadow: 0px 4px 24px 0px rgba(51, 72, 251, 0.3), 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
  text-align: center;
  z-index: 1;
  padding: 4px 15px;
  color: var(--theme-link-color);
  font-weight: 500;
  font-size: var(--font-size-12);
}

.table tbody > tr > td > .table-circle {
  color: var(--theme-link-color);
  font-size: 12px;
  font-weight: 500;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
}

.table tbody > tr > td > .table-new-comment {
  position: absolute;
  top: 50%;
  right: calc(var(--padding-right) + 10px);
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  background: url('@/assets/icons/add-comment.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: none;
}

.table.table__comment tbody > tr > td:hover > .table-new-comment {
  display: block;
}
.table .table-comment > button >span {
  margin-left: 4px;
  color: #3348fa;
}
/* @media screen and (max-width: 1512px) {
  .table {
    --font-size-12: 11px;
    --font-size-14: 13px;
  }

  .table th, .table td {
    min-width: 40px;
    width: 40px;
    padding: 0 2px;
  }

  .table tbody > tr > td {
    --padding-right: 3px;
  }
}

@media screen and (max-width: 1410px) {
  .table {
    --font-size-8: 7px;
    --font-size-10: 9px;
  }
}

@media screen and (max-width: 1300px) {
  .table {
    --font-size-8: 6px;
    --font-size-10: 8px;
    --font-size-12: 10px;
    --font-size-14: 12px;
  }

  .table .table-functions th > * {
    margin-right: 24px;
  }
} */
</style>
