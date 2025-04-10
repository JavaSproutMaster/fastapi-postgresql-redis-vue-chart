<template>
  <div class="badge"
  :class="{
    'primary_badge': type === 'primary',
    'secondary_badge': type === 'secondary',
    'white_badge': type === 'white',
    'size_default': size === 'default',
    'size_medium': size === 'medium',
    'size_small': size === 'small',
  }">
    <div class="badge-label">
      <p>{{ label }}</p>
      <button class="close-btn" @click="handleClick" v-if="close">
        <img src="@/assets/icons/close-badge.svg" alt="TopFunds" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputComponent',
  props: {
    label: {
      type: String,
      required: true,
    },
    close: {
      type: Boolean,
      required: false,
    },
    size: {
      type: String,
      enum: ['default', 'big', 'medium', 'small'],
      default: 'default',
    },
    type: {
      type: String,
      enum: ['primary', 'secondary', 'white'],
      default: 'primary',
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const handleClick = (e: MouseEvent) => {
      emit('close');
    };

    return {
      handleClick,
    };
  },
});
</script>

<style scoped>
.badge {
  border-radius: 100px;
}
.badge.primary_badge {
  background: #3348FB;
}
.badge.secondary_badge {
  background: #EDEDED;
}
.badge.white_badge {
  border: 1px solid #999999;
  background: #FFFFFF;
}
.badge.size_default {
  font-size: 14px;
  padding: 4px 12px;
}
.badge.size_medium {
  font-size: 12px;
  padding: 3px 8px;
}
.badge.size_small {
  font-size: 10px;
  padding: 2px 4px;
}
.badge .badge-label {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.badge .badge-label .close-btn {
  background: none;
  border: none;
  outline: none;
}
.badge .badge-label p {
  text-transform: uppercase;
}
.badge.primary_badge .badge-label p {
  color: #FFFFFF;
}
.badge.secondary_badge .badge-label p {
  color: #666666;
}
.badge.white_badge .badge-label p {
  color: #999999;
}

</style>
