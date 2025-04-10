<template>
  <Table
    class="financials-table"
    :data="tableData"
    v-on:edit="onEditEvent"
    v-on:new-comment="createComment"
    v-on:edit-comment="saveComment"
    v-on:delete-comment="deleteComment"
  >
    <template #functions>
      <Button
        type="transparent"
        size="small"
        :class="{'condensed' : viewType==='condensed'}"
        style="position: relative;"
        @click="forecastMenu = !forecastMenu"
      >
        {{
          company.forecast.value ?
          `${company.forecast.value.name} - ${
            new Date(company.forecast.value.updatedAt).toLocaleDateString()
          }`
          : 'Forecast name'
        }}
        <img
          src="@/assets/icons/arrow-down.svg"
          alt="Arrow"
          :class="{
            'reversed-arrow': forecastMenu
          }"
        >
        <div class="forecast-menu" v-if="forecastMenu">
          <button
            v-for="(forecast, index) in company.forecasts"
            :key="index"
            class="forecast-button"
            :class="{
              'forecast-button__active': forecast.id == company.forecast.value?.id
            }"
            @click="company.setForecast(forecast)"
          >{{ forecast.name }} - {{ new Date(forecast.updatedAt).toLocaleDateString() }}</button>
        </div>
      </Button>
      <Button type="transparent" size="small"
      :class="{'condensed' : viewType=== 'condensed'}">Save</Button>
      <Button
        type="transparent"
        size="small"
        :class="{'condensed' : viewType=== 'condensed'}"
        @click="exportExcel(company, tableData)"
      >Export</Button>
      <Button type="transparent" size="small"
      :class="{'condensed' : viewType=== 'condensed'}">Embed</Button>
    </template>
    <Row name="CEO" :separate="true">
      <td
        v-for="(ceo, index) in ceos"
        :key="index"
        :colspan="ceo?.colspan"
        class="ceo-row"
        :class="{
          'ceo-row__last': index === ceoData.length - 1,
        }"
      >
        <div class="ceo-row-inner">
          <div class="ceo-backdrop"></div>
          <div class="ceo-photo">
            <div v-if="ceo.avatar">
              <img
                :src="`/files/companies/img/`+ ceo.avatar"
                style="display: none;"
                @error="handleImageError(index)"
                @load="handleImageLoad(index)"
                alt="Image"
              />
              <img
                v-if="isImageLoaded[index]"
                :src="`/files/companies/img/`+ ceo.avatar"
                alt="Image"
              />
            </div>
          </div>
          <div class="ceo-name">
            {{ ceo.fullName }}
          </div>
        </div>
      </td>
      <td
        class="ceo-filler"
        :colspan="fillerCols"
      >
        <div class="ceo-backdrop"></div>
      </td>
    </Row>
  </Table>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import { CompanyController } from '@/controllers/company/types';
import Button from '@/components/ui/ButtonComponent.vue';
import ImageLoader from '@/components/ui/ImageLoader.vue';
import {
  TableComponent as Table,
  RowComponent as Row,
} from '@/components/ui/table';
import { TableData } from '@/components/ui/table/types';

import { SHOW_MODAL } from '@/store/actions/application';

import { exportExcel } from '@/services/excel';

import { Comment } from '@/rest-api/comments/assets';

import { tableRows } from './data/rows';
import { forecastControl, periodControl, viewControl } from './data/controls';

