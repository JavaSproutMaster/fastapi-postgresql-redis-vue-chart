<template>
  <Card>
    <div class="note"
    :class="`${fontType}_note`">
      <div
      style="
      display: flex;
      flex-direction: column;
      gap: 16px;"
      v-if="mode==='normal'">
        <div class="note-actions">
          <button
          @click="changeMode('edit')"
          class="action-btn">
            <img src="@/assets/icons/edit.svg" alt="Edit">
          </button>
          <button
          @click="changeMode('update')"
          class="action-btn">
            <img src="@/assets/icons/refresh.svg" alt="refresh">
          </button>
          <button
          @click="removeNote"
          class="action-btn">
            <img src="@/assets/icons/remove.svg" alt="Remove">
          </button>
        </div>
        <div class="current-note">
          <div class="note-tags">
            <Badge
            v-for="(tag, index) in note.symbols"
            :key="index"
            :size="fontType === 'large' ? 'medium' : 'small'" :type="'secondary'" :label="tag"/>
          </div>
          <div class="note-header">
            <div class="title">{{ note.title }}</div>
            <div class="note-timestamp">
              <div>
                {{ formattedDateWithDay(note.createdAt) }}
              </div>
              <div
              style="display: flex; align-items: center; flex-direction: row; gap: 8px;"
              v-if="note.updated">
                <div
                style="
                width: 4px;
                height: 4px;
                background-color: #808080;
                border-radius: 50%;">
              </div>
                Updated
                <div>
                  {{ updatedAt }}
                </div>
              </div>
            </div>
          </div>
          <div class="note-text"
          :style="{'line-clamp': expand ? 'none' : 4}"
          >
            {{ note?.description }}
          </div>
          <div>
            <button class="show-more btn" @click="expand=!expand">
              {{ expand ? 'Show less' : 'Show more'}}
            </button>
          </div>
        </div>
        <div class="price-settings"
        v-if="(additionalTypes.includes(0) && note.notePrice)
        || (additionalTypes.includes(2) && note.fairValueEstimate)
        || (additionalTypes.includes(3) && note.belowPrice)">
          <Badge :type="'white'"
          :size="fontType === 'large' ? 'default' : 'medium'"
          :label="`${company.data.symbol} Price as of Note: ${note.notePrice} ${note.currency}`"
          v-if="additionalTypes.includes(0) && note.notePrice"/>
          <Badge
          :type="'white'"
          :size="fontType === 'large' ? 'default' : 'medium'"
          :label="`your fair value estimate: ${note.fairValueEstimate} ${note.currency}`"
          v-if="additionalTypes.includes(2) && note.fairValueEstimate"/>
          <Badge
          :size="fontType === 'large' ? 'default' : 'medium'"
          :type="'white'" :label="`buy below price: ${note.belowPrice} ${note.currency}`"
          v-if="additionalTypes.includes(3) && note.belowPrice"/>
        </div>
      </div>
      <div class="note-inner" v-if="mode==='edit'">
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
          @click="onClickSave"
        >Add Note</Button>
      </div>
      <div class="note-inner" v-if="mode==='update'">
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
        <Button
          :loading="loading"
          @click="onClickAddUpdate"
        >Add Note</Button>
      </div>
      <div class="note-updated"
      v-for="(history, index) in note.histories"
      :key="index"
      >
        <div class="note-header">
          <div class="note-timestamp" v-if="history.updatedAt">
            <div>
              Updated {{ formattedDateWithDay(history.updatedAt) }}
            </div>
          </div>
        </div>
        <div class="note-text">
          {{ history.description }}
        </div>
      </div>
    </div>
  </Card>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  reactive,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';

import Card from '@/components/ui/CardComponent.vue';
import Textarea from '@/components/ui/TextareaComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import FormInput from '@/components/ui/FormInputComponent.vue';
import Badge from '@/components/ui/Badge.vue';
import { NoteData, emptyNote } from '@/rest-api/companies/assets';
import { CompanyController } from '@/controllers/company/types';
import moment from 'moment';
import {
  formattedDateWithDay,
  formattedDate,
  parse,
  settingsFonts,
} from './utils';

