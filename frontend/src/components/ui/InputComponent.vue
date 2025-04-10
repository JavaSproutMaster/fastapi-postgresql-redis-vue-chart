<template>
  <input type="text" v-model="innerValue"
  :style="{'cursor': clickable ? 'pointer' : 'auto'}"
  @click="handleClick" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'InputComponent',
  props: {
    value: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: false,
    },
    clickable: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['update:value', 'handleClick'],
  setup(props, { emit }) {
    const innerValue = computed({
      get() {
        if (props.field && props.field === 'forecastField' && typeof (props.value) === 'number') {
          const val = Math.round(props.value * 10) / 10;
          return val;
        }
        return props.value;
      },
      set(newValue) {
        emit('update:value', newValue);
      },
    });
    const handleClick = (e: MouseEvent) => {
      if (!props.clickable) {
        return;
      }
      e.preventDefault();
      emit('handleClick');
    };

    return {
      innerValue,
      handleClick,
    };
  },
});
</script>

<style scoped>
input {
  background: #F4F6FF;
  padding: 16px;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 400;
  color: #7283FA;
}
</style>
