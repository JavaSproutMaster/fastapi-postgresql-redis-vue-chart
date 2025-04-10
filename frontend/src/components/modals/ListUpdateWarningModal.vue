<template>
  <Modal class="modal__list" name="list-update-warning-modal">
    <h4>Please remove some columns prior adding new</h4>
    <p>
      The table contains maximum {{ viewType === 'extended' ? 15 : 12 }} columns.
      Please remove some columns prior adding new.
    </p>
    <Button
      :loading="loading"
      @click="onClickSave"
    >OK</Button>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import Modal from '@/components/ModalComponent.vue';

import Button from '@/components/ui/ButtonComponent.vue';

import * as api from '@/rest-api/lists';
import store from '@/store';
import { HIDE_MODAL, SHOW_MODAL } from '@/store/actions/application';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ListUpdateWarningModal',
  components: {
    Modal,
    Button,
  },
  props: {
    viewType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const listName = ref('');
    const loading = ref(false);
    const onClickSave = () => {
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
