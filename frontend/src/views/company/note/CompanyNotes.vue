<template>
  <div>
    <Card id="notes" :loading="loading">
      <div class="notes">
        <div class="notes-section" v-if="!(notes.length === 1 && expand)">
          <Input placeholder="New note" :clickable="true"
            v-on:handle-click="handleClickNewNote"
            :value="description" v-if="addNewNote === false && !expand"/>
          <NoteEditComponent
          :showExpandNewNote="expandNew"
          v-on:expand="hideAllNotes"
          :note="note" :company="company" v-if="addNewNote === true && !expand"/>
          <div class="note-list"
          :class="{
            'double-notes': !expand,
            'single-note': expand,
          }"
          v-if="notes.length > 1 && !hideNotes">
            <Note
            v-on:toggle-expand:value="toggleExpandNote"
            v-on:refresh="getRecentNotes"
            v-for="note in filteredNotes.slice(-2)"
            :company="company"
            :key="note.id"
            :note="note" />
          </div>
          <div style="display: flex; gap: 24px; align-items: center;" v-if="!expand">
            <Button @click="submitNewNote" :size="'default'"
            :visuallyDisabled="!addNewNote"
            :disabled="!addNewNote">
              Add new note
            </Button>
            <p style="font: Gilroy; font-size: 12px; font-weight: 400; color: #808080;"
            v-if="notes.length < 2">
              By default your notes are visible only to you.
            </p>
            <Button @click="viewAllNotes"
            :type="'secondary'"
            :size="'default'" v-if="notes.length >= 2">
              View all notes
            </Button>
          </div>
        </div>
        <div class="notes-section" v-if="notes.length == 1 && !hideNotes">
          <div class="note-list single-note">
            <Note
            v-on:toggle-expand:value="toggleExpandNote"
            v-on:refresh="getRecentNotes"
            :note="notes[0]" :company="company" :style="{'innerWidth': '100%'}"/>
          </div>
        </div>
      </div>
    </Card>
    <!-- <AddNewNoteModal :company="company"/> -->
    <AddedNoteModal v-on:confirm="getRecentNotes"/>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  PropType,
  computed,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import * as api from '@/rest-api/companies';

import Card from '@/components/ui/CardComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Note from '@/views/company/note/NoteComponent.vue';
import { SHOW_MODAL } from '@/store/actions/application';
import { NoteData, emptyNote } from '@/rest-api/companies/assets';
import { CompanyController } from '@/controllers/company/types';
import AddedNoteModal from '@/components/modals/AddedNoteModal.vue';
import NoteEditComponent from './NoteEditComponent.vue';

export default defineComponent({
  name: 'CompanyNotes',
  components: {
    Card,
    Button,
    Input,
    Note,
    NoteEditComponent,
    AddedNoteModal,
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
    const description = ref('');
    const expandNew = ref(false);
    const expand = ref(false);
    const expandNoteId = ref();
    const hideNotes = ref(false);
    const loading = ref(true);
    const notes: NoteData[] = reactive([]);
    const filteredNotes = computed(() => {
      if (!expand.value || !expandNoteId.value) {
        return notes;
      }
      const filteredList = notes.filter((note: NoteData) => (note.id
      && note.id === expandNoteId.value));
      return filteredList;
    });
    const note: NoteData = reactive({ ...emptyNote });
    const addNewNote = ref(false);
    const handleClickNewNote = () => {
      addNewNote.value = true;
    };
    const getRecentNotes = () => {
      loading.value = true;
      addNewNote.value = false;
      props.company.getRecentNotes().then((payload: NoteData[]) => {
        notes.splice(0, notes.length);
        Object.assign(notes, payload);
        if (payload.length === 0 || payload.length > 1) {
          expandNew.value = false;
        } else {
          expandNew.value = true;
        }
      }).finally(() => {
        loading.value = false;
      });
    };
    const hideAllNotes = () => {
      hideNotes.value = !hideNotes.value;
    };
    const submitNewNote = () => {
      loading.value = true;
      if (addNewNote.value
      && note.description && note.description !== ''
      ) {
        addNewNote.value = false;
        note.currency = props.company.data.currency;
        note.symbols.push(props.company.data.symbol);
        console.log(note);
        props.company.addNote(note).then((payload: NoteData) => {
          getRecentNotes();
        });
        Object.assign(note, {
          id: undefined,
          title: '',
          description: '',
          notePrice: undefined,
          fairValueEstimate: undefined,
          belowPrice: undefined,
          symbols: [],
          currency: 'USD',
        });
      }
    };
    const viewAllNotes = () => {
      router.push({ name: 'companyNotes' });
    };
    const toggleExpandNote = (noteId: number) => {
      console.log(noteId);
      if (expand.value) {
        expandNoteId.value = undefined;
      } else {
        expandNoteId.value = noteId;
      }
      expand.value = !expand.value;
    };
    onMounted(() => {
      getRecentNotes();
    });
    return {
      note,
      notes,
      description,
      addNewNote,
      loading,
      hideNotes,
      filteredNotes,
      expandNew,
      expand,
      expandNoteId,
      getRecentNotes,
      handleClickNewNote,
      submitNewNote,
      viewAllNotes,
      hideAllNotes,
      toggleExpandNote,
    };
  },
});
</script>

<style scoped>
.notes {
  display: flex;
  gap: 16px;
}

.notes > .notes-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

.notes > .notes-section > input {
  width: 100%;
}

.notes > .notes-section > .note-list {
  width: 100%;
  display: flex;
  gap: 16px;
}
</style>
