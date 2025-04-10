<!-- eslint-disable max-len -->
<template>
  <Card class="list-header" v-if="list">
    <div class="list-header-side">
      <Dropdown class="list-title" :values="listsDropdownValues" v-model:value="listsDropdownValue" :menu-left="'-40px'"
        :menuTransform="'none'">
        <h2>{{ list.name }}</h2>
        <img style="padding-left: 2px" :class="{
            'reversed-arrow': false,
          }" src="@/assets/icons/arrow-down-smooth.svg" alt="Arrow">
      </Dropdown>
      <Dropdown class="list-header-button" :tooltip-text="'Edit'" :menuWidth="'200px'" :menuLeft="'-40px'"
        :menuTransform="'none'">
        <img src="@/assets/icons/edit.svg" alt="Edit">
        <template #content>
          <button class="dropdown-menu-button" @click="renameList">Rename list</button>
          <CollapseComponent :btnWidth="'100%'" :text="'Remove symbol'" :active="selectedRemoveSymbol === true"
            v-on:click-collapse="selectedRemoveSymbol = !selectedRemoveSymbol">
            <div class="list-add-field-search">
              <Input type="string" placeholder="Search" v-model:value="removeSymbolSearch" />
            </div>
            <div class="list-column-fields" style="width: 190px;">
              <div v-for="(company, index) in filteredExistCompanies" :key="index" class="list-column-field-item"
                style="width: 100%;">
                <Checkbox v-model:value="company.isSubscribed" />
                {{ company.name }}
              </div>
            </div>
            <Button @click="handleRemoveSymbols" style=" width: 100%;"
              :size="'small'">Remove</Button>
          </CollapseComponent>
          <button class="dropdown-menu-button" @click="removeList" v-if="selectedRemoveSymbol === false">Delete
            list</button>
        </template>
      </Dropdown>
      <Dropdown :tooltip-text="'Add to list'" class="list-header-button" :menuLeft="'-40px'" :menuTransform="'none'">
        <img src="@/assets/icons/plus.svg" alt="Plus">

        <template #content>
          <div class="list-company-search">
            <Input type="string" placeholder="Search" v-model:value="companySearch" />
          </div>
          <div class="list-company-values">
            <div v-for="(company, index) in filteredCompanies" :key="index" class="list-company-value">
              <Checkbox v-model:value="company.isSubscribed" v-on:update:value="toggleSubscrption(company)" />
              {{ company.name }}
            </div>
          </div>
        </template>
      </Dropdown>
      <Tooltip :tooltipText="'Manage price alerts'">
        <Button :type="'transparent'" >
          <img src="@/assets/icons/alert.svg" alt="Alert">
        </Button>
      </Tooltip>

      <Tooltip v-if="!shared" :tooltipText="'Share'" v-on:click-tooltip="copyLinkToClipboard">
        <Button :type="'transparent'" :class="'list-header-button'" @click="toggleShare" :disabled="sharing">
          <img src="@/assets/icons/share.svg" alt="Edit">
        </Button>
      </Tooltip>
      <Tooltip v-if="shared" :tooltipText="copiedToClipboard ? `The list is now sharable. Link copied to clipboard.` : 'The list is now sharable.'"
        :tooltip-link="copiedToClipboard ? undefined : 'Copy link to clipboard'" v-on:click-tooltip="copyLinkToClipboard">
        <Button :type="'transparent'" :class="'list-header-button'" @click="toggleShare">
          <img src="@/assets/icons/share_active.svg" alt="Edit">
        </Button>
      </Tooltip>
      <!-- <Dropdown class="list-header-button" :tooltip-text="'Share'">
        <img src="@/assets/icons/share.svg" alt="Edit" :class="{'share_list': list.share === true}">
      </Dropdown> -->
    </div>
    <div class="list-header-side">
      <div class="list-filter">
        <span>View:</span>
        <Button v-for="(view, index) in viewControl" :key="index" :visuallyDisabled="selectedView !== view"
          type="transparent" size="small" @click="changeView(view)">{{ view }}</Button>
        <!-- <Button type="transparent">Extended</Button>
        <Button type="transparent" :visually-disabled="true">Condensed</Button> -->
      </div>
      <div class="list-filter">
        <span class="list-checkbox">Show highlights</span>
        <Checkbox :value="highLight" v-on:update:value="toggleHighlight" />
      </div>
    </div>
    <div class="list-header-side list-header-side-fields-setting">
      <div class="list-search">
        <Input type="string" placeholder="Search" />
      </div>
      <Dropdown class="list-header-button" :menuWidth="'200px'" :menuRight="'-20px'" :menuTransform="'none'">
        <img src="@/assets/icons/settings.svg" alt="Settings">
        <template #content>
          <CollapseComponent :text="'Add a field'" :active="selectedFieldSettingItem === 'add'" :btnWidth="'100%'"
            v-on:click-collapse="toggleFieldsSettingItem('add')">
            <div class="list-column-fields">
              <div v-for="(field, index) in updatedAddFields" :key="index" class="list-column-field-item">
                <Checkbox v-model:value="field.value" v-on:update:value="toggleAddedField(field)" />
                {{ field.name }}
              </div>
            </div>
            <Button style="width: 100%;" :size="'small'"
            @click="handleUpdateFields">Update</Button>
          </CollapseComponent>
          <CollapseComponent :text="'Remove a field'" :active="selectedFieldSettingItem === 'remove'" :btnWidth="'100%'"
            v-on:click-collapse="toggleFieldsSettingItem('remove')">
            <div class="list-add-field-search">
              <Input type="string" placeholder="Search" v-model:value="removeFieldSearch" />
            </div>
            <div class="list-column-fields">
              <div v-for="(field, index) in filteredRemoveFields" :key="index" class="list-column-field-item">
                <Checkbox v-model:value="field.value" v-on:update:value="toggleRemoveField(field)" />
                {{ field.name }}
              </div>
            </div>
            <Button @click="handleUpdateFields" style="width: 100%;"
              :size="'small'">Update</Button>
          </CollapseComponent>
        </template>
      </Dropdown>
    </div>
  </Card>
  <ListNameModal :list-id="list?.id || 0" />
  <DuplicateListModal :list-id="list?.id || 0" />
  <ListUpdateWarningModal :view-type="selectedView"/>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  reactive,
  watch,
  computed,
  onMounted,
} from 'vue';
import { storeKey, useStore } from 'vuex';
import { useRouter } from 'vue-router';

