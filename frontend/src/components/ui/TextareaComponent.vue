<template>
  <textarea
    v-model="innerValue"
    ref="textarea"
    @input="calculateHeight"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  computed,
  ref,
  onMounted,
  onUnmounted,
} from 'vue';

export default defineComponent({
  name: 'TextareaComponent',
  props: {
    value: {
      type: String,
      required: false,
    },
    focus: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const textarea = ref();

    const calculateHeight = () => {
      nextTick(() => {
        if (textarea.value !== undefined) {
          textarea.value.style.height = 'auto';

          const maxLines = 8;
          const lineHeight = parseInt(getComputedStyle(textarea.value).lineHeight, 10);

          const maxHeight = maxLines * lineHeight;
          console.log(maxHeight);
          // Adjust height and overflow style
          if (textarea.value.scrollHeight > maxHeight) {
            textarea.value.style.height = `${maxHeight}px`;
            textarea.value.style.overflowY = 'auto';
          } else {
            textarea.value.style.height = `${textarea.value.scrollHeight}px`;
            textarea.value.style.overflowY = 'hidden';
          }
        }
      });
    };

    const innerValue = computed({
      get() {
        return props.value;
      },
      set(newValue) {
        emit('update:value', newValue);
      },
    });

    onMounted(() => {
      if (props.focus && textarea.value) {
        textarea.value.focus();
      }
      calculateHeight();
    });
    onUnmounted(() => {
      if (textarea.value) {
        textarea.value.blur();
      }
    });
    return {
      textarea,
      calculateHeight,
      innerValue,
    };
  },
});
</script>

<style scoped>

textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-track {
  background: var(--theme-text-gray-2);
}

textarea::-webkit-scrollbar-thumb {
  border-radius: 5px;
  border: 3px solid var(--theme-link-color);
}

</style>
