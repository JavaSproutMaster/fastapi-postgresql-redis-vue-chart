<template>
  <div class="new-note"
  :class="`${fontType}_note`">
    <div class="add-new-note" v-if="!addMode">
      <input @click="addMode = true"
      placeholder="Add new note"
      class="add_new_note_input"/>
      <Button
        :class="'btn'"
        :disabled="true"
      >ADD NEW NOTE</Button>
    </div>
    <Card v-if="addMode">
      <div class="note-inner">
        <div class="header">
          <div class="note-date" style="height: 24px;">
            <p class="date">
              {{ formattedDateWithDay(new Date().toDateString()) }}
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
            :size="fontType === 'large' ? 'default' : 'medium'"
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
            font-weight: 400;
            color: #131313;
            " v-if="expandTags" />
        </div>
        <Button
          :class="'btn'"
          :loading="loading"
          @click="onClickAddNote"
        >Add Note</Button>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  onMounted,
  ref,
  reactive,
} from 'vue';
import Badge from '@/components/ui/Badge.vue';
import FormInput from '@/components/ui/FormInputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Textarea from '@/components/ui/TextareaComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import Card from '@/components/ui/CardComponent.vue';
import { NoteData, emptyNote } from '@/rest-api/companies/assets';
import { CompanyController } from '@/controllers/company/types';
import moment from 'moment';
import {
  formattedDateWithDay,
  formattedDate,
  parse,
  settingsFonts,
} from '@/views/company/note/utils';

export default defineComponent({
  name: 'AddNewNoteComponent',
  components: {
    Button,
    Badge,
    FormInput,
    Card,
    Textarea,
    Input,
  },
  props: {
    fontType: {
      type: String,
      required: true,
      default: settingsFonts[0].name,
    },
    company: {
      type: Object as PropType<CompanyController>,
      required: true,
    },
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const expand = ref(false);
    const loading = ref(false);
    const addMode = ref(false);
    const expandTitle = ref(false);
    const expandPriceSettings = ref(false);
    const expandTags = ref(true);
    const searchKey = ref();
    const tmpNote = reactive({
      ...emptyNote,
    });
    const onClickAddNote = (e: MouseEvent) => {
      e.preventDefault();

      if (tmpNote.description
      && tmpNote.description !== '') {
        loading.value = true;
        props.company.addNote(tmpNote).then((payload: NoteData) => {
          emit('refresh');
        });
        loading.value = false;
      }
      Object.assign(tmpNote, {
        id: undefined,
        title: '',
        description: '',
        notePrice: undefined,
        fairValueEstimate: undefined,
        belowPrice: undefined,
        symbols: [],
        currency: props.company.data.currency,
      });
      addMode.value = false;
    };
    const addTags = (e: KeyboardEvent) => {
      if (!searchKey.value) {
        return;
      }
      tmpNote.symbols.push(searchKey.value.toUpperCase());
      searchKey.value = '';
    };
    const closeBadge = (tag: string) => {
      const symbols = [...tmpNote.symbols];
      const filteredSymbols = symbols.filter((symbol: string) => symbol !== tag);
      Object.assign(tmpNote, {
        ...tmpNote,
        symbols: filteredSymbols,
      });
    };
    onMounted(() => {
      console.log(props.company.data.symbol);
      expandTitle.value = false;
      expandPriceSettings.value = false;
      expandTags.value = false;
      searchKey.value = '';
      Object.assign(tmpNote, {
        id: undefined,
        title: '',
        description: '',
        notePrice: undefined,
        fairValueEstimate: undefined,
        belowPrice: undefined,
        symbols: [],
        currency: props.company.data.currency,
      });
    });
    return {
      addMode,
      expand,
      loading,
      tmpNote,
      expandTitle,
      expandPriceSettings,
      expandTags,
      searchKey,
      formattedDateWithDay,
      closeBadge,
      addTags,
      onClickAddNote,
    };
  },
});
</script>

<style>
.notes-content .new-note .add-new-note {
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;
  /* padding: 16px; */
  /* background: #F4F6FF; */
}
.notes-content .new-note .add-new-note .add_new_note_input {
  width: 750px;
  padding: 9px 16px;
  border-radius: 8px;
  border: none;
  outline: none;
  cursor: pointer;
}
.notes-content .new-note .card .note-inner {
  width: 100%;
  align-items: start;
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: start;
}
.notes-content .new-note .card .note-inner .header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.notes-content .new-note .card .note-inner .header .add-title {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.notes-content .new-note .card .note-inner .plus-item {
  display: flex;
  gap: 8px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  align-items: center;
}
.notes-content .new-note .card .note-inner .plus-item img{
  border-radius: 50%;
  border: 1px solid #3348FB;
  padding: 2px;
  width: 20px;
  height: 20px;
}
.notes-content .new-note .card .note-inner .plus-item p {
  font-weight: 600;
  color: #3348FB;
  letter-spacing: 2%;
  text-transform: uppercase;
}
.notes-content .new-note .card .note-inner .note-date .date {
  height: 21px;
  font-weight: 600;
  /* font-size: 14px; */
  line-height: 150%;
  letter-spacing: 2%;
  color: #808080;
}
.notes-content .new-note .card .note-inner input {
  width: 100%;
}
.notes-content .new-note .card .note-inner .description {
  background: #F4F6FF;
  padding: 9px 16px;
  border-radius: 8px;
}
.notes-content .new-note .card .note-inner textarea {
  background: none;
  outline: none;
  border: none;
  /* font-size: 16px; */
  color: #131313;
  display: block;
  height: auto;
  width: 100%;
  resize: none;
}

.notes-content .new-note .card .note-inner textarea::placeholder {
  color: #131313;
}
.notes-content .new-note .card .note-inner .price-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.notes-content .new-note .card .note-inner .price-setting-items {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.notes-content .new-note .card .note-inner .add-tags {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
}
.notes-content .new-note .card .note-inner .add-tags .badge-items {
  display: flex;
  flex-direction: row;
  gap: 4px;
}
.notes-content .new-note.large_note {
  font-size: 18px;
}
.notes-content .new-note.medium_note {
  font-size: 16px;
}
.notes-content .new-note.small_note {
  font-size: 14px;
}
.notes-content .new-note.large_note p {
  font-size: 16px;
}
.notes-content .new-note.medium_note p {
  font-size: 14px;
}
.notes-content .new-note.small_note p {
  font-size: 12px;
}

.notes-content .new-note.large_note .btn {
  font-size: 18px;
}
.notes-content .new-note.medium_note .btn {
  font-size: 16px;
}
.notes-content .new-note.small_note .btn {
  font-size: 14px;
}
.notes-content .new-note .add-new-note .btn {
  font-size: 14px;
}
.notes-content .new-note.large_note .note-header {
  font-size: 16px;
}
.notes-content .new-note.medium_note .note-header {
  font-size: 14px;
}
.notes-content .new-note.small_note .note-header {
  font-size: 12px;
}
.notes-content .new-note.large_note .note-inner textarea {
  font-size: 18px;
}
.notes-content .new-note.large_note input {
  font-size: 18px;
}
.notes-content .new-note.medium_note .note-inner textarea {
  font-size: 16px;
}
.notes-content .new-note.medium_note input {
  font-size: 16px;
}
.notes-content .new-note.small_note input {
  font-size: 14px;
}
</style>
