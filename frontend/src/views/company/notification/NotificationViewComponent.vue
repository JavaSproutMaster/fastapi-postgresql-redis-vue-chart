<template>
  <Card>
    <div class="set-price-notification">
      <div class="setting">
        <div class="title">Set price notification</div>
        <div class="notification-items">
          <button class="item"><p>-10%</p></button>
          <button class="item"><p>-5%</p></button>
          <button class="item"><p>+5%</p></button>
          <button class="item"><p>+10%</p></button>
          <button class="item"><p>Custom</p></button>
          <button class="item"><p>Model: Name of Model</p></button>
        </div>
        <div class="existing-notifications">
          Existing BRK.B Notifications: 290, 275
        </div>
      </div>
      <div class="manage-notification">
        <a href="#">Manage price alerts</a>
      </div>
    </div>
  </Card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import Card from '@/components/ui/CardComponent.vue';
import Badge from '@/components/ui/Badge.vue';
import { NoteData } from '@/rest-api/companies/assets';

export default defineComponent({
  name: 'NotificationViewComponent',
  components: {
    Card,
  },
  props: {
    note: {
      type: Object as PropType<NoteData>,
      required: false,
    },
  },
  // setup(props) {

  //   return {
  //   };
  // },
});
</script>

<style>
.card {
  padding: 20px 24px;
}
.card .set-price-notification {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card .set-price-notification .setting {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card .set-price-notification .setting .title {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 2%;
  text-transform: uppercase;
  color: #131313;
}
.card .set-price-notification .setting .notification-items {
  display: flex;
  flex-direction: row;
  gap: 4px;
  flex-flow: wrap;
}
.card .set-price-notification .setting .notification-items .item {
  border-radius: 100px;
  border: 1px solid #3348FB;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: #3348FB;
  background: none;
}
.card .set-price-notification .setting .existing-notifications {
  padding: 12px 16px;
  border-radius: 8px;
  background: #F4F6FF;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  color: #131313;
}
.card .set-price-notification .setting .manage-notifications {
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  text-decoration: underline;
}
</style>
