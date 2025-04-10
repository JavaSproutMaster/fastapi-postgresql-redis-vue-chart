<template>
  <tr class="table-spacer" v-if="separate"></tr>
  <tr>
    <td class="table-row" :class="{'ceo-row': name === 'CEO'}">
      <span v-if="showCounter && index">{{ (index + 1).toString().padStart(2, '0') }}</span>
      {{ name }}
    </td>
    <slot />
    <td class="table-comment" :class="{'ceo-row': name==='CEO'}" v-if="comments"></td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RowComponent',
  props: {
    name: {
      type: String,
      required: true,
    },
    showCounter: {
      type: Boolean,
      default: true,
    },
    index: {
      type: Number,
      required: false,
    },
    comments: {
      type: Boolean,
      default: false,
    },
    separate: {
      type: Boolean,
      default: false,
    },
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
