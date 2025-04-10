<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="note-edit" style="display: flex; width: 100%; flex-direction: column; gap: 12px;">
    <div class="note-title">
      <div class="note-actions">
        <button class="action-btn expand-icon" @click="toggleExpandNewNote"
        v-if="showExpandNewNote">
          <img src="@/assets/icons/expand.svg" class="" alt="expand" v-if="!expandNewNote">
          <img src="@/assets/icons/expand-collapse.svg" class="" alt="expand" v-else>
        </button>
        <button class="action-btn open-in-new-icon" @click="showNoteModal">
          <img src="@/assets/icons/open-in-new.svg" class="" alt="edit">
        </button>
      </div>
      <Input
        type="text"
        style="width: 100%;"
        placeholder="TITLE (OPTIONAL)"
        v-model:value="note.title"/>
    </div>
    <div class="note-description">
      <Textarea
        :focus="true"
        placeholder="Description"
        v-model:value="note.description"
        :style="{width: '100%'}"
      />
    </div>
    <!-- <AddNewNoteModal :note="note" :company="company" /> -->
    <div class="modal modal__note" ref="modal" v-if="showModal">
      <div class="modal-inner">
        <button class="modal-exit" @click="showModal=false">
          <img src="@/assets/icons/cross.svg" alt="Cross">
        </button>
        <div class="header">
          <div class="note-date" style="height: 24px;">
            <p class="date">
              Fri, March 17, 2024
            </p>
          </div>
          <div class="add-title">
            <div>
              <button class="plus-item" @click="expandTitle=!expandTitle">
                <img
                  style="border-radius: 50%; border: 1px solid #3348FB; padding: 3px;"
                  src="@/assets/icons/plus.svg" alt="Cross" v-if="!expandTitle"/>
                <img
                  style="border-radius: 50%; border: 1px solid #3348FB; padding: 3px;"
                  src="@/assets/icons/cross.svg" alt="Cross" v-else/>
                <p>
                  Add title
                </p>
              </button>
            </div>
            <Input
            v-if="expandTitle"
            v-model:value="tmpNote.title"
            :placeholder="'Title (Optional)'"
            :style="{
              'padding': '9px 16px',
              'color': '#131313',
              'font-weight': '800',
              'text-transform': 'uppercase',
              'font-size': '14px',
            }"/>
          </div>
          <div class="description">
            <Textarea
              :focus="true"
              v-model:value="tmpNote.description"
              placeholder="Enter description"
            />
          </div>
        </div>
        <div class="price-settings" style="width: 100%;">
          <div>
            <button class="plus-item" @click="expandPriceSettings=!expandPriceSettings">
              <img
                style="border-radius: 50%; border: 1px solid #3348FB; padding: 3px;"
                src="@/assets/icons/plus.svg" alt="Cross" v-if="!expandPriceSettings"/>
              <img
                style="border-radius: 50%; border: 1px solid #3348FB; padding: 3px;"
                src="@/assets/icons/cross.svg" alt="Cross" v-else/>
              <p>
                Price settings
              </p>
            </button>
          </div>
          <div class="price-setting-items" v-if="expandPriceSettings">
            <div style="width: 33%;">
              <FormInput :label="`${company.data.symbol} price as of note`"
              :currency="tmpNote.currency"
              v-model:value="tmpNote.notePrice"/>
            </div>
            <div style="width: 33%;">
              <FormInput :label="'Your Fair Value Estimate'"
              :currency="tmpNote.currency"
              v-model:value="tmpNote.fairValueEstimate"/>
            </div>
            <div style="width: 33%;">
              <FormInput :label="'Buy Below Price'"
              :currency="tmpNote.currency"
              v-model:value="tmpNote.belowPrice"/>
            </div>
          </div>
        </div>
        <div class="add-tags">
          <div>
            <button class="plus-item" @click="expandTags=!expandTags">
              <img
                style="border-radius: 50%; border: 1px solid #3348FB; padding: 3px;"
                src="@/assets/icons/plus.svg" alt="Cross" v-if="!expandTags"/>
              <img
                style="border-radius: 50%; border: 1px solid #3348FB; padding: 3px;"
                src="@/assets/icons/cross.svg" alt="Cross" v-else/>
              <p>
                Add tags
              </p>
            </button>
          </div>
          <div class="badge-items">
            <Badge
            v-for="(tag, index) in tmpNote.symbols"
            v-on:close="closeBadge(tag)"
            :label="tag"
            :key="index"
            :close="true"/>
          </div>
          <input
            v-model="searchKey"
            v-on:keydown.enter="addTags"
            style="
            background: #F4F6FF;
            padding: 9px 16px;
            border-radius: 8px;
            border: none;
            outline: none;
            font-size: 16px;
            font-weight: 400;
            color: #131313;
            " v-if="expandTags" />
            <div
            class="header-search-results"
            style="display: flex; gap: 4px;"
            v-if="searchResults">
              <!-- <button
                @click="clickHandler(result?.symbol)"
                v-for="(result, index) in searchResults.slice(0, 5)"
                class="autocomplete-result"
                :key="index">
                <div>
                  <span class="search-key">{{ splitWords(result.symbol, searchKey)[1] }}</span>
                </div>
                <div class="search-result-description">
                  <span class="">{{ result.name }}</span>
                </div>
              </button> -->
              <Badge
              :type="'secondary'"
              v-for="(result, index) in searchResults.slice(0, 5)"
              :label="result.symbol"
              @click="clickHandler(result?.symbol)"
              :key="index" />
            </div>
        </div>
        <Button
          :loading="loading"
          @click="onClickSave"
        >Add Note</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';