import Levenshtein from 'levenshtein';

import Card from '@/components/ui/CardComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import Checkbox from '@/components/ui/CheckboxComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import { DropdownComponent as Dropdown, DropdownValue } from '@/components/ui/dropdown';
import ListNameModal from '@/components/modals/ListNameModal.vue';
import DuplicateListModal from '@/components/modals/DuplicateListModal.vue';
import ListUpdateWarningModal from '@/components/modals/ListUpdateWarningModal.vue';
import * as api from '@/rest-api/lists';
import { List } from '@/rest-api/lists/assets';

import * as companyApi from '@/rest-api/companies';

import {
  LIST_VIEW_TYPE, SHOW_MODAL, LIST_REMOVED_FIELDS, LIST_HIGHLIGHT,
} from '@/store/actions/application';

import CollapseComponent from '@/components/ui/CollapseComponent.vue';
import { CheckBoxField } from '@/components/ui/table-column/types/data';
import CompanyListSimple from './types';
import { settingsDropdown } from './dropdown';
import * as controls from '../company/financials/data/controls';
import { addFields, removeFields, removeFieldsCondensed } from './data';

export default defineComponent({
  name: 'HeaderView',
  components: {
    Card,
    Button,
    Tooltip,
    Checkbox,
    Input,
    Dropdown,
    ListNameModal,
    DuplicateListModal,
    ListUpdateWarningModal,
    CollapseComponent,
  },
  props: {
    list: {
      type: Object as PropType<List>,
      required: false,
    },
  },
  emits: ['update', 'removeSymbols'],
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const selectedView = ref(localStorage.getItem('list-view') || controls.viewControl.EXTENDED);
    const filteredRemoveFields = ref(removeFields);
    const updatedAddFields = ref(addFields);
    const companies: CompanyListSimple[] = reactive([]);
    const existCompanies: CompanyListSimple[] = reactive([]);
    const sharing = ref(false);
    const companySearch = ref('');
    const removeFieldSearch = ref('');
    const removeSymbolSearch = ref('');
    const addedFields = ref<CheckBoxField[]>([]);
    const removedFields = ref<CheckBoxField[]>([]);
    const showFieldSettingPannel = ref(false);
    const highLight = ref(localStorage.getItem('list_highlight') === 'true' || false);
    const selectedFieldSettingItem = ref<string | undefined>(undefined);
    const selectedRemoveSymbol = ref<boolean>(false);
    const shared = ref<boolean>(props.list ? !!props.list.share : false);
    const copiedToClipboard = ref(false);
    const userAccessToken = computed(() => (store.state as any).user.accessToken);
    const copyLinkToClipboard = () => {
      if (!props.list) return;
      const listId = props.list.id;
      navigator.clipboard.writeText(`https://staging.topfunds.com/list/${listId}`);
    };
    const toggleShare = () => {
      if (!props.list) return;

      const listId = props.list.id;
      sharing.value = true;
      shared.value = !shared.value;
      api.share(listId, !shared.value).then((res: any) => {
        if (res.status === 403) {
          store.commit(SHOW_MODAL, 'duplicate-list');
        }
        if (!res) shared.value = !shared.value;
      });
      if (shared.value) {
        copyLinkToClipboard();
        copiedToClipboard.value = true;
        setTimeout(() => {
          copiedToClipboard.value = false;
        }, 3000);
      }
      sharing.value = false;
    };
    const revertOriginStatus = () => {
      const originRemovedFields = JSON.parse(localStorage.getItem('list_removed_fields') || '["revenue","netIncome","cashFlowFromOperatingActivities","capex","freeCashFlow"]');
      console.log(originRemovedFields);
      updatedAddFields.value.forEach((f: CheckBoxField) => {
        if (originRemovedFields?.includes(f.key)) {
          // eslint-disable-next-line no-param-reassign
          f.value = false;
        } else {
          // eslint-disable-next-line no-param-reassign
          f.value = true;
        }
      });
      filteredRemoveFields.value.forEach((f: CheckBoxField) => {
        if (originRemovedFields?.includes(f.key)) {
          // eslint-disable-next-line no-param-reassign
          f.value = true;
        } else {
          // eslint-disable-next-line no-param-reassign
          f.value = false;
        }
      });
    };
    const handleUpdateFields = () => {
      const fields2Add = updatedAddFields.value
        ?.filter((f: CheckBoxField) => f.value === false).map((f: CheckBoxField) => f.key);

      let fields2Remove = filteredRemoveFields.value
        ?.filter((f: CheckBoxField) => f.value === true).map((f: CheckBoxField) => f.key);

      fields2Remove = [...fields2Add, ...fields2Remove];
      const minRemoveFieldsNum = 5;
      if (fields2Remove.length < minRemoveFieldsNum) {
        revertOriginStatus();
        store.commit(SHOW_MODAL, 'list-update-warning-modal');
      } else {
        localStorage.setItem('list_removed_fields', JSON.stringify(fields2Remove));
        store.commit(LIST_REMOVED_FIELDS, fields2Remove);
      }
      showFieldSettingPannel.value = false;
    };

    // const handleRemoveFields = () => {
    //   const fields2Add = updatedAddFields.value
    //     ?.filter((f: CheckBoxField) => f.value === false).map((f: CheckBoxField) => f.key);
    //   const fields2Remove = filteredRemoveFields.value
    //     ?.filter((f: CheckBoxField) => f.value === true).map((f: CheckBoxField) => f.key);

    //   localStorage.setItem('list_removed_fields', JSON.stringify(fields2Remove));
    //   store.commit(LIST_REMOVED_FIELDS, fields2Remove);
    //   showFieldSettingPannel.value = false;
    //   // window.location.reload();
    // };
    const toggleHighlight = () => {
      highLight.value = !highLight.value;

      localStorage.setItem('list_highlight', JSON.stringify(highLight.value));
      store.commit(LIST_HIGHLIGHT, highLight.value);
    };
    const toggleFieldsSettingItem = (val: string) => {
      if (selectedFieldSettingItem.value === val) {
        selectedFieldSettingItem.value = undefined;
      } else selectedFieldSettingItem.value = val;
    };
    const settingsDropdownValue = ref<DropdownValue>({
      key: '',
      title: '',
    });

    const listsDropdown: DropdownValue[] = reactive([]);
    const listsDropdownValue = ref<DropdownValue>({
      key: '',
      title: '',
    });

    const listsDropdownValues = computed(() => [
      ...listsDropdown,
      {
        key: 'create',
        title: 'Create new list',
      },
    ]);

    watch(listsDropdownValue, async (value) => {
      if (!props.list) {
        return;
      }

      const storedKey = value.key;

      if (Number(storedKey) === props.list.id) {
        return;
      }

      listsDropdownValue.value = {
        key: props.list.id.toString(),
        title: props.list.name,
      };

      if (storedKey === 'create') {
        store.commit(SHOW_MODAL, 'new-list');
        return;
      }

      await router.push({ name: 'list', params: { id: storedKey } });
      window.location.reload();
    });
    watch(() => !!props.list?.share, (newValue: boolean) => {
      shared.value = newValue;
    });
    // watch(settingsDropdownValue, (value) => {
    //   if (value.key === '') {
    //     return;
    //   }

    //   const storedKey = value.key;
    //   settingsDropdownValue.value = {
    //     key: '',
    //     title: '',
    //   };

    //   if (!props.list) {
    //     return;
    //   }

    //   if (storedKey === 'rename') {
    //     store.commit(SHOW_MODAL, 'rename-list');
    //   } else if (storedKey === 'delete') {
    //     const reply = confirm('Are you sure you want to delete this list?');

    //     if (!reply) {
    //       return;
    //     }

    //     api.removeList(props.list.id).then(() => {
    //       window.location.replace('/');
    //     });
    //   } else if (storedKey === 'removeSymbol') {
    //     // console.log(false);
    //     // store.commit(LIST_SHOW_SYMBOL, false);
    //   }
    // });
    const renameList = () => {
      store.commit(SHOW_MODAL, 'rename-list');
    };
    const removeList = () => {
      const reply = confirm('Are you sure you want to delete this list?');  // eslint-disable-line

      if (!reply) {
        return;
      }
      if (!props.list) {
        return;
      }
      api.removeList(props.list?.id).then((res: any) => {
        if (res.status === 403) {
          store.commit(SHOW_MODAL, 'duplicate-list');
        } else window.location.replace('/');
      });
    };
    const updateCompanies = () => {
      if (!props.list) {
        return;
      }

      companyApi.list().then((payload) => {
        companies.splice(0);
        existCompanies.splice(0);
        payload.forEach((item) => {
          const isSubscribed = !!(props.list as List).companies.find(
            (company) => (company.symbol === item.symbol),
          );

          const company: CompanyListSimple = {
            ...item,
            isSubscribed,
          };

          companies.push(company);
          if (isSubscribed) {
            const existCompany: CompanyListSimple = {
              ...item,
              isSubscribed: false,
            };
            existCompanies.push(existCompany);
          }
        });
      });
    };
    const handleRemoveSymbols = async () => {
      if (!props.list) {
        return;
      }
      const companies2Remove: string[] = [];
      existCompanies.forEach((com: CompanyListSimple) => {
        if (com.isSubscribed) companies2Remove.push(com.symbol);
      });
      // existCompanies.forEach(async (company) => {
      //   if (!props.list) {
      //     return;
      //   }
      //   if (company.isSubscribed) {
      //     await api.remove(props.list.id, company.symbol).then((res: any) => {
      //       if (res.status === 403) {
      //         store.commit(SHOW_MODAL, 'duplicate-list');
      //       }
      //     });
      //   }
      // });
      await api.removeCompanies(props.list.id, companies2Remove).then((res: any) => {
        if (res.status === 403) {
          store.commit(SHOW_MODAL, 'duplicate-list');
        } else {
          setTimeout(() => {
            updateCompanies();
            emit('removeSymbols', companies2Remove);
          }, 300);
        }
      });
    };
    const toggleSubscrption = (company: CompanyListSimple) => {
      if (!props.list) {
        return;
      }

      const method = company.isSubscribed ? api.add : api.remove;

      method(props.list.id, company.symbol).then((res: any) => {
        if (res.status === 403) {
          store.commit(SHOW_MODAL, 'duplicate-list');
          // eslint-disable-next-line no-param-reassign
          company.isSubscribed = !company.isSubscribed;
        } else emit('update');
      });
    };

    const initialRemoveFields = () => {
      const initRemovedFields = store.state.application.listRemoveFields;
      const initAddFields = addFields;
      const fields = (selectedView.value === 'extended') ? removeFields : removeFieldsCondensed;
      if (!initRemovedFields || initRemovedFields.length === 0) {
        filteredRemoveFields.value = fields;
        updatedAddFields.value = initAddFields;
        return;
      }
      updatedAddFields.value.forEach((f: any) => {
        if (initRemovedFields.includes(f.key)) {
          // eslint-disable-next-line no-param-reassign
          f.value = false;
        } else {
          // eslint-disable-next-line no-param-reassign
          f.value = true;
        }
      });
      fields.forEach((f: any) => {
        if (initRemovedFields.includes(f.key)) {
          const f1 = f;
          // eslint-disable-next-line no-param-reassign
          f.value = true;
        }
      });
      // updatedAddFields.value = initAddFields;
      filteredRemoveFields.value = fields;
    };
    const changeView = (newView: controls.viewControl) => {
      const fields2Add = updatedAddFields.value
        ?.filter((f: CheckBoxField) => f.value === false).map((f: CheckBoxField) => f.key);

      let fields2Remove = filteredRemoveFields.value
        ?.filter((f: CheckBoxField) => f.value === true).map((f: CheckBoxField) => f.key);

      fields2Remove = [...fields2Add, ...fields2Remove];
      const minRemoveFieldsNum = 5;
      if (fields2Remove.length < minRemoveFieldsNum) {
        revertOriginStatus();
        store.commit(SHOW_MODAL, 'list-update-warning-modal');
      } else {
        localStorage.setItem('list-view', newView);
        selectedView.value = newView;
        store.commit(LIST_VIEW_TYPE, newView.toLowerCase());
        initialRemoveFields();
      }
      // window.location.reload();
    };
    watch(removeFieldSearch, () => {
      const fields = (selectedView.value === 'extended') ? removeFields : removeFieldsCondensed;
      if (!removeFieldSearch.value) {
        filteredRemoveFields.value = fields;
        return;
      }
      filteredRemoveFields.value = [];
      const searchString = removeFieldSearch.value.toLowerCase();
      const toReturn = fields.filter((item) => {
        const name = item.name.toLowerCase();
        if (name.includes(searchString)) {
          return true;
        }
        return false;
      });
      filteredRemoveFields.value = toReturn;
    });
    const filteredExistCompanies = computed(() => {
      if (!removeSymbolSearch.value) {
        return existCompanies;
      }
      const searchString = removeSymbolSearch.value.toLowerCase();
      const toReturn = existCompanies.filter((item) => {
        const name = item.name.toLowerCase();
        const symbol = item.symbol.toLowerCase();

        if (name.startsWith(searchString)) {
          return true;
        }

        if (symbol.startsWith(searchString)) {
          return true;
        }
        return false;
      });
      return toReturn;
    });

    const filteredCompanies = computed(() => {
      if (!companySearch.value) {
        return companies;
      }

      const searchString = companySearch.value.toLocaleLowerCase();

      const toReturn = companies.filter((item) => {
        const name = item.name.toLowerCase();
        const symbol = item.symbol.toLowerCase();

        if (name.startsWith(searchString)) {
          return true;
        }

        if (symbol.startsWith(searchString)) {
          return true;
        }

        // const nameAlgorithm = new Levenshtein(companySearch.value, item.name);
        if (item.name.includes(companySearch.value)) {
          return true;
        }
        // if (nameAlgorithm.distance <= 5) {
        //   return true;
        // }

        // const symbolAlgorithm = new Levenshtein(companySearch.value, item.symbol);

        // if (symbolAlgorithm.distance <= 2) {
        //   return true;
        // }

        return false;
      });

      return toReturn;
    });
    const toggleAddedField = (field: CheckBoxField) => {
      const exist = updatedAddFields.value.find((f: CheckBoxField) => f.key === field.key);
      if (!exist) updatedAddFields.value.push(field);
      else {
        addedFields.value.forEach((f: CheckBoxField, index: number) => {
          if (f.key === field.key) {
            addedFields.value.splice(index, 1);
          }
        });
      }
    };
    const toggleRemoveField = (field: CheckBoxField) => {
      const exist = filteredRemoveFields.value?.find((f: CheckBoxField) => f.key === field.key);
      if (!exist) filteredRemoveFields.value.push(field);
      else {
        removedFields.value.forEach((f: CheckBoxField, index: number) => {
          if (f.key === field.key) {
            removedFields.value.splice(index, 1);
          }
        });
      }
    };
    watch(() => props.list, () => {
      if (props.list !== undefined) {
        listsDropdownValue.value = {
          key: props.list.id.toString(),
          title: props.list.name,
        };
      }

      updateCompanies();
    });

    onMounted(() => {
      if (userAccessToken.value) {
        api.lists().then((payload) => {
          listsDropdown.splice(0);
          payload.forEach((item) => {
            listsDropdown.push({
              key: item.id.toString(),
              title: item.name,
            });
          });
        }).catch((e: any) => {
          console.log('**** there is no errors *******');
        });
      }
      updateCompanies();
      initialRemoveFields();
    });

    return {
      companies,
      shared,
      companySearch,
      filteredCompanies,
      filteredExistCompanies,
      settingsDropdown,
      settingsDropdownValue,
      listsDropdownValues,
      listsDropdownValue,
      selectedView,
      updatedAddFields,
      addFields,
      removeFields,
      removedFields,
      selectedFieldSettingItem,
      removeFieldSearch,
      filteredRemoveFields,
      showFieldSettingPannel,
      highLight,
      removeSymbolSearch,
      selectedRemoveSymbol,
      sharing,
      renameList,
      removeList,
      toggleShare,
      copiedToClipboard,
      copyLinkToClipboard,
      handleRemoveSymbols,
      toggleHighlight,
      toggleSubscrption,
      toggleAddedField,
      toggleRemoveField,
      handleUpdateFields,
      changeView,
      toggleFieldsSettingItem,
      ...controls,
    };
  },
});
</script>

