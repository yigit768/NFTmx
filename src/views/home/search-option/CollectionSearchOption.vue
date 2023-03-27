<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import CheckboxCell from "@/core/components/basic/CheckboxCell.vue";
import NftmxSearchInput from "@/core/components/basic/NftmxSearchInput.vue";
import SearchAccordion from "@/core/components/accordion/SearchAccordion.vue";
import StatusButton from "@/core/components/basic/StatusButton.vue";
import SearchDropdown from "@/core/components/dropdown/SearchDropdown.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import FilterItem from "@/core/components/basic/FilterItem.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef.js";
import marketService from "@/core/services/market.service";
import {
  filterStatus,
  ChainNames,
  sortBy,
  CHAIN_ROUTES,
  themeConfig,
} from "@/core/config/constant";
import { findAndRemove } from "@/core/utils/common";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { useStore } from "vuex";
import Accordion from "@/core/components/accordion/Accordion.vue";

const props = defineProps({
  filterOption: Object,
  viewOption: String,
});

const emit = defineEmits(["apply-filter", "change-view"]);

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const searchText = useDebouncedRef("", 1000);
const collections = ref([]);
const minPrice = useDebouncedRef("", 1000);
const maxPrice = useDebouncedRef("", 1000);
const openFilter = ref(false);

const filterByChain = (chain) => {
  if (props.filterOption.chain !== chain) {
    const option = JSON.parse(JSON.stringify(props.filterOption));
    option.chain = chain;
    emit("apply-filter", option);
  }
};
const filterBySort = (sort) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  option.sortBy = sort;
  emit("apply-filter", option);
};
const onKeyDown = (evt) => {
  if (evt.keyCode === 13) {
    evt.preventDefault();
    return;
  }
};
watch(searchText, (value) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.name = value;
  emit("apply-filter", option);
});
watch(minPrice, (value) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.min = parseFloat(value);
  emit("apply-filter", option);
});
watch(maxPrice, (value) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.min = parseFloat(value);
  emit("apply-filter", option);
});
</script>

<template>
  <div
    class="bg-tertiary-800 border-t border-b border-black py-5.25 px-4 sm:px-10 lg:px-22 text-white"
  >
    <div
      class="flex flex-wrap flex-col xl:flex-row justify-between items-center"
    >
      <div class="flex flex-1 w-full min-w-max items-center">
        <div class="w-full flex justify-between items-center gap-4 h-13">
          <div class="flex items-center w-full">
            <font-awesome-icon
              :icon="['fas', 'search']"
              class="text-white text-lg pointer-events-none"
            />
            <input
              v-if="windowWidth >= themeConfig.sm"
              class="text-sm text-white pl-6 py-2 font-ibm placeholder-tertiary-500 w-full border-0 focus:outline-none bg-tertiary-800"
              placeholder="Search items, collections, and accounts"
              v-model="searchText"
            />
            <textarea
              v-if="windowWidth < themeConfig.sm"
              @keydown="onKeyDown($event)"
              rows="2"
              class="text-sm leading-snug text-white pl-6 py-2 font-ibm-medium placeholder-tertiary-500 w-full border-0 outline-none focus:outline-none bg-tertiary-800 resize-none"
              placeholder="Search items, collections, and accounts"
              v-model="searchText"
            />
          </div>
          <font-awesome-icon
            @click="openFilter = !openFilter"
            :icon="['fas', 'filter']"
            :class="[
              openFilter ? 'text-primary-900' : 'text-white',
              'transition text-white hover:text-primary-900 cursor-pointer text-lg',
            ]"
          />
          <div
            class="h-8 border-l border-l-black border-r border-r-tertiary-700"
          />
          <font-awesome-icon
            :icon="['fas', 'square']"
            :class="[
              viewOption === 'TILE' ? 'text-primary-900' : 'text-white',
              'transition hover:text-primary-900 cursor-pointer text-lg',
            ]"
            @click="emit('change-view', 'TILE')"
          />
          <font-awesome-icon
            :icon="['fas', 'th-list']"
            :class="[
              viewOption === 'LIST' ? 'text-primary-900' : 'text-white',
              'transition hover:text-primary-900 cursor-pointer text-lg',
            ]"
            @click="emit('change-view', 'LIST')"
          />
        </div>
      </div>
    </div>
    <accordion :open="openFilter" class="overflow-hidden">
      <div
        class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-5"
      >
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Floor Price">
              <template v-slot:content>
                <div
                  class="pt-2 gap-2.5 justify-between text-xs pb-6 mr-1 relative h-64"
                >
                  <search-dropdown title="(USD)">
                    <template v-slot:content></template>
                  </search-dropdown>
                  <div class="flex mt-11.25 items-center">
                    <nftmx-input
                      v-model="minPrice"
                      number
                      class="h-8.75"
                      placeholder="Min"
                    />
                    <span class="font-ibm-medium text-white mx-1">To</span>
                    <nftmx-input
                      v-model="maxPrice"
                      number
                      class="h-8.75"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </template>
            </search-accordion>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Chain">
              <template v-slot:content>
                <div class="h-64 py-4">
                  <div class="flex flex-col h-full gap-3.5 overflow-auto">
                    <filter-item
                      v-for="(value, key) in ChainNames"
                      :key="key"
                      :active="filterOption.chain === CHAIN_ROUTES[key]"
                      :title="value"
                      @click="filterByChain(CHAIN_ROUTES[key])"
                    />
                  </div>
                </div>
              </template>
            </search-accordion>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Sort by">
              <template v-slot:content>
                <div class="h-64 py-4">
                  <div class="flex flex-col h-full gap-3.5 overflow-auto">
                    <filter-item
                      v-for="(value, key) in sortBy"
                      :key="key"
                      :active="filterOption.sortBy === key"
                      :title="value"
                      @click="filterBySort(key)"
                    />
                  </div>
                </div>
              </template>
            </search-accordion>
          </div>
        </div>
      </div>
    </accordion>
  </div>
</template>
