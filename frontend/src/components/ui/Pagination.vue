<template>
  <div class="pagination">
    <div class="pagination-btn first-page arrow-btn">
      <button
        @click="onClickFirstPage"
        type="button"
        :disabled="currentPage === 1"
      >
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 7C16.5523 7 17 6.55228 17 6C17 5.44772 16.5523 5 16 5V7ZM16 5H2V7H16V5Z"
        :fill="currentPage !== 1 ? '#3348FB' : '#C2CAFC'"/>
        <path d="M6 1L1 6L6 11" :stroke="currentPage !== 1 ? '#3348FB' : '#C2CAFC'"
        stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round"/>
      </svg>
      </button>
    </div>
    <!-- <li>
      <button
        @click="onClickPreviousPage"
        type="button"
      >
        Previous
      </button>
    </li> -->
    <div
    class="pages"
    v-if="pages.length > 0">
      <div
      class="pagination-btn"
      v-for="page in pages"
      :key="page.name"
      >
        <button
          @click="onClickPage(page.name)"
          type="button"
          :disabled="page.isDisabled"
        >
          {{ page.name }}
        </button>
      </div>
    </div>
    <!-- <li>
      <button
        @click="onClickNextPage"
        type="button"
      >
        Next
      </button>
    </li> -->
    <div class="pagination-btn last-page arrow-btn">
      <button
        @click="onClickLastPage"
        type="button"
        :disabled="currentPage === totalPages"
      >
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 7C0.447715 7 0 6.55228 0 6C0 5.44772 0.447715 5 1 5V7ZM1 5H15V7H1V5Z"
          :fill="currentPage !== totalPages ? '#3348FB' : '#C2CAFC'"/>
          <path d="M11 1L16 6L11 11" :stroke="currentPage !== totalPages ? '#3348FB' : '#C2CAFC'"
          stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'PaginationComponent',
  props: {
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 5,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: false,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  emits: ['changePage:value'],
  setup(props, { emit }) {
    const pages = computed(() => {
      const ranges = [];
      let startPage = props.currentPage - 1;
      if (props.currentPage === 1 || props.totalPages <= props.maxVisibleButtons) {
        startPage = 1;
      } else if (props.currentPage === props.totalPages) {
        startPage = props.totalPages - props.maxVisibleButtons;
      }
      for (let i = startPage;
        i <= Math.min(startPage + props.maxVisibleButtons - 1, props.totalPages);
        i += 1
      ) {
        ranges.push({
          name: i,
          isDisabled: i === props.currentPage,
        });
      }
      return ranges;
    });
    const onClickFirstPage = () => {
      emit('changePage:value', 1);
    };
    const onClickPreviousPage = () => {
      emit('changePage:value', props.currentPage - 1);
    };
    const onClickPage = (page: number) => {
      emit('changePage:value', page);
    };
    const onClickNextPage = () => {
      emit('changePage:value', props.currentPage + 1);
    };
    const onClickLastPage = () => {
      emit('changePage:value', props.totalPages);
    };
    return {
      pages,
      onClickFirstPage,
      onClickPage,
      onClickPreviousPage,
      onClickNextPage,
      onClickLastPage,
    };
  },
});
</script>

<style>
.pagination {
  width: 100%;
  display: flex;
  position: relative;
  justify-content: center;
}
.pagination .pages {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.pagination .pagination-btn {
  cursor: pointer;
}
.pagination .pagination-btn button {
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}
.pagination .pagination-btn button:disabled {
  cursor: not-allowed;
}
.pagination .pages .pagination-btn button:disabled {
  background: #D6DBFD;
  font-weight: 600;
  font-size: 14px;
  line-height: 110%;
  color: #3348FB;
  cursor: pointer;
}
.pagination .pagination-btn.first-page {
  position: absolute;
  left: 0px;
}
.pagination .pagination-btn.last-page {
  position: absolute;
  right: 0px;
}
.pagination .pagination-btn.arrow-btn button{
  border: 1px solid #3348FB;
  border-radius: 100px;
}
.pagination .pagination-btn.arrow-btn button:disabled {
  border-radius: 100px;
  border: 1px solid #C2CAFC;
}
</style>