export default defineComponent({
  name: 'NoteComponent',
  components: {
    Card,
    Input,
    Badge,
    Button,
    FormInput,
    Textarea,
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
    fontType: {
      type: String,
      required: true,
      default: settingsFonts[0].label,
    },
    additionalTypes: {
      type: Object as PropType<number[]>,
      required: true,
    },
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const store = useStore();
    const mode = ref('normal');
    const expand = ref(false);
    const expandTitle = ref(false);
    const expandPriceSettings = ref(false);
    const expandTags = ref(true);
    const searchKey = ref();
    const tmpNote = reactive({
      ...props.note,
      title: props.note.title,
      description: props.note.description,
      notePrice: props.note.notePrice,
      fairValueEstimate: props.note.fairValueEstimate,
      belowPrice: props.note.belowPrice,
      symbols: props.note.symbols,
      currency: props.company.data.currency,
    });
    const changeMode = (newMode: string) => {
      if (newMode === 'update') {
        Object.assign(tmpNote, {
          id: props.note.id,
          ...emptyNote,
        });
      } else {
        Object.assign(tmpNote, {
          ...props.note,
          createdAt: props.note.createdAt,
          updated: props.note.updated,
          updatedAt: props.note.updatedAt,
          title: props.note.title,
          description: props.note.description,
          notePrice: props.note.notePrice,
          fairValueEstimate: props.note.fairValueEstimate,
          belowPrice: props.note.belowPrice,
          symbols: props.note.symbols,
          currency: props.company.data.currency,
        });
      }
      mode.value = newMode;
    };
    const updatedAt = computed(() => {
      if (props.note.updated || (props.note.histories && props.note.histories.length > 0)) {
        const date = moment(props.note.updatedAt || '');
        // Format the date
        const formattedDate = date.format('MMM DD, YYYY');
        return formattedDate;
      }
      return null;
    });
    const removeNote = () => {
      if (props.note.id) {
        props.company.deleteNote(props.note.id).then(() => {
          emit('refresh');
        });
      }
    };
    const closeBadge = (tag: string) => {
      console.log(tmpNote);
      console.log(props.note);
      const symbols = [...tmpNote.symbols];
      const filteredSymbols = symbols.filter((symbol: string) => symbol !== tag);
      Object.assign(tmpNote, {
        ...tmpNote,
        symbols: filteredSymbols,
      });
    };
    const loading = ref(false);
    const onClickSave = (e: MouseEvent) => {
      e.preventDefault();
      if (props.note.id
      && tmpNote.description
      && tmpNote.description !== '') {
        loading.value = true;
        Object.assign(props.note, {
          ...props.note,
          createdAt: tmpNote.createdAt,
          updated: tmpNote.updated,
          updatedAt: tmpNote.updatedAt,
          title: tmpNote.title,
          description: tmpNote.description,
          notePrice: parse(tmpNote.notePrice),
          fairValueEstimate: parse(tmpNote.fairValueEstimate),
          belowPrice: parse(tmpNote.belowPrice),
          symbols: tmpNote.symbols,
        });
        console.log('********* here is save note *************', props.note);
        console.log(1, tmpNote);
        props.company.saveNote(props.note.id, props.note).then((payload: NoteData) => {
          emit('refresh');
          console.log(payload);
        });
        loading.value = false;
      }
      mode.value = 'normal';
    };
    const onClickAddUpdate = (e: MouseEvent) => {
      e.preventDefault();
      loading.value = true;
      if (props.note.id
      && tmpNote.description
      && tmpNote.description !== '') {
        Object.assign(props.note, {
          ...props.note,
          createdAt: tmpNote.createdAt,
          updated: tmpNote.updated,
          updatedAt: tmpNote.updatedAt,
          title: tmpNote.title,
          description: tmpNote.description,
          notePrice: parse(tmpNote.notePrice),
          fairValueEstimate: parse(tmpNote.fairValueEstimate),
          belowPrice: parse(tmpNote.belowPrice),
          symbols: tmpNote.symbols,
        });
        props.company.updateNote(props.note.id, props.note).then((payload: NoteData) => {
          emit('refresh');
        });
        loading.value = false;
      }
      mode.value = 'normal';
      loading.value = false;
    };
    const clickHandler = async (symbol: string) => {
      tmpNote.symbols.push(symbol);
    };
    const addTags = (e: KeyboardEvent) => {
      if (!searchKey.value) {
        return;
      }
      tmpNote.symbols.push(searchKey.value.toUpperCase());
      searchKey.value = '';
    };
    onMounted(() => {
      if (props.note.title) {
        expandTitle.value = true;
      }
      if (props.note.belowPrice || props.note.notePrice || props.note.fairValueEstimate) {
        expandPriceSettings.value = true;
      }
    });

    return {
      loading,
      expand,
      updatedAt,
      mode,
      tmpNote,
      expandTitle,
      expandPriceSettings,
      expandTags,
      searchKey,
      formattedDate,
      formattedDateWithDay,
      removeNote,
      closeBadge,
      clickHandler,
      onClickSave,
      addTags,
      changeMode,
      onClickAddUpdate,
    };
  },
});
</script>

