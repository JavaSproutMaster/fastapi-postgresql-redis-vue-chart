<template>
  <button class="collapse-item" :class="{ 'active': active }"
  @click="toggleCollapse"
  :style="{ 'width': btnWidth ? btnWidth : '144px',
    'background': bgColor ? bgColor : '#fff'
   }">
    <span>
      {{ text }}
    </span>
    <div class="collapse-dropdown-icon">
      <img src="@/assets/icons/arrow-down.svg" alt="Arrow" :class="{
        'reversed-arrow': active
      }">
    </div>
  </button>
  <slot v-if="active" />

</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CollapseComponent',
  props: {
    text: {
      type: String,
      requried: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    btnWidth: {
      type: String,
      required: false,
    },
    bgColor: {
      type: String,
      required: false,
    },
  },
  components: {
  },
  emits: ['clickCollapse'],
  setup(props, { emit }) {
    const toggleCollapse = () => {
      emit('clickCollapse');
    };
    return {
      toggleCollapse,
    };
  },
});
</script>

<style scoped>
button.collapse-item {
  background: none;
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 8px;
  width: 144px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}
.collapse-item span {
  font-weight: 500;
  font-size: 12px;
  line-height: 14.12px;
  color: var(--theme-text-color-2);
}
button.collapse-item.active {
  background: #F4F6FF !important;
}
.collapse-item .reversed-arrow {
  transform: rotate(180deg);
}
.collapse-dropdown-icon {
  width: 16px;
  height: 16px;
}
.collapse-dropdown-icon img {
  width: 7.43px;
  height: 4.37px;
  color: #3348FB;
}

</style>
