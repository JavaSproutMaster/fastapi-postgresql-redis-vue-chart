<template>
  <a :href="`https://staging.topfunds.com/company/${company.symbol}`">
    <span style="white-space: nowrap;">
      {{ company.name }}
    </span>
    <div class="list-symbol" :class="{ 'hovered': isHover }" v-if="showSymbol">
      {{ company.symbol }}
    </div>
  </a>
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

import { Company } from '@/rest-api/companies/assets';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ListCompanyLinkComponent',
  components: {
  },
  props: {
    company: {
      type: Object as PropType<Company>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const isHover = ref(false);
    const showOption = ref(false);
    const showOptionContent = ref<HTMLElement | null>();
    const showSymbol = computed(() => store.state.application.listShowSymbol);
    const toggleHover = () => {
      isHover.value = !isHover.value;
    };
    const goToCompanyPage = () => {
      router.push(`/company/${props.company.symbol}`);
    };
    const toggleOption = (e: MouseEvent) => {
      // Add your custom option logic here
      e.preventDefault();
      e.stopPropagation();

      // Log the option click event for debugging purposes
      showOption.value = !showOption.value;
    };
    const clickHandler = (event: Event | KeyboardEvent) => {
      if (event.type !== 'keydown' || (event as KeyboardEvent).code !== 'Enter') {
        const target = event.target as HTMLElement;
        if (!showOption.value || !showOptionContent.value) return;
        if (showOptionContent.value && showOptionContent.value.contains(target)) return;
        showOption.value = false;
      }
    };
    const keyHandler = (event: KeyboardEvent) => {
      const keyCode = event.keyCode as number;
      if (!showOption.value || keyCode !== 27) return;
      showOption.value = false;
    };
    onMounted(() => {
      document.addEventListener('mousedown', clickHandler);
      document.addEventListener('keydown', keyHandler);
    });

    onUnmounted(() => {
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('keydown', keyHandler);
    });
    return {
      isHover,
      showSymbol,
      showOption,
      showOptionContent,
      toggleHover,
      toggleOption,
      goToCompanyPage,
    };
  },
});
</script>

<style scoped>
.list-name .table-row a {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  border: none;
  background: none;
  align-content: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  letter-spacing: 2%;
  gap: 2px;
  color: black;
  position: relative;
  text-decoration: none;
}
.list-name .table-row a:hover {
  color: var(--theme-link-color);
  text-decoration: gold;
}
.list-symbol {
  background: var(--theme-text-gray-2);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  line-height: 110%;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  color: var(--theme-text-gray-3);
}

.list-name .table-row a:hover .list-symbol{
  color: var(--theme-link-color);
}
</style>
