<template>
  <div class="costco">
    <Container>
      <div class="display-flex flex-row item-center content-spacebetween">
        <div>
          <Button class="left-btn">company of the month</Button>
          <p>{{ costcoContent }}</p>
        </div>
        <Button class="costco-btn" @click="costcoClick">
          <img src="../assets/image/costco-btn.png" alt="COSTCO" />
        </Button>
      </div>
    </Container>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { LOADING } from '@/store/actions/application';

import Container from '@/components/ContainerComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';

export default defineComponent({
  name: 'costcoComponent',
  components: {
    Container,
    Button,
  },
  props: {
    costcoContent: {
      type: String,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    const costcoClick = () => {
      console.log('Costco-btn Clicked!');
    };
    onMounted(() => {
      store.commit(LOADING, false);
    });
    return {
      costcoClick,
    };
  },
});
</script>

<style>
  .costco {
    background:
      url('../assets/image/costco-bg-image.png') no-repeat center center,
      #3348FB;
    border-radius: 16px;
    .left-btn {
      background-color: transparent;
      border: 1px #FFFFFF solid;
      border-radius: 100px;
      padding: 4px 12px;
      color: #FFFFFF;
      gap: 2px;
      margin-bottom: 10px;
    }
    p {
      font-family: Gilroy;
      font-weight: 800;
      font-size: 32px;
      text-transform: uppercase;
      color: #FFFFFF;
    }
    .costco-btn {
      background-color: #FFFFFF;
      border: none;
      border-radius: 100px;
      padding: 15px 20px;
    }
  }
</style>
