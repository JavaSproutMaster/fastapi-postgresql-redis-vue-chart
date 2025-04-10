<!-- eslint-disable vue/no-mutating-props -->
<template>
  <Modal class="modal__note detail_note" name="added-note-modal">
    <p class="title">Great job</p>
    <p class="description">Your note will be added to your notes page.</p>
    <Button
      :loading="loading"
      @click="onClickSave"
    >Deal</Button>
  </Modal>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
} from 'vue';
import Modal from '@/components/ModalComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import { HIDE_MODAL, SHOW_MODAL } from '@/store/actions/application';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'AddedNoteModal',
  components: {
    Modal,
    Button,
  },
  emits: ['confirm'],
  setup(_, { emit }) {
    const store = useStore();
    const searchTag = ref('');
    const listName = ref('');
    const loading = ref(false);
    const expandSettings = ref(true);
    const onClickSave = () => {
      store.commit(HIDE_MODAL);
      emit('confirm');
    };

    return {
      expandSettings,
      loading,
      listName,
      searchTag,
      onClickSave,
    };
  },
});
</script>

<style>
.modal.modal__note .modal-inner {
  max-width: 464px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 16px;
  align-items: center;
}
.modal.modal__note .modal-inner .title {
  font-weight: 800;
  text-transform: uppercase;
  line-height: 110%;
  font-size: 16px;
}
.modal.modal__note .modal-inner .description {
  font-weight: 400;
  line-height: 150%;
  font-size: 16px;
}
</style>
