<template>
  <Card>
    <div class="note">
      <div class="current-note">
        <div class="note-text"
        :style="{'line-clamp': expand ? 'none' : 2}"
        >
          There is no notes
        </div>
      </div>
    </div>
  </Card>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
} from 'vue';
import Card from '@/components/ui/CardComponent.vue';
import Badge from '@/components/ui/Badge.vue';
import { NoteData } from '@/rest-api/companies/assets';
import { CompanyController } from '@/controllers/company/types';
import moment from 'moment';
import { formattedDateWithDay, formattedDate } from './utils';

export default defineComponent({
  name: 'Empty',
  components: {
    Card,
    Badge,
  },
  props: {
    note: {
      type: Object as PropType<NoteData>,
      required: true,
    },
    company: {
      type: Object as PropType<CompanyController>,
      required: true,
    },
  },
  setup(props) {
    const expand = ref(false);
    return {
      expand,
      formattedDate,
      formattedDateWithDay,
    };
  },
});
</script>

<style>
.card {
  padding: 24px !important;
}
.card .note {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  /* padding: 16px; */
  /* background: #F4F6FF; */
}
.card .note .current-note {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  /* padding: 16px; */
  /* background: #F4F6FF; */
}
.card .note .sepearate-line {
  border-bottom: 1px solid #E6E6E6;
}
.card .note .note-updated {
  display: flex;
  border-top: 1px solid #E6E6E6;
  padding-top: 24px;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  /* padding: 16px; */
  /* background: #F4F6FF; */
}

.card .note .price-settings {
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  /* padding: 16px; */
  /* background: #F4F6FF; */
}
.card .note .note-tags{
  display: flex;
  flex-direction: row;
  gap: 4px;
}
.card .note .note-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.card .note .note-header .title{
  text-transform: uppercase;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 2%;
  line-height: 110%;
}
.card .note .note-header > .note-timestamp {
  color: #B3B3B3;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
}

.card .note > .note-actions {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
}

.card .note > .note-actions > * {
  cursor: pointer;
}

.card .note .note-text {
  font-size: 16px;
  font-weight: 400;
  color: var(--theme-text-color-2);
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card .note .show-more {
  display: flex;
  font-size: 16px;
  font-weight: 600;
  color: var(--theme-link-color);
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
}
</style>
