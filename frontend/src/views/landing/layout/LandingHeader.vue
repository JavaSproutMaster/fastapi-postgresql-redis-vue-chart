<template>
  <Container>
    <h1>Landing Header</h1>
  </Container>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { LOADING } from '@/store/actions/application';

import Container from '@/components/ContainerComponent.vue';

export default defineComponent({
  name: 'landingHeader',
  components: {
    Container,
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.commit(LOADING, false);
    });
  },
});
</script>

<style>
</style>
