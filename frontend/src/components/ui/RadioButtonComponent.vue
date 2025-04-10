<template>
  <button
    class="radio"
    :class="{
      'checkbox-checked': innerValue,
      'checkbox__big': type === 'big',
    }"
    @click="innerValue = !innerValue"
  ></button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'RadioButtonComponent',
  props: {
    type: {
      type: String,
      enum: ['default', 'big'],
      default: 'default',
    },
    value: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const innerValue = computed({
      get() {
        return props.value;
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

<style scoped>
.radio {
  position: relative;
  width: 18px;
  height: 18px;
  border: 1px solid #9AA6FA;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  background: none;
}

.radio.checkbox__big {
  width: 18px;
  height: 18px;
  border-color: var(--theme-text-gray);
  border-radius: 50%;
}

.radio.checkbox-checked {
  border: 1px solid var(--theme-link-color);
}

.radio.checkbox__big.checkbox.checkbox-checked {
  border-color: var(--theme-text-gray);
}

.radio.checkbox-checked:not(.checkbox__big)::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  min-width: 8px;
  min-height: 8px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--theme-link-color);
}

</style>
