<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="note-title">
    <img src="@/assets/icons/open-in-new.svg" class="open-in-new-icon" alt="edit">
    <Input
      type="text"
      style="width: 100%;"
      placeholder="TITLE (OPTIONAL)"
      v-model:value="title"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { NoteData } from '@/rest-api/companies/assets';
import Input from '@/components/ui/InputComponent.vue';

export default defineComponent({
  name: 'NoteTitle',
  components: {
    Input,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  emits: ['update:value', 'click'],
  setup(props, { emit }) {
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      emit('click');
    };

    return {
      handleClick,
    };
  },
});
</script>

<style>
.notes .notes-section .note-title {
  position: relative;
  width: 100%;
  text-transform: uppercase;
  font-size: 14px;
}

.notes .notes-section .note-title > input {
  font-weight: 800;
  text-transform: uppercase;
  font-size: 14px;
  color: var(--theme-text-color-2);
}

.notes .notes-section .note-title > input::placeholder {
  color: var(--theme-text-color-2);
}

.notes .notes-section .note-title .open-in-new-icon {
  position: absolute;
  top: 18px;
  right: 18px;
}

</style>