<style>
.card {
  padding: 24px !important;
}
.card .note {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  /* padding: 16px; */
  /* background: #F4F6FF; */
}
.card .note.large_note {
  font-size: 18px;
}
.card .note.medium_note {
  font-size: 16px;
}
.card .note.small_note {
  font-size: 14px;
}
.card .note.large_note p {
  font-size: 16px;
}
.card .note.medium_note p {
  font-size: 14px;
}
.card .note.small_note p {
  font-size: 12px;
}

.card .note.large_note .btn {
  font-size: 18px;
}
.card .note.medium_note .btn {
  font-size: 16px;
}
.card .note.small_note .btn {
  font-size: 14px;
}
.card .note .note-actions .action-btn {
  background: none;
  border: none;
}
.card .note .current-note {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  /* padding: 16px; */
  /* background: #F4F6FF; */
}
.card .note .sepearate-line {
  border-bottom: 1px solid #E6E6E6;
}
.card .note .note-updated {
  display: flex;
  border-top: 1px solid #E6E6E6;
  padding-top: 24px;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  /* padding: 16px; */
  /* background: #F4F6FF; */
}
.card .note .price-settings {
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  /* padding: 16px; */
  /* background: #F4F6FF; */
}
.card .note .note-tags{
  display: flex;
  flex-direction: row;
  gap: 4px;
}
.card .note .note-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.card .note .note-header .title{
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 2%;
  line-height: 110%;
}
.card .note.large_note .note-header {
  font-size: 16px;
}
.card .note.medium_note .note-header {
  font-size: 14px;
}
.card .note.small_note .note-header {
  font-size: 12px;
}
.card .note.large_note .note-inner textarea {
  font-size: 18px;
}
.card .note.large_note .note-inner input {
  font-size: 18px;
}
.card .note.medium_note .note-inner textarea {
  font-size: 16px;
}
.card .note.medium_note .note-inner input {
  font-size: 16px;
}
.card .note.small_note .note-inner textarea {
  font-size: 14px;
}
.card .note.small_note .note-inner input {
  font-size: 14px;
}
.card .note .note-header .note-timestamp {
  color: #B3B3B3;
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: 600;
}

.card .note .note-actions {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
}

.card .note .note-actions > * {
  cursor: pointer;
}

.card .note .note-text {
  font-weight: 400;
  color: var(--theme-text-color-2);
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card .note .show-more {
  display: flex;
  font-weight: 600;
  color: var(--theme-link-color);
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
}

.card .note .header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.card .note .header .add-title {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card .note input {
  width: 100%;
}
.card .note .description {
  background: #F4F6FF;
  padding: 9px 16px;
  border-radius: 8px;
}
.card .note textarea {
  background: none;
  outline: none;
  border: none;
  color: #131313;
  display: block;
  height: auto;
  width: 100%;
  resize: none;
  line-height: 110%;
}

.card .note textarea::placeholder {
  color: #131313;
}

.card .note .price-setting-items {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.card .note .add-tags {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
}
.card .note .add-tags .badge-items {
  display: flex;
  flex-direction: row;
  gap: 4px;
}
.notes-content .card .note .note-inner {
  width: 100%;
  align-items: start;
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: start;
}
.notes-content .card .note .note-inner .header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.notes-content .card .note .note-inner .header .add-title {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.notes-content .card .note .note-inner .plus-item {
  display: flex;
  gap: 8px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  align-items: center;
}
.notes-content .card .note .note-inner .plus-item img{
  border-radius: 50%;
  border: 1px solid #3348FB;
  padding: 2px;
  width: 20px;
  height: 20px;
}
.notes-content .card .note .note-inner .plus-item p {
  font-weight: 600;
  color: #3348FB;
  letter-spacing: 2%;
  text-transform: uppercase;
}
.notes-content .card .note .note-inner .note-date .date {
  height: 21px;
  font-weight: 600;
  /* font-size: 14px; */
  line-height: 150%;
  letter-spacing: 2%;
  color: #808080;
}
.notes-content .card .note .note-inner input {
  width: 100%;
}
.notes-content .card .note .note-inner .description {
  background: #F4F6FF;
  padding: 9px 16px;
  border-radius: 8px;
}
.notes-content .card .note .note-inner textarea {
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

.notes-content .card .note .note-inner textarea::placeholder {
  color: #131313;
}
.notes-content .card .note .note-inner .price-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.notes-content .card .note .note-inner .price-setting-items {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.notes-content .card .note .note-inner .add-tags {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
}
.notes-content .card .note .note-inner .add-tags .badge-items {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

</style>
