<template>
  <Container>
    <Header :company="company" />
    <SummaryHeader :company="company"/>
    <div class="notes-body">
      <div class="notes-body-left">
        <div class="notes-content-left" style="width: 211px;">
          <div class="filters">
            <div>
              <button class="title" @click="expandSortPannel=!expandSortPannel">Filters
                <img src="@/assets/icons/arrow-up-round.svg" alt="arrow-up-round"
                v-if="expandSortPannel"/>
                <img src="@/assets/icons/arrow-down-round.svg" alt="arrow-up-round" v-else />
              </button>
            </div>
            <div class="filters-pannel" v-if="expandSortPannel">
              <p class="title">Sort by type</p>
              <div class="filter-items">
                <button class="item"
                @click="changeSortType(1)"
                style="display: flex; gap: 10px; text-align: center; align-items: center;">
                  <Radio :type="'default'" :value="sortType===1"/>
                  <p>{{ symbol }} only</p>
                </button>
                <button class="item"
                @click="changeSortType(2)"
                style="display: flex; gap: 10px; text-align: center; align-items: center;">
                  <Radio :type="'default'" :value="sortType===2"/>
                  <p>{{ symbol }} + Other</p>
                </button>
                <button class="item"
                @click="changeSortType(3)"
                style="display: flex; gap: 10px; text-align: center; align-items: center;">
                  <Radio :type="'default'" :value="sortType===3"/>
                  <p>All</p>
                </button>
              </div>
            </div>
          </div>
          <div class="filters">
            <div>
              <button class="title"
              @click="expandSettings=!expandSettings"
              >Settings
                <img src="@/assets/icons/arrow-up-round.svg" alt="arrow-up-round"
                v-if="expandSettings" />
                <img src="@/assets/icons/arrow-down-round.svg" alt="arrow-up-round" v-else />
              </button>
            </div>
            <div class="filters-pannel fonts" v-if="expandSettings">
              <p class="title">Fonts</p>
              <div class="filter-items">
                <button class="item"
                style="display: flex; gap: 10px; text-align: center; align-items: center;"
                v-for="(font, index) in settingsFonts"
                v-on:click="changeFontType(font.name)"
                :key="index">
                  <Radio :type="'default'" :value="fontType===font.name"/>
                  <p :class="font.name">{{ font.label }}</p>
                </button>
              </div>
            </div>
            <div class="filters-pannel additional" v-if="expandSettings">
              <p class="title">Additional</p>
              <div class="filter-items">
                <button
                class="item" v-for="(setting, index) in additionalSettings"
                @click="toggleAdditionalSetting(index)"
                :key="index">
                  <Checkbox :value="additionalTypes.includes(index)" :type="'medium'"/>
                  <p>
                    {{ setting.label }}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="notes-content" v-if="notes.length > 0">
          <AddNewNote
          v-on:refresh="refresh"
          :fontType="fontType"
          :company="company" />
          <Note
          v-for="(note, index) in notes"
          :key="index"
          v-on:refresh="refresh"
          :note="note" :company="company" :fontType="fontType" :additionalTypes="additionalTypes"/>
          <Pagination
          v-on:change-page:value="changePage"
          :currentPage="pageNum" :totalPages="totalPages" />
        </div>
        <div class="notes-content" v-else>
          <Card>
            <div style="text-align: center;"
            >
              There is no notes
            </div>
          </Card>

          </div>
        </div>
      <div class="notes-body-right">
        <NotificationView />
        <BasicFinancialPerformance :company="company"/>
      </div>
    </div>
  </Container>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import Card from '@/components/ui/CardComponent.vue';

import { useCompany } from '@/controllers/company';

import {
  LOADING,
  NOTE_ADDITIONAL,
  NOTE_FONT_TYPE,
  NOTE_SORT_TYPE,
} from '@/store/actions/application';

import Container from '@/components/ContainerComponent.vue';
import Radio from '@/components/ui/RadioButtonComponent.vue';
import Checkbox from '@/components/ui/CheckboxComponent.vue';
import { NoteData, Notes } from '@/rest-api/companies/assets';
import Pagination from '@/components/ui/Pagination.vue';
import Header from './CompanyHeader.vue';
import SummaryHeader from './CompanySummaryHeader.vue';
import Note from './note/NoteCard.vue';
import NotificationView from './notification/NotificationViewComponent.vue';
import BasicFinancialPerformance from './chart/BasicFinancialPerformance.vue';
import AddNewNote from './note/noteView/AddNewNoteComponent.vue';
import {
  FilterType,
  additionalSettings,
  settingsFonts,
  sortTypes,
} from './note/utils';

