<template>
  <Modal class="modal__duplicate_list" name="duplicate-list" v-on:shown="reset">
    <h3>Permission Error</h3>
    <p>
      You have no permission to change this list, because this list is not yours.
    <br />
      Do you want to duplicate this list to your own?
    </p>
    <Button :loading="loading" @click="onClickDuplicate">Ok</Button>
    <!-- <Button :type="'secondary'"
    :loading="loading" @click="reset">Cancel</Button> -->
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import Modal from '@/components/ModalComponent.vue';
import * as api from '@/rest-api/lists';

import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { HIDE_MODAL } from '@/store/actions/application';

export default defineComponent({
  name: 'DuplicateListModal',
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
    const router = useRouter();

    const loading = ref(false);

    const onClickDuplicate = () => {
      loading.value = true;
      api.duplicate(props.listId).then(async (res: any) => {
        if (res.status === 200 && res.id > 0) {
          await router.push({ name: 'list', params: { id: res.id } });
          window.location.reload();
        }
      });
      store.commit(HIDE_MODAL);
    };

    const reset = () => {
      loading.value = false;
      // store.commit(HIDE_MODAL);
    };

    return {
      loading,
      onClickDuplicate,
      reset,
    };
  },
});
</script>

<style>
.modal.modal__duplicate_list .modal-inner {
  max-width: 432px;
  align-items: center;
}

.modal.modal__duplicate_list input {
  width: 100%;
}

.modal.modal__duplicate_list p {
  font-size: 16px;
}
</style>