import * as api from '@/rest-api/companies';
import { CompanySimple, NoteData } from '@/rest-api/companies/assets';
import Textarea from '@/components/ui/TextareaComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Badge from '@/components/ui/Badge.vue';
import FormInput from '@/components/ui/FormInputComponent.vue';
import AddNewNoteModal from '@/components/modals/AddNewNoteModal.vue';
import { CompanyController } from '@/controllers/company/types';
import { SHOW_MODAL } from '@/store/actions/application';
import { splitWords } from './utils';

export default defineComponent({
  name: 'NoteEditComponent',
  components: {
    Input,
    Textarea,
    Button,
    Badge,
    FormInput,
  },
  props: {
    note: {
      type: Object as PropType<NoteData>,
      required: true,
    },
    company: {
      type: Object as PropType<CompanyController>,
      required: true,
    },
    showExpandNewNote: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['update:value', 'expand'],
  setup(props, { emit }) {
    const store = useStore();
    const modal = ref();
    const title = ref('');
    const expandTitle = ref(false);
    const expandPriceSettings = ref(false);
    const expandTags = ref(true);
    const expandNewNote = ref(false);
    const searchResults = reactive<CompanySimple[]>([]);
    const searchKey = ref();
    const showModal = ref(false);
    const expandSettings = ref('');
    const loading = ref(false);
    const tmpNote = reactive({
      ...props.note,
      symbols: [props.company.data.symbol],
      currency: props.company.data.currency,
    });
    const updateSearchResults = (): Promise<CompanySimple[]> => new Promise((resolve, reject) => {
      if (!searchKey.value) {
        searchResults.length = 0;
        return;
      }
      api.search(searchKey.value).then((payload) => {
        resolve(payload);
      }).catch((err) => {
        reject(err);
      });
    });
    const addTags = (e: KeyboardEvent) => {
      if (!searchKey.value) {
        return;
      }
      tmpNote.symbols.push(searchKey.value.toUpperCase());
      searchKey.value = '';
    };
    const clickHandler = async (symbol: string) => {
      tmpNote.symbols.push(symbol);
    };
    const closeBadge = (tag: string) => {
      console.log(tag);
      const symbols = [...tmpNote.symbols];
      const filteredSymbols = symbols.filter((symbol: string) => symbol !== tag);
      Object.assign(tmpNote, {
        ...tmpNote,
        symbols: filteredSymbols,
      });
      console.log(tmpNote);
    };
    const showNoteModal = () => {
      expandTitle.value = false;
      expandPriceSettings.value = false;
      expandTags.value = false;
      expandSettings.value = '';
      showModal.value = true;
      searchKey.value = '';
      Object.assign(tmpNote, {
        ...props.note,
        symbols: [props.company.data.symbol],
        currency: props.company.data.currency,
      });
    };
    const parse = (val: any) => {
      if (typeof val === 'string') {
        return parseFloat(val);
      }
      if (typeof val === 'number') {
        return val;
      }
      return undefined;
    };
    const toggleExpandNewNote = (e: MouseEvent) => {
      e.preventDefault();
      expandNewNote.value = !expandNewNote.value;
      emit('expand');
    };
    const saveTitle = (_e: Event) => {
      // Save comment logic goes here
      emit('update:value', props.note);
    };
    const onClickSave = (e: MouseEvent) => {
      e.preventDefault();
      loading.value = true;
      if (tmpNote.description && tmpNote.description !== '' && tmpNote.symbols.length > 0) {
        Object.assign(props.note, {
          ...tmpNote,
          notePrice: parse(tmpNote.notePrice),
          fairValueEstimate: parse(tmpNote.fairValueEstimate),
          belowPrice: parse(tmpNote.belowPrice),
        });
        console.log('*********** here is add note ***************');
        console.log(props.note);
        props.company.addNote(props.note);
        store.commit(SHOW_MODAL, 'added-note-modal');
      }
      loading.value = false;
      showModal.value = false;
    };
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
    const toggleExpand = (type: string) => {
      if (expandSettings.value === type) {
        expandSettings.value = '';
      } else {
        expandSettings.value = type;
      }
    };
    watch(showModal, () => {
      if (showModal.value) {
        window.addEventListener('scroll', updatePosition);

        nextTick(() => {
          updatePosition();
        });
      }
    });
    onMounted(() => {
      expandTitle.value = false;
      expandPriceSettings.value = false;
      expandTags.value = false;
      expandSettings.value = '';
      searchKey.value = '';
      Object.assign(tmpNote, {
        ...props.note,
        symbols: [props.company.data.symbol],
        currency: props.company.data.currency,
      });
    });
    return {
      title,
      showModal,
      expandSettings,
      searchKey,
      loading,
      tmpNote,
      modal,
      searchResults,
      expandNewNote,
      expandTitle,
      expandPriceSettings,
      expandTags,
      onClickSave,
      toggleExpandNewNote,
      showNoteModal,
      closeBadge,
      clickHandler,
      splitWords,
      updateSearchResults,
      addTags,
      toggleExpand,
    };
  },
});
</script>

<style scoped>
.notes .notes-section .note-edit {
  display: flex;
  width: 100%;
}
.notes .notes-section .note-edit .modal__note{
  position: fixed;
  width: 100%;
}
.notes .notes-section .note-description {
  background: #F4F6FF;
  padding: 16px;
  border-radius: 8px;
}
.notes .notes-section .note-title {
  position: relative;
  width: 100%;
  text-transform: uppercase;
  font-size: 14px;
}

.notes .notes-section .note-title > input {
  font-weight: 800;
  text-transform: uppercase;
  font-size: 14px;
  color: var(--theme-text-color-2);
}

.notes .notes-section .note-title > input::placeholder {
  color: var(--theme-text-color-2);
}

.notes .notes-section .note-title .note-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: none;
  border: none;
  outline: none;
  display: flex;
  gap: 8px;
}