export default defineComponent({
  name: 'CompanyNoteView',
  components: {
    Container,
    Header,
    Card,
    AddNewNote,
    Radio,
    Note,
    Checkbox,
    SummaryHeader,
    NotificationView,
    BasicFinancialPerformance,
    Pagination,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const notes: NoteData[] = reactive([]);
    const symbol = route.params.symbol as string;
    const company = useCompany(symbol);
    const sortType = computed(() => store.state.application.noteSortType);
    const fontType = computed(() => store.state.application.noteFontType);
    const pageNum = ref(1);
    const totalPages = ref(0);
    const additionalTypes = computed(() => store.state.application.noteAdditionalTypes);
    store.commit(LOADING, true);
    const expandSortPannel = ref(true);
    const expandSettings = ref(true);
    const changeSortType = (newType: number) => {
      pageNum.value = 1;
      store.commit(NOTE_SORT_TYPE, newType);
      localStorage.setItem('note_sort_type', newType.toString());
    };
    const changeFontType = (newType: string) => {
      store.commit(NOTE_FONT_TYPE, newType);
      localStorage.setItem('note_font_type', newType);
    };
    const toggleAdditionalSetting = (index: number) => {
      const tmpTypes = additionalTypes.value;
      const indexPos = tmpTypes.indexOf(index);
      if (indexPos > -1) {
        tmpTypes.splice(indexPos, 1);
      } else {
        tmpTypes.push(index);
      }
      store.commit(NOTE_ADDITIONAL, tmpTypes);
      localStorage.setItem('note_additional_types', JSON.stringify(tmpTypes));
    };
    const refresh = () => {
      company.getNotes(pageNum.value, sortType.value).then((payload: Notes) => {
        notes.splice(0, notes.length);
        Object.assign(notes, payload.notes);
        totalPages.value = payload.totalPages;
        console.log(notes);
        store.commit(LOADING, false);
      });
    };
    const changePage = (page: number) => {
      pageNum.value = page;
    };
    watch(() => [sortType.value, pageNum.value], refresh);
    onMounted(() => {
      refresh();
    });

    return {
      symbol,
      notes,
      pageNum,
      totalPages,
      company,
      sortType,
      fontType,
      settingsFonts,
      additionalTypes,
      additionalSettings,
      expandSortPannel,
      expandSettings,
      changePage,
      toggleAdditionalSetting,
      changeSortType,
      changeFontType,
      refresh,
    };
  },
});
</script>

<style>
.notes-body {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.notes-body > .notes-body-left {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 16px;
}
.notes-body > .notes-body-left .notes-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
.notes-body > .notes-body-left .filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}
.notes-body > .notes-body-left .filters button {
  cursor: pointer;
}
.notes-body > .notes-body-left .filters .filters-pannel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.notes-body > .notes-body-left .filters .filters-pannel.fonts {
  padding-bottom: 16px;
  border-bottom: 1px solid #CCCCCC;
}
.notes-body > .notes-body-left .filters .filters-pannel .filter-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.notes-body > .notes-body-left .filters .filters-pannel .filter-items button.item{
  background: none;
  border: none;
  outline: none;
}
.notes-body > .notes-body-left .filters .item p {
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 2%;
  text-align: start;
}
.notes-body > .notes-body-left .filters-pannel.additional .item {
  display: flex;
  align-items: center;
  font-weight: 500;
  gap: 10px;
}
.notes-body > .notes-body-left .filters .filters-pannel .item p.large {
  font-size: 16px;
}
.notes-body > .notes-body-left .filters .filters-pannel .item p.medium {
  font-size: 14px;
}
.notes-body > .notes-body-left .filters .filters-pannel .item p.basic {
  font-size: 12px;
}
.notes-body > .notes-body-left .title {
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 2%;
  color: #131313;
  background: none;
  border: none;
}
.notes-body > .notes-body-left .filters-pannel .title {
  text-transform: unset;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 2%;
  color: #131313;
}
.notes-body > .notes-body-right {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
