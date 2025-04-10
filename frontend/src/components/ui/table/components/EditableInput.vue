<template>
  <div style="position: relative;">
    <p style="position: absolute; right: 3px; top: 4px;">%</p>
    <input
      type="text"
      class="table-editable"
      v-model="innerValue"
      @input="onEditEvent" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'EditableInput',
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const innerValue = computed({
      get() {
        return Math.floor(props.value * 10) / 10;
      },
      set(newValue) {
        emit('update:value', newValue);
      },
    });

    return {
      innerValue,
    };
  },
});
</script>

<style>
.table-row.ceo-row {
  border-radius: 20px 0 0 20px !important;
}
.table-comment.ceo-row {
  border-radius: 0 20px 20px 0 !important;
}
</style>
