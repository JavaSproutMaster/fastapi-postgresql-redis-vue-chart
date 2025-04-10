<template>
  <div class="dropdown-pannel" ref="dropdownContent">
    <button class="dropdown-button tooltip" @click.self="toggleMenu">
      <div class="dropdown-value">
        <slot>
          <!-- <p>{{ model.title }}</p> -->
        </slot>
      </div>
      <span class="tooltiptext" v-if="tooltipText">
        {{ tooltipText }}
      </span>
    </button>

    <div class="dropdown-menu" v-if="dropdownMenu" :style="{
      width: menuWidth ? menuWidth : '286px',
      transform: menuTransform ? menuTransform : 'translateX(-20%)',
      right: menuRight ? menuRight : 'none',
      left: menuLeft ? menuLeft : 'none',
      gap: gap ? gap : 'none',
      display: 'flex',
      flexDirection: 'column',
    }">
      <slot name="content">
        <button v-for="(item, index) in values" :key="index" class="dropdown-menu-button" :class="{
              'dropdown-menu-button__active'
                :model?.key === item.key
            }" @click="selectValue(item)">{{ item.title
          }}</button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  onMounted,
  onUnmounted,
} from 'vue';

import Value from './types';

export default defineComponent({
  name: 'DropdownComponent',
  props: {
    value: {
      type: Object as PropType<Value>,
      required: false,
      default: undefined,
    },
    values: {
      type: Array as PropType<Value[]>,
      required: false,
      default: undefined,
    },
    tooltipText: {
      type: String,
      required: false,
    },
    menuWidth: {
      type: String,
      required: false,
    },
    menuTransform: {
      type: String,
      required: false,
    },
    menuRight: {
      type: String,
      required: false,
    },
    menuLeft: {
      type: String,
      required: false,
    },
    gap: {
      type: String,
      required: false,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const dropdownMenu = ref(false);
    const dropdownContent = ref<HTMLElement | null>(null);

    const model = computed({
      get() {
        return props.value;
      },
      set(value) {
        emit('update:value', value);
      },
    });

    const toggleMenu = () => {
      setTimeout(() => {
        dropdownMenu.value = !dropdownMenu.value;
      }, 50);
    };

    const hideMenu = (e: Event | KeyboardEvent) => {
      e.preventDefault();
      dropdownMenu.value = false;
    };

    const selectValue = (item: Value) => {
      model.value = item;
      dropdownMenu.value = false;
    };

    const clickHandler = (event: Event | KeyboardEvent) => {
      if (event.type !== 'keydown' || (event as KeyboardEvent).code !== 'Enter') {
        const target = event.target as HTMLElement;
        if (!dropdownMenu.value || !dropdownContent.value) return;
        if (dropdownContent.value && dropdownContent.value.contains(target)) return;
        hideMenu(event);
      }
    };
    const keyHandler = (event: KeyboardEvent) => {
      const keyCode = event.keyCode as number;
      if (!dropdownMenu.value || keyCode !== 27) return;
      hideMenu(event);
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
      dropdownMenu,
      model,
      dropdownContent,
      toggleMenu,
      selectValue,
    };
  },
});
</script>

<style scoped>
.dropdown-pannel {
  position: relative;
}
.dropdown-button {
  position: relative;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}

.dropdown-value,
.dropdown-value * {
  pointer-events: none;
  display: flex;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 15px);
  width: 286px;
  background: var(--theme-text-color-contrast);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0px 8px 18px 0px rgba(0, 0, 0, 0.06);
  z-index: 2;
}

.dropdown-menu > .dropdown-menu-button {
  width: 100%;
  outline: none;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  background: none;
  text-align: left;
  text-align: left;
  justify-content: flex-start;
}

.dropdown-menu > .dropdown-menu-button:hover {
  background: #F4F6FF;
}

.dropdown-menu > .dropdown-menu-button__active {
  background: #F4F6FF;
}
.tooltip {
  display: inline-block;
  /* border-bottom: 1px dotted black; */
}

.tooltip .tooltiptext {
  display: none;
  background-color: #333333;
  padding: 12px 16px 12px 16px;
  color: #fff;
  font-size: 12px;
  line-height: 14.32px;
  text-align: center;
  border-radius: 10px;
  font-weight: 600;
  /* Position the tooltip */
  position: absolute;
  z-index: 3;
  top: calc(100% + 4px);
  left: 50%;
  white-space: nowrap;
  transform: translate(-50%, 0);
}

.tooltip:hover > .tooltiptext {
  display: block;
}
</style>
