<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="note-card">
    <div class="note" v-if="mode === ''">
      <div class="note-header">
        <div class="title" v-if="note.title && note.title !== ''">{{ note.title }}</div>
        <div class="note-timestamp">
          {{ createdAt }}
          <div
          style="display: flex; align-items: center; flex-direction: row; gap: 8px;"
          v-if="note.updated">
            <div
            style="width: 4px; height: 4px; background-color: #808080; border-radius: 50%;"></div>
            Updated
            <div>
               {{ updatedAt }}
            </div>
          </div>
        </div>
        <div class="note-actions">
          <button class="action-btn" @click="changeMode('edit')">
            <img src="@/assets/icons/edit.svg" alt="Edit">
          </button>
          <button class="action-btn" @click="changeMode('update')">
            <img src="@/assets/icons/refresh.svg" alt="refresh">
          </button>
          <button class="action-btn" @click="removeNote">
            <img src="@/assets/icons/remove.svg" alt="Remove">
          </button>
        </div>
      </div>
      <p
        class="note-text"
        style="overflow-wrap: anywhere;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;"
        :style="{
          'line-clamp': showmore ? 'none' : 2,
        }">
        {{ note.description }}
      </p>
      <div>
        <button class="show-more" @click="toggleShowmore">
          {{ showmore ? 'Show less' : 'Show more'}}
        </button>
      </div>
    </div>
    <div class="note note-edit-mode" v-if="mode == 'edit'">
      <div class="note-header">
        <input
          type="text"
          v-model="tmpNote.title"
          class="title"
          placeholder="title (Optional)"
          v-if="note.title"
        >
        <div class="note-timestamp">
          {{ createdAt }}
          <div
          style="display: flex; align-items: center; flex-direction: row; gap: 8px;"
          v-if="note.updated">
          <div
            style="width: 4px; height: 4px; background-color: #808080; border-radius: 50%;"></div>
            Updated
            <div>
               {{ updatedAt }}
            </div>
          </div>
        </div>
        <div class="note-actions">
          <button class="action-btn" @click="toggleExpand">
            <img src="@/assets/icons/expand.svg" alt="Expand" v-if="!expand">
            <img src="@/assets/icons/expand-collapse.svg" alt="Expand" v-else>
          </button>
          <button class="action-btn" @click="openInNew">
            <img src="@/assets/icons/open-in-new.svg" alt="Open in new">
          </button>
        </div>
      </div>

      <Textarea
        class="note-text"
        v-model:value="tmpNote.description"
        placeholder="Enter description"
      />
      <div style="display: flex; flex-direction: row; gap: 8px;">
        <Button @click="saveNote" :size="'default'">
          Save
        </Button>
        <Button @click="cancel" :size="'default'" :type="'secondary'">
          Cancel
        </Button>
      </div>
    </div>
    <div class="note note-updte-mode" v-if="mode == 'update'">
      <div class="note-header">
        <div class="note-timestamp">
          <p>
            {{ createdAt }}
          </p>
          <div
          style="display: flex; align-items: center; flex-direction: row; gap: 8px;"
          v-if="note.updated">
          <div
            style="width: 4px; height: 4px; background-color: #808080; border-radius: 50%;"></div>
            Updated
            <div>
               {{ updatedAt }}
            </div>
          </div>
        </div>
        <div class="note-actions">
          <button class="action-btn" @click="toggleExpand">
            <img src="@/assets/icons/expand.svg" alt="Expand" v-if="!expand">
            <img src="@/assets/icons/expand-collapse.svg" alt="Expand" v-else>
          </button>
          <button class="action-btn" @click="openInNew">
            <img src="@/assets/icons/open-in-new.svg" alt="Open in new">
          </button>
        </div>
      </div>
      <Textarea
        class="note-text"
        v-model:value="tmpNote.description"
        placeholder="Enter update text"
      />
      <div style="display: flex; flex-direction: row; gap: 8px;">
        <Button @click="updateNote" :size="'default'">
          Update
        </Button>
        <Button @click="cancel" :size="'default'" :type="'secondary'">
          Cancel
        </Button>
      </div>
    </div>
    <AddNewNoteModal :company="company" :note="tmpNote" :mode="mode"
    v-on:submitted="handleSubmitOnModal"
    v-on:hide-modal="hideModal"
    :show="showModal"
    v-if="showModal"/>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  reactive,
  ref,
} from 'vue';
import { NoteData, emptyNote } from '@/rest-api/companies/assets';
import Button from '@/components/ui/ButtonComponent.vue';
import Textarea from '@/components/ui/TextareaComponent.vue';
import AddNewNoteModal from '@/components/modals/AddNewNoteModal.vue';
import moment from 'moment';
import { CompanyController } from '@/controllers/company/types';
import NoteCard from './NoteCard.vue';