<style scoped>
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.list-header-side {
  display: flex;
  align-items: center;
  gap: 20px;
}

.list-header-button {
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}

.list-title {
  cursor: pointer;
}

.list-title h2 {
  font-size: 16px;
  font-weight: 800;
  line-height: 110%;
  letter-spacing: 0.32px;
  text-transform: uppercase;
}

.list-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-filter > span {
  color: var(--theme-text-color-2);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.list-filter > button {
  font-size: 12px;
  font-weight: 600;
}

.list-checkbox {
  color: var(--theme-link-color);
}

.list-search {
  position: relative;
}

.list-search > input {
  padding: 8.5px 24px 8.5px 48px;
  border-radius: 100px;
  width: auto;
  font-size: 14px;
  font-weight: 600;
  line-height: 110%;
  letter-spacing: 0.28px;
  text-transform: uppercase;
  color: var(--theme-link-color);
  width: 127px;
}

.list-search > input::placeholder {
  color: var(--theme-link-color);
}

.list-search::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background: no-repeat url('@/assets/icons/search.svg');
  background-size: 100% 100%;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
}

.list-company-search {
  position: relative;
  margin-bottom: 16px;
}

.list-company-search::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 8px;
  width: 16px;
  height: 16px;
  background: no-repeat url('@/assets/icons/search.svg');
  background-size: 100% 100%;
  transform: translateY(-50%);
  cursor: default;
}