.notes .notes-section .note-title .note-actions .action-btn {
  background: none;
  border: none;
  outline: none;
}

.notes .notes-section textarea {
  background: none;
  outline: none;
  border: none;
  color: var(--theme-text-color-2);
  display: block;
  height: auto;
  width: 100%;
  font-size: 16px;
  resize: none;
  line-height: 110%;
}

.notes .notes-section textarea::placeholder {
  color: var(--theme-text-color-2);
}
.notes .notes-section .note-edit .modal.modal__note .modal-inner {
  max-width: 949px;
  width: 100%;
  align-items: start;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
  text-align: start;
}
.notes .notes-section .note-edit .modal.modal__note .header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.notes .notes-section .note-edit .modal.modal__note .header .add-title {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.notes .notes-section .note-edit .modal.modal__note .plus-item {
  display: flex;
  gap: 8px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  align-items: center;
}
.notes .notes-section .note-edit .modal.modal__note .plus-item img{
  border-radius: 50%;
  border: 1px solid #3348FB;
  padding: 2px;
  width: 20px;
  height: 20px;
}
.notes .notes-section .note-edit .modal.modal__note .plus-item p {
  font-weight: 600;
  color: #3348FB;
  letter-spacing: 2%;
  text-transform: uppercase;
}
.notes .notes-section .note-edit .modal.modal__note .note-date .date {
  height: 21px;
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 2%;
  color: #808080;
}
.notes .notes-section .note-edit .modal.modal__note input {
  width: 100%;
}
.notes .notes-section .note-edit .modal.modal__note .description {
  background: #F4F6FF;
  padding: 9px 16px;
  border-radius: 8px;
}
.notes .notes-section .note-edit .modal.modal__note textarea {
  background: none;
  outline: none;
  border: none;
  font-size: 16px;
  color: #131313;
  display: block;
  height: auto;
  width: 100%;
  resize: none;
}

.notes .notes-section .note-edit .modal.modal__note textarea::placeholder {
  color: #131313;
}
.notes .notes-section .note-edit .modal.modal__note .price-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.notes .notes-section .note-edit .modal.modal__note .price-setting-items {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.notes .notes-section .note-edit .modal.modal__note .add-tags {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
}
.notes .notes-section .note-edit .modal.modal__note .add-tags .badge-items {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

</style>
