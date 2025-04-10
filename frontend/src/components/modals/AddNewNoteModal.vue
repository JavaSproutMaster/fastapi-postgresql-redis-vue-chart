<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="modal modal__note" ref="modal">
    <div class="modal-inner">
      <button class="modal-exit" @click="hideModal">
        <img src="@/assets/icons/cross.svg" alt="Cross">
      </button>
      <div class="header">
        <div class="note-date" style="height: 24px;">
          <p class="date">
            {{ formattedDateWithDay(tmpNote.createdAt) }}
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
      </div>
      <Button
        :loading="loading"
        @click="onClickSave"
      >Add Note</Button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  nextTick,
  PropType,
  onMounted,
  computed,
  reactive,
  defineComponent,
  ref,
} from 'vue';
import Textarea from '@/components/ui/TextareaComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import FormInput from '@/components/ui/FormInputComponent.vue';
import * as api from '@/rest-api/lists';
import store from '@/store';
import { HIDE_MODAL, SHOW_MODAL } from '@/store/actions/application';
import { useStore } from 'vuex';
import { NoteData } from '@/rest-api/companies/assets';
import { CompanyController } from '@/controllers/company/types';
import {
  formattedDateWithDay,
  formattedDate,
  parse,
  settingsFonts,
} from '@/views/company/note/utils';

export default defineComponent({
  name: 'AddNewNoteModal',
  components: {
    Input,
    Button,
    Textarea,
    FormInput,
    Badge,
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
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    mode: {
      type: String,
      required: false,
    },
  },
  emits: ['hideModal', 'submitted'],
  setup(props, { emit }) {
    const store = useStore();
    const searchKey = ref('');
    const listName = ref('');
    const loading = ref(false);
    const expandTitle = ref(false);
    const expandPriceSettings = ref(false);
    const expandTags = ref(true);
    const tmpNote = reactive({
      ...props.note,
      symbols: [props.company.data.symbol],
      currency: props.company.data.currency,
    });
    const expandSettings = ref(true);
    const onClickSave = () => {
      if (props.note.id && tmpNote.description
      && tmpNote.description !== '' && tmpNote.symbols.length > 0) {
        Object.assign(props.note, {
          ...tmpNote,
          notePrice: parse(tmpNote.notePrice),
          fairValueEstimate: parse(tmpNote.fairValueEstimate),
          belowPrice: parse(tmpNote.belowPrice),
        });
        if (props.mode === 'edit') {
          props.company.saveNote(props.note.id, props.note).finally(() => {
            emit('submitted');
          });
        } else if (props.mode === 'update') {
          props.company.updateNote(props.note.id, props.note).finally(() => {
            emit('submitted');
          });
        }
      }
    };
    const modal = ref();
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

    onMounted(() => {
      if (props.note.title) {
        expandTitle.value = true;
      }
      if (props.note.belowPrice || props.note.notePrice || props.note.fairValueEstimate) {
        expandPriceSettings.value = true;
      }
      window.addEventListener('scroll', updatePosition);

      nextTick(() => {
        updatePosition();
      });
    });

    const hideModal = () => {
      window.removeEventListener('scroll', updatePosition);
      emit('hideModal');
    };

    return {
      modal,
      tmpNote,
      hideModal,
      expandTitle,
      expandPriceSettings,
      expandTags,
      expandSettings,
      loading,
      listName,
      searchKey,
      addTags,
      closeBadge,
      onClickSave,
      formattedDateWithDay,
    };
  },
});
</script>

<style>
.note-card .modal.modal__note {
  position: fixed;
}
.note-card .modal.modal__note .modal-inner {
  max-width: 949px;
  width: 100%;
  align-items: start;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
  text-align: start;
}
.note-card .modal.modal__note .header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.note-card .modal.modal__note .header .add-title {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.note-card .modal.modal__note .plus-item {
  display: flex;
  gap: 8px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  align-items: center;
}
.note-card .modal.modal__note .plus-item img{
  border-radius: 50%;
  border: 1px solid #3348FB;
  padding: 2px;
  width: 20px;
  height: 20px;
}
.note-card .modal.modal__note .plus-item p {
  font-weight: 600;
  color: #3348FB;
  letter-spacing: 2%;
  text-transform: uppercase;
}
.note-card .modal.modal__note .note-date .date {
  height: 21px;
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 2%;
  color: #808080;
}
.note-card .modal.modal__note input {
  width: 100%;
}
.note-card .modal.modal__note .description {
  background: #F4F6FF;
  padding: 9px 16px;
  border-radius: 8px;
}
.note-card .modal.modal__note textarea {
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

.note-card .modal.modal__note textarea::placeholder {
  color: #131313;
}
.note-card .modal.modal__note .price-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.note-card .modal.modal__note .price-setting-items {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.note-card .modal.modal__note .add-tags {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
}
.note-card .modal.modal__note .add-tags .badge-items {
  display: flex;
  flex-direction: row;
  gap: 4px;
}
</style>
