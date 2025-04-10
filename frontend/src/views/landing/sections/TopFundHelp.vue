<template>
  <div class="display-flex flex-row content-center item-center topfundhelp">
    <Container>
      <div class="display-flex flex-column content-center content">
        <p class="title">{{ topFundHelp?.title }}</p>
        <p class="subtitle">{{ topFundHelp?.subtitle }}</p>
        <div v-for="(t, index) in topFundHelp?.content" :key="index">
          <li>{{ t }}</li>
        </div>
        <a href="#" class="link">{{ topFundHelp?.link }}</a>
      </div>
    </Container>
    <div class="image-section">
      <img src="../assets/image/topfundhelp-rightimg.png" alt="topfundhelp" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { LOADING } from '@/store/actions/application';

import Container from '@/components/ContainerComponent.vue';

export default defineComponent({
  name: 'topFundHelp',
  components: {
    Container,
  },
  props: {
    topFundHelp: {
      type: Object,
      required: false,
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

<style scoped>
  .topfundhelp {
    padding: 0px 30px;
  }
  .title {
    font-family: Gilroy;
    font-weight: 800;
    font-size: 48px;
    text-transform: uppercase;
    margin-bottom: 25px;
  }
  .subtitle {
    font-family: Gilroy;
    font-weight: 800;
    font-size: 32px;
    text-transform: uppercase;
  }
  .content {
    padding: 30px;
  }
  li {
    position: relative;
    font-family: Gilroy;
    font-weight: 500;
    font-size: 20px;
    letter-spacing: 2%;
    text-indent: -30px;
    margin: 20px;
  }
  li::before {
    content: '\2022';
    color: #3348FB;
    font-size: 20px;
    position: absolute;
    left: 0;
    top: 0;
  }
  .link {
    font-family: Gilroy;
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 2%;
    text-decoration: underline;
  }
  .image-section {
    width: 60%;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
</style>
