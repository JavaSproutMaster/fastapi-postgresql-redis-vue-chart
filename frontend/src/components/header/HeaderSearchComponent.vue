<!-- eslint-disable max-len -->
<template>
  <div class="header-search-field">
    <div>
      <input
      ref="searchInput"
        v-on:focusin="blurHandler"
        v-on:focusout="bluroutHandler"
        v-on:keyup="handleChange"
        class="header-search-input"
        placeholder="Search for symbols or companies" />
        <div class="header-search-icon" style="">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
            d="M17.8395 16.4605L14.1641 12.7852C15.0489 11.6072 15.5266 10.1733 15.525 8.7C15.525 4.93672 12.4633 1.875 8.7 1.875C4.93672 1.875 1.875 4.93672 1.875 8.7C1.875 12.4633 4.93672 15.525 8.7 15.525C10.1733 15.5266 11.6072 15.0489 12.7852 14.1641L16.4605 17.8395C16.6466 18.0058 16.8893 18.0945 17.1387 18.0876C17.3881 18.0806 17.6255 17.9784 17.8019 17.8019C17.9784 17.6255 18.0806 17.3881 18.0876 17.1387C18.0945 16.8893 18.0058 16.6466 17.8395 16.4605ZM3.825 8.7C3.825 7.73582 4.11091 6.79329 4.64659 5.9916C5.18226 5.18991 5.94363 4.56506 6.83442 4.19609C7.72521 3.82711 8.70541 3.73057 9.65107 3.91867C10.5967 4.10678 11.4654 4.57107 12.1471 5.25285C12.8289 5.93464 13.2932 6.80328 13.4813 7.74894C13.6694 8.69459 13.5729 9.67479 13.2039 10.5656C12.8349 11.4564 12.2101 12.2177 11.4084 12.7534C10.6067 13.2891 9.66418 13.575 8.7 13.575C7.40755 13.5735 6.16847 13.0593 5.25457 12.1454C4.34066 11.2315 3.82655 9.99246 3.825 8.7Z" :fill="isBlur?'white':'#808080'"/>
          </svg>
        </div>
      <div
        class="header-search-button-group"
        v-if="isBlur">
        <button
          @click="clearSearchKey"
          class="header-search-clear-button">
          CLEAR
        </button>
        <button
          @click="searchHandler"
          class="header-search-button">
          SEARCH
        </button>
      </div>
      <div
      class="header-search-results"
      v-if="isBlur && searchResults">
        <button
          @click="clickHandler(result?.symbol)"
          v-for="(result, index) in searchResults.slice(0, 5)"
          class="autocomplete-result"
          :key="index">
          <div>
            <span class="search-key-hint">{{ splitWords(result?.symbol, searchKey)[0] }}</span>
            <span class="search-key">{{ splitWords(result.symbol, searchKey)[1] }}</span>
            <span class="search-key-hint">{{ splitWords(result.symbol, searchKey)[2] }}</span>
          </div>
          <div class="search-result-description">
            <span class="">{{ result.name }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Company, CompanySimple,
} from '@/rest-api/companies/assets';

