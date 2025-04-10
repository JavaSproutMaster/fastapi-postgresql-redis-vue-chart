<template>
  <div class="summary-header">
    <div class="summary-header-left">
      <div class="company-summary-left">
        <div class="performance">
          <div class="performance-menu">
            <a href="#summary">Summary</a>
            <a class="active" href="#notes">Notes</a>
            <a href="#question-answers">Q&A</a>
            <a href="#financials">Financials</a>
            <a href="#forecast">Forecast</a>
            <a href="#value-estimate">Other</a>
          </div>
        </div>
      </div>
    </div>
    <div class="summary-header-right">
      <!-- <button class="button" @click="showListModal"> -->
      <Dropdown class="list-header-button" :menuWidth="'200px'"
        :menuTransform="'translateY(0px)'">
        <img src="@/assets/icons/add.svg" alt="Add">
        <div>Add to list</div>
        <template #content>
          <div ref="listsContent">
            <div class="list-add-field-search">
              <Input
              v-model:value="searchList"
              type="string"
              placeholder="Search"
              @focusin="blurHandler"/>
            </div>
            <div class="list-column-fields" v-if="showLists">
              <div v-for="(list, index) in filteredLists" :key="index"
              class="list-column-field-item">
                <Checkbox v-model:value="list.isAdded"/>
                {{ list.name }}
              </div>
            </div>
            <div style="display: flex; gap: 4px; padding-top: 10px;" v-if="showLists">
              <Button style="width: 100%;"
                :size="'small'"
                @click="add2List">Add</Button>
              <Button style="width: 100%; white-space: nowrap;"
                :type="'secondary'"
                :size="'small'"
                @click="showListModal">Create NEW</Button>
            </div>
          </div>
        </template>
      </Dropdown>
      <!-- </button> -->
      <div class="add-list">
        <template
          v-for="(list, index) in addedLists.filter((list: LightList) => list.isAdded)"
          :key="index"
        >
          <div class="list-item">
            ●
            <button
              class="list-button"
              :class="{
                'list-button__active': list.isAdded,
              }"
              @click="toggleList(list)"
            >{{ list.name }}</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  reactive,
  onUpdated,
  onMounted,
  onUnmounted,
  watch,
} from 'vue';
import { useStore } from 'vuex';

import { DropdownComponent as Dropdown, DropdownValue } from '@/components/ui/dropdown';
import Checkbox from '@/components/ui/CheckboxComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import { CompanyController } from '@/controllers/company/types';
import { LightList } from '@/rest-api/lists/assets';
import * as api from '@/rest-api/lists';

import { SHOW_MODAL } from '@/store/actions/application';
import { list } from '@/rest-api/companies';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CompanyCalculator',
  components: {
    Button,
    Dropdown,
    Checkbox,
    Input,
  },
  props: {
    company: {
      type: Object as PropType<CompanyController>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const listsContent = ref<HTMLElement | null>(null);
    const forecastType = ref<string>();
    const modelPrice = ref<number>();
    const forecastMenu = ref(false);
    const showLists = ref(false);
    const lists: LightList[] = reactive([]);
    const filteredLists = ref<LightList[]>([]);
    const addedLists = ref<LightList[]>([]);
    const searchList = ref('');

    const blurHandler = () => {
      showLists.value = true;
    };

    const showListModal = () => {
      store.commit(SHOW_MODAL, 'new-list');
    };

    const toggleList = async (list: LightList) => {
      // list.isAdded = !list.isAdded; // eslint-disable-line
      // const method = list.isAdded ? api.add : api.remove;
      // filteredLists.value?.forEach((filteredList: LightList) => {
      //   if (filteredList.id === list.id) {
      //     Object.assign(filteredList, list);
      //   }
      // });
      // method(list.id, props.company.data.symbol);
      // await router.push({ name: 'list', params: { id: list.id } });
      // window.location.reload();
      window.location.href = `/list/${list.id}`;
    };
    const addList = (list: LightList) => {
      const method = list.isAdded ? api.add : api.remove;

      method(list.id, props.company.data.symbol);
    };
    const add2List = () => {
      filteredLists.value.forEach((list) => {
        addList(list);
      });
      addedLists.value = JSON.parse(
        JSON.stringify(filteredLists.value.filter((list) => list.isAdded)),
      );
    };

    watch(props.company.data, () => {
      if (!props.company.data.symbol) {
        return;
      }

      api.lists(props.company.data.symbol).then((payload) => {
        lists.splice(0, lists.length);
        Object.assign(lists, payload);
        filteredLists.value = JSON.parse(JSON.stringify(payload));
        addedLists.value = JSON.parse(JSON.stringify(payload));
      });
    });

    watch(searchList, () => {
      if (!searchList.value || searchList.value === '') {
        filteredLists.value = lists;
      }
      const searchString = searchList.value.toLocaleLowerCase();
      const toReturn = lists.filter((list: LightList) => {
        if (list.name.toLocaleLowerCase().includes(searchString)) return true;
        return false;
      });
      filteredLists.value = toReturn;
    });

    const clickHandler = (event: Event | KeyboardEvent) => {
      if (event.type !== 'keydown' || (event as KeyboardEvent).code !== 'Enter') {
        const target = event.target as HTMLElement;
        if (listsContent.value && listsContent.value.contains(target)) return;
        showLists.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', clickHandler);
    });

    onUnmounted(() => {
      document.removeEventListener('click', clickHandler);
    });

    return {
      lists,
      filteredLists,
      forecastType,
      modelPrice,
      forecastMenu,
      showLists,
      listsContent,
      searchList,
      addedLists,
      add2List,
      blurHandler,
      showListModal,
      toggleList,
    };
  },
});
</script>

<style>
.summary-header {
  display: flex;
  gap: 16px;
}
.summary-header .summary-header-left {
  flex: 1;
}
.summary-header .summary-header-right {
  flex: 0 0 300px;
  display: flex;
  gap: 8px;
  /* align-items: center; */
  font-size: 12px;
  margin-top: 8px;
  margin-bottom: 16px;
}

.summary-header .summary-header-right .dropdown-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  color: var(--theme-link-color);
  text-transform: uppercase;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  /* padding-top: 8px; */
}

.summary-header .summary-header-right .add-list {
  display: flex;
  /* width: 100%; */
  gap: 4px;
  flex-flow: wrap;
}
.summary-header .summary-header-right .add-list .list-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  /* margin-top: 8px; */
  margin-bottom: 12px;
  gap: 4px;
}

</style>
