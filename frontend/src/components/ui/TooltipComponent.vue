<template>
  <div class="tooltip button__transparent">
    <div class="tooltip-btn">
      <slot />
    </div>
    <button class="tooltiptext" v-if="tooltipText" @click="onClickTooltip">
      {{ tooltipText }}
      <span class="tooltip-link" v-if="tooltipLink">{{ tooltipLink }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TooltipComponent',
  props: {
    tooltipText: {
      type: String,
      required: false,
    },
    tooltipLink: {
      type: String,
      required: false,
    },
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
  cursor: auto;
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
.tooltip .tooltip-btn {
  /* padding-bottom: 5px; */
  padding-top: 3px;
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
  top: calc(100% - 2px);
  left: 50%;
  white-space: nowrap;
  transform: translate(-50%, 0);
}

.tooltip:hover>.tooltiptext {
  visibility: visible;
  text-transform: initial;
}

.tooltip .tooltiptext .tooltip-link {
  background-color: #333333;
  padding: 8px;
  text-decoration: underline;
  color: #3348FB;
  font-size: 12px;
  line-height: 14.32px;
  text-align: center;
  border-radius: 10px;
  font-weight: 600;
  border: none !important;
  cursor: pointer;
  /* Position the tooltip */
}

</style>
