<template>
  <button class="button" :class="{
      'button__transparent': type === 'transparent',
      'button__secondary': type === 'secondary',
      'button__small': size === 'small',
      'button__disabled': visuallyDisabled,
      'tooltip': tooltipText,
    }" :disabled="loading || disabled">
    <VueSpinner color="var(--theme-text-color-contrast)" v-if="loading" />
    <slot />
    <button class="tooltiptext" v-if="tooltipText" @click="onClickTooltip">
      {{ tooltipText }}
    </button>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { VueSpinner } from 'vue3-spinners';

export default defineComponent({
  name: 'ButtonComponent',
  props: {
    type: {
      type: String,
      enum: ['default', 'transparent', 'secondary'],
      default: 'default',
    },
    size: {
      type: String,
      enum: ['default', 'small'],
      default: 'default',
    },
    visuallyDisabled: {
      type: Boolean,
      default: false,
    },
    tooltipText: {
      type: String,
      required: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VueSpinner,
  },
  emits: ['clickTooltip'],
  setup(_, { emit }) {
    const onClickTooltip = (e: MouseEvent) => {
      e.preventDefault();
      emit('clickTooltip');
    };

    return {
      onClickTooltip,
    };
  },
});
</script>

<style scoped>
.button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--theme-link-color);
  color: var(--theme-text-color-contrast);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 12px 24px;
  border-radius: 100px;
  border: none;
  outline: none;
  cursor: pointer;
}

.button:disabled {
  background: var(--theme-disabled-color);
  cursor: not-allowed;
}

.button.button__disabled {
  background: var(--theme-disabled-color);
}

.button.button__small {
  display: inline-block;
  padding: 5px 16px;
  font-size: 12px;
}

.button.button__transparent {
  display: inline-block;
  background: none;
  color: var(--theme-link-color);
  padding: 0;
}

.button.button__transparent:disabled,
.button.button__transparent.button__disabled {
  color: var(--theme-disabled-color);
}

.button.button__secondary {
  display: inline-block;
  background: none;
  color: var(--theme-link-color);
  border: 1px solid var(--theme-link-color);
}

.button.button__secondary:disabled,
.button.button__secondary.button__disabled {
  border: 1px solid var(--theme-disabled-color);
  color: var(--theme-disabled-color);
}
.tooltip {
  display: inline-block;
  /* border-bottom: 1px dotted black; */
  position: relative;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: #333333;
  padding: 12px 16px 12px 16px;
  color: #fff;
  font-size: 12px;
  line-height: 14.32px;
  text-align: center;
  border-radius: 10px;
  font-weight: 600;
  border: none !important;
  /* Position the tooltip */
  position: absolute;
  z-index: 3;
  top: calc(100%);
  left: 50%;
  white-space: nowrap;
  transform: translate(-50%, 0);
}

.tooltip:hover>.tooltiptext {
  visibility: visible;
  text-transform: initial;
}
</style>
