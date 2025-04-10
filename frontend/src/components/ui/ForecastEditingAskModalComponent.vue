<template>
  <div class="forecastModal" ref="modal" v-if="!delayedLoading">
    <div class="modal-inner">
      <div style="width: 335px; height: 24px;">
        <button class="modal-exit" @click="hideModal">
          <img src="@/assets/icons/cross.svg" alt="Cross">
        </button>
      </div>
      <div
        class="forecast-editing-outbox">
        <div style="width: 340px; height: 130px; display: grid; gap: 16px;">
          <span class="forecast-editing-title">FORECAST EDITING</span>
          <p class="forecast-editing-body">
            You can edit forecast by changing assumptions marked blue below.<br/>
            Each forecast can be saved and used<br/>to calculate fair value.
          </p>
        </div>
        <div style="margin: auto;">
          <Button
            :style="'width:68px; height: 32px; padding: 0px 24px 0px 24px;'"
            :loading="delayedLoading"
            @click="onClickSave"
          >OK</Button>
        </div>
        <div style="margin: auto;">
          <div style="display: flex; align-items: center; width: 236px; height: 21px; gap: 10px;">
            <Checkbox v-model:value="dontShowAgain"
            :style="'width: 18px; height: 18px; border: 1px solid #999999'" />
            <button
              @click="dontShowAgain = !dontShowAgain"
              v-bind:ref_for="dontShowAgain"
              style="
              border: none;
              background: none;
              color: gray;
              font-size: 14px;
              font-weight: 500;
              line-height: 21px;">
              Don't show this message again</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, watch,
} from 'vue';

import Checkbox from '@/components/ui/CheckboxComponent.vue';

import Button from '@/components/ui/ButtonComponent.vue';
import { useStore } from 'vuex';
import { HIDEFORECASTEDITINGMODAL } from '@/store/actions/application';

export default defineComponent({
  name: 'ForecastModal',
  components: {
    Button,
    Checkbox,
  },
  setup() {
    const store = useStore();
    const forecastName = ref('');
    const dontShowAgain = ref(false);
    const delayedLoading = ref(true);

    // Watch for changes in the store's loading state
    watch(
      () => store.state.application.loading,
      (newVal) => {
        if (newVal) {
          delayedLoading.value = true;
        } else {
          setTimeout(() => {
            delayedLoading.value = false;
          }, 2000);
        }
      },
    );

    const onClickSave = () => {
      localStorage.setItem('forecast-editing-modal-show', (!dontShowAgain.value).toString());
      store.commit(HIDEFORECASTEDITINGMODAL, true);
    };
    const hideModal = () => {
      store.commit(HIDEFORECASTEDITINGMODAL, true);
    };
    const reset = () => {
      forecastName.value = '';
      delayedLoading.value = false;
    };
    return {
      delayedLoading,
      dontShowAgain,
      onClickSave,
      hideModal,
      reset,
    };
  },
});
</script>

<style>
.forecastModal {
  position: absolute;
  right: 0px;
  width: 432px;
  height: 1130px;
  background: #e6e9fc55;
  display: flex;
  align-items: start;
  justify-content: center;
  z-index: 100;
  /* transform: translate(20px, 0); */
}

.forecastModal > .modal-inner {
  position: relative;
  top: 20px;
  /* left: -15px; */
  display: flex;
  width: 390px;
  height: 299px;
  flex-direction: column;
  gap: 4px;
  background: var(--theme-text-color-contrast);
  padding: 16px 40px 40px 40px;
  border-radius: 16px;
  text-align: right;
  box-shadow: 0 4px 24px #3348fb18;
  box-shadow: 0 4px 16px #0000000c;
}

.forecastModal > .modal-inner > .modal-exit {
  position: absolute;
  width: 14px;
  height: 14px;
  right: 16px;
  top: 16px;
  cursor: pointer;
  border: none;
  outline: none;
  background: none;
}

.forecastModal .forecast-editing-outbox {
  width: 340px;
  height: 215px;
  display: grid;
  gap: 16px;
}
.forecastModal .modal-inner .modal-exit {
  border: none;
  background: none;
}

.forecastModal > .modal-inner > .modal-exit > img {
  width: 100%;
  height: 100%;
}

.forecastModal .forecast-editing-title {
  font-weight: 800;
  font-size: 16px;
  width: 340px;
  height: 18px;
  line-height: 17.6px;
  letter-spacing: 2%;
  text-align: center;
  color: #131313;
}
.forecastModal .forecast-editing-body {
  font-weight: 400;
  width: 340px;
  height: 96px;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 2%;
  text-align: center;
  color: #131313;
}

</style>