import {
  defineComponent, ref, reactive,
} from 'vue';
import * as api from '@/rest-api/companies';
import { emptyData } from '@/controllers/company/data';
import CompanyListSimple from '@/views/list/types';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HeaderSearchComponent',
  components: {
  },
  setup() {
    const router = useRouter();
    const searchResults = reactive<CompanySimple[]>([]);
    const searchKey = ref();
    const isBlur = ref(false);
    const searchInput = ref<HTMLInputElement | null>(null);
    const splitWords = (word: any, key: any) => {
      if (!key) return [word, '', ''];
      if (!word) return ['', '', ''];
      const wordUpper = word.toUpperCase();
      const keyUpper = key.toUpperCase();
      const index = wordUpper.indexOf(keyUpper);

      if (index === -1) return [word, '', ''];

      const before = word.slice(0, index);
      const match = word.slice(index, index + keyUpper.length);
      const after = word.slice(index + keyUpper.length);
      return [before, match, after];
    };

    const clearSearchKey = () => {
      searchKey.value = '';
      if (searchInput.value) searchInput.value.value = '';
      searchResults.length = 0;
    };

    const setBlur = () => {
      if (searchInput.value) searchInput.value.focus();
      setTimeout(() => {
        isBlur.value = true;
      }, 200);
    };

    const clickHandler = async (symbol: string) => {
      await router.push({ name: 'company', params: { symbol } });
      window.location.reload();
    };

    const updateSearchResults = (): Promise<CompanySimple[]> => new Promise((resolve, reject) => {
      if (!searchKey.value) {
        searchResults.length = 0;
        return;
      }
      api.search(searchKey.value).then((payload) => {
        resolve(payload);
      }).catch((err) => {
        reject(err);
      });
    });
    const searchHandler = () => {
      setBlur();
      updateSearchResults().then((payload) => {
        searchResults.length = 0;
        searchResults.push(...payload);
      });
    };
    const handleChange = (e: any) => {
      e.preventDefault();
      searchKey.value = e.target.value;
      searchResults.length = 0;
      if (!searchKey.value || searchKey.value.length === 0) {
        return;
      }
      updateSearchResults().then((payload : CompanySimple[]) => {
        searchResults.length = 0;
        searchResults.push(...payload);
      }).catch((err) => {
        console.log(err);
      });
    };
    const blurHandler = () => {
      searchResults.length = 0;
      isBlur.value = true;
    };
    const bluroutHandler = () => {
      setTimeout(() => {
        searchResults.length = 0;
        isBlur.value = false;
      }, 200);
    };
    return {
      searchResults,
      isBlur,
      searchInput,
      searchKey,
      clearSearchKey,
      searchHandler,
      clickHandler,
      handleChange,
      blurHandler,
      bluroutHandler,
      splitWords,
    };
  },
});
</script>

<style>
.header-search-field {
  position: relative;
}

.header-search-field .header-search-input{
  border-radius: 100px;
  width: 708px; height: 32px;
  background: #333333;
  border: none;
  border-bottom-color: #333333;
  color: #fff;
  outline: none;
  box-shadow: none;
  padding-left: 48px;
  padding-right: 100px;
}

.header-search-field .header-search-icon {
  position: absolute; top: 6px; left: 16px;
}

.header-search-field .header-search-button-group {
  position: absolute;
  top: 0;
  right: 0;
}

.header-search-field .header-search-button-group .header-search-clear-button {
  outline: none;
  box-shadow: none;
  border: none;
  width: 92px;
  height: 32px;
  background-color: #333333;
  color: white;
  padding: 0px 24px 0px 24px;
}

.header-search-field .header-search-button-group .header-search-button {
  width: 92px;
  height: 32px;
  background-color: #3348fb;
  border: none;
  color: white;
  border-radius: 100px;
  padding: 0px 24px 0px 24px;
}

.header-search-field .header-search-results {
  position: absolute;
  top: 52px;
  background-color: white;
  border-radius: 16px;
  color: #333333;
  z-index: 20;
  font-size: 14px;
}

.header-search-field .header-search-results .autocomplete-result {
  padding: 0px 24px 0px 48px;
  height: 32px;
  width: 708px;
  display: inline-flex;
  gap: 4px;
  letter-spacing: 2%;
  align-items: center;
  line-height: 21px;
  background-color: white;
}
.header-search-field .header-search-results .autocomplete-result:hover {
  cursor: pointer;
}
.header-search-field .header-search-results .autocomplete-result:first-child {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border: solid 0.5px #CCCCCC;
}
.header-search-field .header-search-results .autocomplete-result:not(:first-child):not(:last-child){
  border: solid 0.5px #CCCCCC;
}
.header-search-field .header-search-results .autocomplete-result:last-child {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border: solid 0.5px #CCCCCC;
}

.header-search-field .header-search-results .autocomplete-result .search-key {
  font-weight: 600;
  color: #3348fb;
}
.header-search-field .header-search-results .autocomplete-result .search-key-hint {
  font-weight: 500;
  color: #131313;
}
.header-search-field .header-search-results .autocomplete-result .search-key-hint:hover {
  color: #3348fb;
}

.header-search-field .header-search-results .autocomplete-result .search-key-description {
  font-weight: 500;
  color: #808080;
}

</style>
