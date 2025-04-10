<!-- eslint-disable vue/no-mutating-props -->
<template>
    <button
      @click="showModal"
      style="display: inline-flex;
      align-items: center;
      cursor: pointer;
      border: none;
      background: none;
      align-content: center;
      height: 30px;"
      :style="{
        'width': viewType === 'condensed' ? '400px':'100%'
      }">
      <img src="@/assets/icons/comment.svg" alt="Comment" style="margin-top: 2px;"
      v-if="comment">
      <span v-if="comment?.text">
        {{ viewType === 'extended' ?
  (comment?.text ?
    comment?.text.slice(0, 4) + (comment.text.length > 4 ? '...' : '') : "") : comment?.text }}
      </span>
    </button>
    <div
      class="list-new-comment"
      ref="modalContent"
      v-if="modalShow && comment">
        <div class="table-modal-header">
          <div class="table-modal-header-section"
            style="display: flex;align-items: center; gap: 8px;">
              <img src="@/assets/icons/info.svg" alt="Info">
              <p>
                Comments are saved automaticallyss</p>
          </div>
          <button @click="hideModal"><img src="/img/cross.d9df7d78.svg" alt="Cross"></button>
        </div>
        <div class="table-modal-comment table-modal-comment__expand"
          style="
          width: 396px;
          border-radius: 16px;
          padding: 16px;
          gap: 10px;
          background: #F4F6FF;
          ">
          <div class="table-modal-comment-hidden">
              <div class="table-modal-comment-title">
                <p
                style="
                  color: #B3B3B3;
                  font-weight: 600;
                  font-size: 14px;
                  line-height: 21px;
                  letter-spacing: 2%;
                  ">
                  {{ updatedAt(comment.updatedAt) }}
                </p>
                <div class="table-modal-comment-control"
                style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;">
                  <button><img src="/img/edit.06786e87.svg" alt="Trash"></button>
                  <button @click="deleteComment">
                    <img src="/img/trash.e8253a1c.svg" alt="Trash">
                  </button>
                </div>
              </div>
              <Textarea
                v-model:value="comment.text"
                placeholder="Enter comment text"
                @change="saveComment"
              />
          </div>
        </div>
    </div>
    <div
      class="table-new-comment">
    </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType,
  onMounted,
  onUnmounted,
} from 'vue';

import Textarea from '@/components/ui/TextareaComponent.vue';
import { ListComment } from '@/rest-api/lists/assets';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ListCommentComponent',
  components: {
    Textarea,
  },
  props: {
    comment: {
      type: Object as PropType<ListComment>,
      required: false,
    },
    symbol: {
      type: String,
      required: true,
    },
  },
  emits: ['newComment', 'editComment', 'deleteComment'],
  setup(props, { emit }) {
    const store = useStore();
    const isHovered = ref(false);
    const modalShow = ref(false);
    const modalContent = ref<HTMLElement | null>(null);
    const viewType = computed(() => store.state.application.listViewType);
    const createComment = () => {
      // eslint-disable-next-line no-debugger
      // debugger;
      const newComment: ListComment = {
        text: '',
        symbol: props.symbol,
        updatedAt: new Date().toISOString(),
      };
      emit('newComment', newComment);
    };
    const saveComment = (_e: Event) => {
      // Save comment logic goes here
      emit('editComment', props.comment);
    };

    const showModal = (_e: MouseEvent) => {
      _e.preventDefault();
      setTimeout(() => {
        modalShow.value = true;
        if (!props.comment) createComment();
      }, 200);
    };
    const updatedAt = (d: string) => {
      const dateObj = new Date(d);
      const formattedDate = `${String(dateObj.getMonth() + 1)
        .padStart(2, '0')}/${String(dateObj.getDate())
        .padStart(2, '0')}/${dateObj.getFullYear()}`;
      return formattedDate;
    };
    const hideModal = (event: Event | KeyboardEvent) => {
      event.preventDefault();
      modalShow.value = false;
    };

    const deleteComment = (_e: MouseEvent) => {
      hideModal(_e);
      emit('deleteComment', props.comment);
    };
    const clickHandler = (event: Event | KeyboardEvent) => {
      if (event.type !== 'keydown' || (event as KeyboardEvent).code !== 'Enter') {
        const target = event.target as HTMLElement;
        if (!modalShow.value || !modalContent.value) return;
        if (modalContent.value && modalContent.value.contains(target)) return;
        hideModal(event);
      }
    };
    const keyHandler = (event: KeyboardEvent) => {
      const keyCode = event.keyCode as number;
      if (!modalShow.value || keyCode !== 27) return;
      hideModal(event);
    };
    onMounted(() => {
      document.addEventListener('click', clickHandler);
      document.addEventListener('keydown', keyHandler);
    });

    onUnmounted(() => {
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('keydown', keyHandler);
    });

    return {
      isHovered,
      modalContent,
      modalShow,
      viewType,
      saveComment,
      createComment,
      deleteComment,
      showModal,
      hideModal,
      updatedAt,
    };
  },
});
</script>

<style scoped>
.table-vertical table > tbody > tr > td .table-new-comment {
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  background: url('@/assets/icons/add-comment.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: none;
}
.table-vertical table > tbody > tr > td:hover .table-new-comment {
  display: block;
}
.table-vertical table button {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  border: none;
  background: none;
  cursor: pointer;
}
.table-vertical table button span {
  margin-left: 4px;
  color: #3348fa;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.table-vertical table .list-new-comment {
  width: 428px;
  border-radius: 16px;
  padding: 16px;
  background: var(--theme-text-color-contrast);
  position: absolute;
  bottom: 34px;
  box-shadow: 0px 4px 24px 0px #3348FB29;
  right: 10px;
}
.table-vertical table .table-modal-header {
  display:flex;
  align-items: center;
  justify-content: space-between;
  width: 394px;
  height: 24px;
  margin-bottom: 16px;
}
.table-modal-header .table-modal-header-section p {
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 2%;
  color: #131313;
}

.table-vertical table .table-modal-comment-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.table-vertical table textarea {
  background: none;
  outline: none;
  border: none;
  color: var(--theme-text-color-2);
  display: block;
  height: auto;
  width: 100%;
  resize: none;
}

.table-vertical table textarea::placeholder {
  color: var(--theme-text-color-2);
}
</style>