export default defineComponent({
  name: 'NoteComponent',
  components: {
    Button,
    Textarea,
    AddNewNoteModal,
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
  },
  emits: ['refresh', 'toggleExpand:value'],
  setup(props, { emit }) {
    const showmore = ref(false);
    const mode = ref('');
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
    const expand = ref(false);
    const showModal = ref(false);
    const toggleShowmore = (e: MouseEvent) => {
      e.preventDefault();
      showmore.value = !showmore.value;
    };
    const hideModal = () => {
      showModal.value = false;
    };
    const handleSubmitOnModal = () => {
      showModal.value = false;
      mode.value = '';
      emit('refresh');
    };
    const createdAt = computed(() => {
      if (props.note.createdAt) {
        const date = moment(props.note.createdAt);
        // Format the date
        const formattedDate = date.format('ddd, MMM DD, YYYY');
        return formattedDate;
      }
      return null;
    });
    const updatedAt = computed(() => {
      if (props.note.updated) {
        const date = moment(props.note.updatedAt || '');
        // Format the date
        const formattedDate = date.format('MMM DD, YYYY');
        return formattedDate;
      }
      return null;
    });
    const toggleExpand = () => {
      console.log('toggle', props.note.id);
      expand.value = !expand.value;
      emit('toggleExpand:value', props.note.id);
    };
    const openInNew = () => {
      showModal.value = true;
    };
    const saveNote = () => {
      if (props.note.id
      && (tmpNote.title !== props.note.title || tmpNote.description !== props.note.description)) {
        props.company.saveNote(props.note.id, tmpNote).then(() => {
          emit('refresh');
        }).finally(() => {
          Object.assign(props.note, tmpNote);
        });
      }
      mode.value = '';
      if (expand.value) {
        toggleExpand();
      }
    };
    const changeMode = (newMode: string) => {
      if (newMode === 'update') {
        Object.assign(tmpNote, {
          id: props.note.id,
          ...emptyNote,
        });
      } else {
        Object.assign(tmpNote, {
          ...props.note,
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
    const cancel = () => {
      Object.assign(tmpNote, { ...props.note });
      mode.value = '';
      showModal.value = false;
      if (expand.value) {
        toggleExpand();
      }
    };
    const updateNote = () => {
      if (props.note.id
      && (tmpNote.description)) {
        props.company.updateNote(props.note.id, tmpNote).then((payload: NoteData) => {
          Object.assign(props.note, payload);
          emit('refresh');
        });
      }
      mode.value = '';
      if (expand.value) {
        toggleExpand();
      }
    };
    const removeNote = () => {
      if (props.note.id) {
        props.company.deleteNote(props.note.id).then(() => {
          emit('refresh');
        });
      }
    };
    return {
      createdAt,
      updatedAt,
      showmore,
      tmpNote,
      showModal,
      mode,
      expand,
      toggleShowmore,
      handleSubmitOnModal,
      saveNote,
      cancel,
      updateNote,
      removeNote,
      toggleExpand,
      openInNew,
      hideModal,
      changeMode,
    };
  },
});
</script>

<style>
.notes > .notes-section > .note-list .note-card {
  position: relative;
}
.notes > .notes-section > .note-list.single-note .note-card {
  width: 100%;
}
.notes > .notes-section > .note-list.double-notes .note-card {
  width: 50%;
}
.notes .note {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  background: #F4F6FF;
  border-radius: 8px;
}
.notes .note-card .note-edit-mode {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  background: #F4F6FF;
  border-radius: 8px;
}
.notes .note-card .note-header {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 4px;
}

.notes .note-card .note-header .title {
  background: none;
  outline: none;
  border: none;
  font-weight: 800;
  font-size: 14px;
  text-transform: uppercase;
  color: #131313;
}

.notes .note-card .note-header > .note-timestamp {
  color: #B3B3B3;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.notes .note-card .note-header > .note-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
}

.notes .note-card .note-header > .note-actions > .action-btn {
  cursor: pointer;
  background: none;
  border: none;
}

.notes .note-card .note-text {
  font-size: 16px;
  font-weight: 400;
  color: var(--theme-text-color-2);
  background: none;
  border: none;
  outline: none;
  resize: none;
  display: block;
  line-height: 110%;
}

.notes .note .show-more {
  display: flex;
  font-size: 16px;
  font-weight: 600;
  color: var(--theme-link-color);
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
}
</style>