.list-company-search > input {
  width: 100%;
  color: var(--theme-link-color);
  padding: 8px 8px 8px 33px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.list-company-search > input::placeholder {
  color: #7283FA;
}

.list-company-values {
  max-height: 329px;
  overflow-y: scroll;
}

.list-company-values::-webkit-scrollbar,
.list-company-values::-webkit-scrollbar-thumb {
  width: 4px;
  border-radius: 16px;
}

.list-company-values::-webkit-scrollbar-button {
  display: none;
}

.list-company-values::-webkit-scrollbar {
  background: rgba(0, 0, 0, .1);
}

.list-company-values::-webkit-scrollbar-thumb {
  background: var(--theme-link-color);
}
.list-company-value {
  display: flex;
  align-items: center;
  text-align: left;
  padding: 7px 0;
  font-size: 12px;
  font-weight: 600;
  gap: 8px;
}

.list-company-value > .checkbox {
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, .4);
  width: 18px;
  height: 18px;
}
</style>

<style>
.list-title > .dropdown-value {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.list-header-side .list-header-side-fields-setting {
  position: relative;
}
.list-header-field-setting {
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}
.field-setting-list {
  position: absolute;
  top: calc(100% + 15px);
  right: -10%;
  transform: translateX(-20%);
  width: 176px;
  display: flex;
  background: var(--theme-text-color-contrast);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0px 8px 18px 0px rgba(0, 0, 0, 0.06);
  z-index: 2;
}
.fields-setting-menu {
  position: absolute;
  top: 100%;
  left: 87%;
  width: 176px;
  background: var(--theme-text-color-contrast);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0px 8px 18px 0px rgba(0, 0, 0, 0.06);
  z-index: 2;
}
.list-add-field-search {
  position: relative;
  margin-top: 4px;
  margin-bottom: 4px;
}

.list-add-field-search::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 8px;
  width: 16px;
  height: 16px;
  background: no-repeat url('@/assets/icons/search.svg');
  background-size: 100% 100%;
  transform: translateY(-50%);
  cursor: default;
}

.list-add-field-search>input {
  width: 100%;
  color: var(--theme-link-color);
  padding: 8px 8px 8px 33px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.list-add-field-search>input::placeholder {
  color: #7283FA;
}
.list-column-fields {
  width: 144px;
  padding: 0 6px;
}

.list-column-field-item {
  width: 128px;
  display: flex;
  align-items: center;
  text-align: left;
  padding: 7px 0;
  font-size: 12px;
  font-weight: 600;
  gap: 8px;
}

.list-column-field-item>.checkbox {
  border-radius: 2px;
  width: 12px !important;
  height: 12px !important;
  border-radius: 1px;
  border: 1.4px solid #9AA6FA !important;
  width: 18px;
  height: 18px;
}
.dropdown-menu>.dropdown-menu-button {
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
.dropdown-menu>.dropdown-menu-button__active {
  background: #F4F6FF;
}
</style>
