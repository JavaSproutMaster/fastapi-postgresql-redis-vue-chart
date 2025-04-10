<template>
  <div class="inline-form-input">
    <p>{{ label }}</p>
    <div style="position: relative;">
      <input
      v-model="innerValue"
      name=""
      style="width: 100%;"
      @input="validateNumber"
      :style="{'cursor': clickable ? 'pointer' : 'auto'}" />
      <p style="
        position: absolute;
        right: 16px;
        top: 8px;
        font-weight: 600;
        color: #808080;">{{ currency ? currency : 'USD' }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { ratio } from '@/services/renderers';

export default defineComponent({
  name: 'FormInputComponent',
  props: {
    label: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: false,
    },
    value: {
      type: Number,
      required: false,
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
        return props.value;
      },
      set(newValue) {
        if (!newValue || typeof newValue === 'number') {
          console.log('number');
          console.log(newValue);
          emit('update:value', newValue);
        } else if (typeof newValue === 'string') {
          console.log('string');
          console.log(parseFloat(newValue));
          console.log(ratio(parseFloat(newValue)));
          emit('update:value', parseFloat(newValue));
        }
        return undefined;
      },
    });
    const validateNumber = () => {
      if (innerValue.value) {
        const sanitizedVallue = `${innerValue.value}`.replace(/[^0-9.,]/g, '');
        if (!sanitizedVallue) {
          innerValue.value = undefined;
          return;
        }
        if (sanitizedVallue !== `${innerValue.value}`) {
          innerValue.value = parseFloat(sanitizedVallue);
        }
      }
    };

    return {
      innerValue,
      validateNumber,
    };
  },
});
</script>

<style scoped>
.inline-form-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.inline-form-input p {
  font-weight: 500;
  line-height: 150%;
  color: #131313;
  letter-spacing: 2%;
}
input {
  background: #F4F6FF;
  padding: 9px 50px 9px 16px;
  border-radius: 8px;
  border: none;
  outline: none;
  font-weight: 400;
  color: #131313;
}
</style>
