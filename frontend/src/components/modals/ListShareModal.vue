<template>
  <Modal class="modal__list" name="share-list">
    <p>
      The list is now sharablesss
    </p>
    <Button
      :loading="loading"
      @click="onClickSave"
    >Copy link to clipboard</Button>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import Modal from '@/components/ModalComponent.vue';

import Button from '@/components/ui/ButtonComponent.vue';

import * as api from '@/rest-api/lists';
import store from '@/store';
import { HIDE_MODAL, SHOW_MODAL } from '@/store/actions/application';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ListShareModal',
  components: {
    Modal,
    Button,
  },
  props: {
    listId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const listName = ref('');
    const loading = ref(false);

    const onClickSave = () => {
      navigator.clipboard.writeText(`https://staging.topfunds.com/list/${props.listId}`);
      store.commit(HIDE_MODAL);
    };

    return {
      loading,
      listName,
      onClickSave,
    };
  },
});
</script>

<style>
.modal.modal__list .modal-inner {
  max-width: 484px;
  width: 100%;
  align-items: center;
}

.modal.modal__list input {
  width: 100%;
}
</style>