export default defineComponent({
  name: 'FinancialsTable',
  components: {
    Table,
    Row,
    Button,
  },
  props: {
    company: {
      type: Object as PropType<CompanyController>,
      required: true,
    },
    forecast: {
      type: String as PropType<forecastControl>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const forecastMenu = ref(false);
    const isImageLoaded = ref([false]);
    const fillerCols = ref(18);
    const handleImageError = (index: number) => {
      isImageLoaded.value[index] = false;
    };

    const handleImageLoad = (index: number) => {
      isImageLoaded.value[index] = true;
    };
    const ceos = computed(() => {
      const ceosData: any = [];
      const ceoList = props.company.ceo;
      const years = props.company.financials.actual.map((item) => Number(item.year));
      let tmpCeo: any = {
        startYear: null,
        endYear: null,
        colspan: null,
      };
      years.forEach((year) => {
        let isActivateYear = false;
        for (let i = 0; i < ceoList.length; i += 1) {
          const ceo = ceoList[i];
          if (!ceo.startYear) continue;
          if ((i < ceoList.length - 1) && !ceo.endYear) continue;
          if ((i < ceoList.length - 1) && ceo.endYear
          && (ceo.startYear <= year && year <= ceo.endYear)) {
            isActivateYear = true;
          }
          if ((i === ceoList.length - 1) && year >= ceo.startYear) {
            isActivateYear = true;
          }
          if (isActivateYear) {
            if (tmpCeo.colspan !== null) {
              tmpCeo.endYear = year;
              const newCeo = {
                startYear: tmpCeo.startYear,
                endYear: tmpCeo.endYear,
                colspan: tmpCeo.colspan,
              };
              ceosData.push(newCeo);
              tmpCeo = {
                startYear: null,
                endYear: null,
                colspan: null,
              };
            }
            if (!ceo.colspan) ceo.colspan = 0;
            ceo.colspan += 1;
            break;
          }
        }

        if (!isActivateYear) {
          if (tmpCeo.colspan === null) {
            tmpCeo.colspan = 0;
            tmpCeo.startYear = year;
          }
          tmpCeo.colspan += 1;
        }
      });
      ceosData.push(...ceoList);
      return ceosData;
    });
    const ceoData = computed(() => props.company.ceo.map((ceo, index) => {
      if (!ceo.startYear) {
        return ceo;
      }
      const years = props.company.financials.actual.map((item) => Number(item.year));
      const startedFrom = Math.max(Math.min(...years), ceo.startYear);
      const relative = ((index !== props.company.ceo.length - 1) ? 0 : 1);
      // const relative = 1;
      // const endYear = (ceo.endYear || Math.max(...years)) + relative;
      // const endYear = (ceo.endYear || Math.max(...years)) + relative;
      const endYear = Math.min((ceo.endYear || Math.max(...years)), Math.max(...years)) + relative;
      // if (!ceo.endYear && index === props.company.ceo.length - 1) {
      //   endYear = Math.max(...years) + relative;
      // }
      const colspan = endYear && startedFrom ? endYear - startedFrom : 1;
      fillerCols.value -= colspan;
      return {
        fullName: ceo.fullName,
        startYear: startedFrom,
        endYear,
        colspan,
        avatar: ceo.avatar,
      };
    }));

    const periodType = computed(() => store.state.application.periodType);
    const viewType = computed(() => store.state.application.viewType.toLowerCase());
    const tableData = computed(() => {
      const {
        actual,
        quarterly,
        average,
        estimated,
        projected,
      } = props.company.financials;
      const showAnnaul: boolean = periodType.value.toLowerCase() === periodControl.QUARTERLY;
      const showQuarterly: boolean = periodType.value.toLowerCase() === periodControl.ANNUAL;

      const data: TableData = {
        title: 'financials',
        categories: [
          {
            name: 'Actual',
            key: 'actual',
            hidden: showAnnaul,
            values: actual,
          },
          {
            name: 'Quarterly',
            key: 'quarterly',
            hidden: showQuarterly,
            values: quarterly,
          },
          {
            name: '10 year gagr',
            tableName: '10y GAGR',
            key: 'average',
            values: average,
            color: 'var(--theme-text-gray-3)',
          },
          {
            name: 'Estimated',
            key: 'estimated',
            values: estimated,
            editable: true,
          },
          {
            name: 'Projected',
            key: 'projected',
            values: projected,
            editable: true,
          },
        ],
        rows: tableRows,
        column: showAnnaul ? 'quarterlyPeriod' : 'year',
        viewCount: store.state.application.viewType.toLowerCase()
        === viewControl.CONDENSED ? 6 : 11,
        columnName: 'Fiscal',
        comments: props.company.comments,
        editEvent: props.company.forecast.value === undefined,
      };

      return data;
    });

    const onEditEvent = (column?: string, field?: string, value?: number) => {
      if (props.forecast !== forecastControl.CUSTOM) {
        store.commit(SHOW_MODAL, 'forecast');
      } else if (column && field && value !== undefined) {
        props.company.saveForecast(column, field, value);
      }
    };

    const createComment = (comment: Comment) => {
      props.company.addComment(comment);
    };

    const saveComment = (index: number) => {
      props.company.saveComment(index);
    };

    const deleteComment = (index: number) => {
      props.company.deleteComment(index);
    };

    // const toggleComment = () => {
    //   store.commit(COMMENT_CURSOR, !store.state.application.commentCursor);
    // };

    return {
      isImageLoaded,
      periodType,
      viewType,
      forecastMenu,
      ceoData,
      ceos,
      fillerCols,
      tableData,
      handleImageError,
      handleImageLoad,
      onEditEvent,
      exportExcel,
      createComment,
      saveComment,
      deleteComment,
    };
  },
});
</script>

<style scoped>
.financials-table .ceo-row {
  position: relative;
  z-index: 2;
}

.financials-table .ceo-row > .ceo-row-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  font-weight: 500;
}

.financials-table .ceo-row > .ceo-row-inner > .ceo-backdrop {
  position: absolute;
  background: #AEB7FB;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% + 12px);
  height: 18px;
  z-index: 0;
}

.financials-table .ceo-row > .ceo-row-inner > .ceo-name {
  position: relative;
  z-index: 2;
}

.financials-table .ceo-row.ceo-row__last > .ceo-row-inner > .ceo-backdrop {
  background: #D6DBFD;
}

.financials-table .ceo-row > .ceo-row-inner > .ceo-photo {
  position: absolute;
  left: 0;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #B3B3B3;
  z-index: 1;
}
.financials-table .ceo-row > .ceo-row-inner > .ceo-photo > div > img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  filter: grayscale(100%);
}
.financials-table .ceo-filler {
  position: relative;
  z-index: 1;
}

.financials-table .ceo-filler > .ceo-backdrop {
  position: absolute;
  background: #EDEDED;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% + 12px);
  height: 18px;
  z-index: 0;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
}

.financials-table .forecast-menu {
  position: absolute;
  top: calc(100% + 15px);
  left: 50%;
  transform: translateX(-50%);
  width: 286px;
  background: var(--theme-text-color-contrast);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0px 8px 18px 0px rgba(0, 0, 0, 0.06);
  z-index: 2;
}

.financials-table .forecast-menu > .forecast-button {
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
}

.financials-table .forecast-menu > .forecast-button__active {
  background: #F4F6FF;
}

.financials-table .reversed-arrow {
  transform: rotateX(180deg);
}

</style>
