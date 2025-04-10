<template>
  <div class="header-alert">
    <div>
      <img src="/img/icons/Vector.svg" alt="Vector">
      <div class="header-alert-status">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeaderAlertComponent',
});
</script>

<style>
.header-alert {
  position: relative;
  padding-top: 3px;
}
.header-alert .header-alert-status{
  position: absolute;
  top: 3px;
  left: 11px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3348FB;
}

</style>
