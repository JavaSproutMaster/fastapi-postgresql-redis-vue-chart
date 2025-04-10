<template>
  <div>
    <img
      :src="imageUrl"
      style="display: none;"
      @error="handleImageError"
      @load="handleImageLoad"
      alt="Image"
    />
    <img
      v-if="isImageLoaded"
      style="width: 100px;"
      :src="imageUrl"
      alt="Image"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ImageLoader',
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    maxWidth: {
      type: Number,
      default: 100,
    },
  },
  setup(props) {
    const isImageLoaded = ref(false);

    const handleImageError = () => {
      isImageLoaded.value = false;
    };

    const handleImageLoad = () => {
      isImageLoaded.value = true;
    };

    return {
      isImageLoaded,
      handleImageError,
      handleImageLoad,
    };
  },
});
</script>

<style scoped>
/* Add any styles you need here */
</style>
