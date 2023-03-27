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
  ChainNames,
  sortBy,
  CHAIN_ROUTES,
  themeConfig,
} from "@/core/config/constant";
import { findAndRemove } from "@/core/utils/common";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { useStore } from "vuex";
import Accordion from "@/core/components/accordion/Accordion.vue";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";

const props = defineProps({
  filterOption: Object,
  viewOption: String,
  nftCart: Boolean,
});

const emit = defineEmits(["apply-filter", "show-cart", "change-view"]);

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const searchText = useDebouncedRef("", 1000);
const collectionName = useDebouncedRef("", 1000);
const collections = ref([]);
const filteredCollections = ref([]);
const minPrice = useDebouncedRef("", 1000);
const maxPrice = useDebouncedRef("", 1000);
const minSlippage = useDebouncedRef("", 1000);
const maxSlippage = useDebouncedRef("", 1000);
const hashtagName = useDebouncedRef("", 1000);
const hashtags = ref([]);
const filteredHashtags = ref([]);
const openFilter = ref(false);

const filterByStatus = (status) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  option[status] = !option[status];
  emit("apply-filter", option);
};
const addFilterByCollections = (index, collection) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  collections.value.splice(index, 1);
  filteredCollections.value.push(collection);
  option.collection.push(collection.id);
  emit("apply-filter", option);
};
const removeFilterByCollections = (index, collection) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  filteredCollections.value.splice(index, 1);
  collections.value.push(collection);
  const filterIndex = option.collection.indexOf(collection.id);
  option.collection.splice(filterIndex, 1);
  emit("apply-filter", option);
};
const addHashtag = (hashtag) => {
  const index = hashtags.value.findIndex((item) => item.id === hashtag.id);
  hashtags.value.splice(index, 1);
  hashtags.value = hashtags.value.concat(filteredHashtags.value);
  filteredHashtags.value = [hashtag];

  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.hashtag = hashtag.name;
  emit("apply-filter", option);
};
const removeHashtag = (hashtag) => {
  const index = filteredHashtags.value.findIndex(
    (item) => item.id === hashtag.id
  );
  filteredHashtags.value.splice(index, 1);
  hashtags.value.push(hashtag);

  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.hashtag = "";
  emit("apply-filter", option);
};
const filterByChain = (chain) => {
  if (props.filterOption.chain !== chain) {
    const option = JSON.parse(JSON.stringify(props.filterOption));
    option.chain = chain;
    collections.value = [];
    filteredCollections.value = [];
    option.collection = [];
    emit("apply-filter", option);
    getContracts(chain);
  }
};
const filterBySort = (sort) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  option.sortBy === sort ? (option.sortBy = "") : (option.sortBy = sort);
  emit("apply-filter", option);
};
const getContracts = (chain, name) => {
  marketService.getContracts({ chain, name }).then((res) => {
    collections.value = res.data.contracts;
  });
};
const getHashtags = () => {
  marketService.getHashtagNames(hashtagName.value, 20).then((res) => {
    hashtags.value = res.data;
  });
};
const onKeyDown = (evt) => {
  if (evt.keyCode === 13) {
    evt.preventDefault();
    return;
  }
};
const leverageStaking = (val) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.staking = val;
  emit("apply-filter", option);
};
watch(hashtagName, (value) => {
  getHashtags();
});
watch(collectionName, (value) => {
  getContracts(props.filterOption.chain, value);
});
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
watch(minSlippage, (value) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.minSlippage = parseFloat(value);
  emit("apply-filter", option);
});
watch(maxSlippage, (value) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.maxSlippage = parseFloat(value);
  emit("apply-filter", option);
});
onMounted(() => {
  getHashtags();
  getContracts(props.filterOption.chain);
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
          <div
            class="h-8 border-l border-l-black border-r border-r-tertiary-700"
          />
          <font-awesome-icon
            @click="emit('show-cart')"
            :icon="['fas', 'cart-arrow-down']"
            :class="[
              nftCart
                ? 'text-primary-900'
                : 'text-white hover:text-primary-900',
              'transition  cursor-pointer text-lg',
            ]"
          />
        </div>
      </div>
    </div>
    <accordion :open="openFilter" class="overflow-hidden">
      <div
        class="grid sm:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6 gap-4 mt-5"
      >
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Status">
              <template v-slot:content>
                <div
                  class="grid grid-cols-2 pt-2 gap-2.5 text-11 leading-4 pb-6 h-76.5"
                >
                  <status-button
                    title="Liquidity Protection"
                    :active="filterOption.protection"
                    @click="filterByStatus('protection')"
                  />
                  <status-button
                    title="Buy Now"
                    :active="filterOption.buyNow"
                    @click="filterByStatus('buyNow')"
                  />
                  <status-button
                    title="Has Offers"
                    :active="filterOption.hasOffer"
                    @click="filterByStatus('hasOffer')"
                  />
                  <status-button
                    title="On Auction"
                    :active="filterOption.onAuction"
                    @click="filterByStatus('onAuction')"
                  />
                  <status-button
                    title="Recently Sold"
                    :active="filterOption.recentSold"
                    @click="filterByStatus('recentSold')"
                  />
                  <status-button
                    title="Has No Offers"
                    :active="filterOption.hasNoOffer"
                    @click="filterByStatus('hasNoOffer')"
                  />
                  <status-button
                    title="Ending Soon"
                    :active="filterOption.endingSoon"
                    @click="filterByStatus('endingSoon')"
                  />
                  <status-button
                    title="Recently Canceled"
                    :active="filterOption.recentCancel"
                    @click="filterByStatus('recentCancel')"
                  />
                </div>
              </template>
            </search-accordion>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Price">
              <template v-slot:content>
                <div
                  class="pt-2 gap-2.5 justify-between text-xs pb-6 mr-1 relative h-28"
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
          <div
            class="border border-black p-5 overflow-hidden text-13 font-ibm-medium text-white mt-4.5"
          >
            <div>Slippage</div>
            <div class="mt-3 flex items-center text-xs">
              <div class="flex">
                <nftmx-input
                  v-model="minSlippage"
                  number
                  class="h-8.75"
                  placeholder="Min"
                />
                <div class="bg-black flex items-center w-10 justify-center">
                  %
                </div>
              </div>
              <span class="mx-1">To</span>
              <div class="flex">
                <nftmx-input
                  v-model="maxSlippage"
                  number
                  class="h-8.75"
                  placeholder="Max"
                />
                <div class="bg-black flex items-center w-10 justify-center">
                  %
                </div>
              </div>
            </div>
            <div class="mt-3.5">Leverage staking</div>
            <div class="mt-3.5 grid grid-cols-2 text-xs">
              <div class="flex items-center gap-2">
                <nftmx-radio
                  size="sm"
                  :active="filterOption.staking === 'YES'"
                  @click="
                    leverageStaking(filterOption.staking === 'YES' ? '' : 'YES')
                  "
                />
                <span> Yes </span>
              </div>
              <div class="flex items-center gap-2">
                <nftmx-radio
                  size="sm"
                  :active="filterOption.staking === 'NO'"
                  @click="
                    leverageStaking(filterOption.staking === 'NO' ? '' : 'NO')
                  "
                />
                <span> No </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Hashtags #">
              <template v-slot:content>
                <div class="h-76.5 pt-2 pb-6 text-xs">
                  <div class="relative">
                    <font-awesome-icon
                      :icon="['fas', 'search']"
                      class="text-white text-sm absolute top-2.5 left-4"
                    />
                    <nftmx-input
                      placeholder="Filter"
                      class="pt-2 pb-2.25 pl-11"
                      v-model="hashtagName"
                    />
                  </div>
                  <div class="h-full pt-2 pb-5">
                    <div class="overflow-auto flex flex-col h-full">
                      <div
                        v-for="(item, index) in filteredHashtags"
                        :key="index"
                        :class="[
                          'font-ibm text-11 text-primary-900 transition cursor-pointer py-2',
                        ]"
                        @click="removeHashtag(item)"
                      >
                        #{{ item.name }}
                      </div>
                      <div
                        v-for="(item, index) in hashtags"
                        :key="index"
                        :class="[
                          'font-ibm text-11 text-whtie hover:text-primary-900 transition cursor-pointer py-2',
                        ]"
                        @click="addHashtag(item)"
                      >
                        #{{ item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </search-accordion>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Collections name">
              <template v-slot:content>
                <div
                  class="pt-2 gap-2.5 justify-between text-xs pb-6 mr-1 relative h-76.5"
                >
                  <div class="relative">
                    <font-awesome-icon
                      :icon="['fas', 'search']"
                      class="text-white text-sm absolute top-2.5 left-4"
                    />
                    <nftmx-input
                      placeholder="Filter"
                      class="pt-2 pb-2.25 pl-11"
                      v-model="collectionName"
                    />
                  </div>
                  <div class="overflow-auto height my-4">
                    <div
                      v-for="(collection, index) in filteredCollections"
                      :key="index"
                      class="flex items-center gap-3.5 font-ibm text-11 py-1.75 cursor-pointer transition text-primary-900"
                      @click="removeFilterByCollections(index, collection)"
                    >
                      <div class="w-6 h-6 flex-none">
                        <nftmx-img
                          :src="collection.imageUrl"
                          class="object-cover w-full h-full bg-black"
                        />
                      </div>
                      <div class="leading-3">
                        {{ collection.name }}
                      </div>
                    </div>
                    <div
                      v-for="(collection, index) in collections"
                      :key="index"
                      @click="addFilterByCollections(index, collection)"
                    >
                      <div
                        v-if="
                          filteredCollections.findIndex(
                            (item) => item.id === collection.id
                          ) < 0
                        "
                        class="flex items-center gap-3.5 font-ibm text-11 py-1.75 cursor-pointer transition text-white hover:text-primary-900"
                      >
                        <div class="w-6 h-6 flex-none">
                          <nftmx-img
                            :src="collection.imageUrl"
                            class="object-cover w-full h-full bg-black"
                          />
                        </div>
                        <div class="leading-3">
                          {{ collection.name }}
                        </div>
                      </div>
                    </div>
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
                <div class="h-76.5 py-4">
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
                <div class="h-76.5 py-4">
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

<style scoped>
.text-center {
  text-align: -webkit-center;
}
.height {
  height: calc(100% - theme("spacing[8]"));
}
</style>
