<template>
  <div
    ref="containerRef"
    class="avatar">
    <!-- <img v-if="image" :src="image" class="image" :alt="name" /> -->
    <span
      class="initials">
      A
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AvatarComponent',
});
</script>

<style>
.avatar {
  width: 24px;
  height: 24px;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  /* bind the background color to bgColor */
  background: #3348FB;
}
.avatar .initials{
  font-size: 12px;
  font-weight: 600;
  line-height: 14.32px;
  color: white;
}

</style>
