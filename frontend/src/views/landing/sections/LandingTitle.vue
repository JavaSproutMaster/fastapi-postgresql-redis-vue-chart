<template>
  <Container>
    <h1 class="display-flex item-center content-center landing-title">{{ landingTitle1 }}</h1>
    <h1 class="display-flex item-center content-center landing-title">{{ landingTitle2 }}</h1>
  </Container>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { LOADING } from '@/store/actions/application';

import Container from '@/components/ContainerComponent.vue';

export default defineComponent({
  name: 'landingTitleComponent',
  components: {
    Container,
  },
  props: {
    landingTitle1: {
      type: String,
      required: true,
    },
    landingTitle2: {
      type: String,
      required: true,
    },
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
  .landing-title {
    font: Gilroy;
    font-weight: 800;
    font-size: 32px;
    text-transform: uppercase;
  }
</style>
