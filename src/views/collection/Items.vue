<script setup>
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import BasicDropdown from "@/core/components/dropdown/BasicDropdown.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import marketService from "@/core/services/market.service";
import { themeConfig, defaultPagination } from "@/core/config/constant";
import OpenseaAssetCard from "@/core/components/cards/OpenseaAssetCard.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef";
import BasicDropdownItem from "@/core/components/dropdown/BasicDropdownItem.vue";
import { useRoute } from "vue-router";
import SearchOption from "./SearchOption.vue";
import VueSlider from "vue-3-slider-component";
import NftmxScatterChart from "@/core/components/chart/NftmxScatterChart.vue";

const filterTypeList = [
  {
    model: "SINGLE",
    value: "Single items",
  },
  {
    model: "BUNDLE",
    value: "Bundled",
  },
];
const sortByList = [
  {
    sortBy: "RECENTLY_LISTED",
    value: "Recently Listed",
  },
  {
    sortBy: "NEW",
    value: "Recently Created",
  },
  {
    sortBy: "RECENTLY_SOLD",
    value: "Recently Sold",
  },
  {
    sortBy: "RECENTLY_RECEIVED",
    value: "Recently Received",
  },
  {
    sortBy: "ENDING_SOON",
    value: "Ending Soon",
  },
  {
    sortBy: "LOW_TO_HIGH",
    value: "Price:Low to High",
  },
  {
    sortBy: "HIGH_TO_LOW",
    value: "Price:High to Low",
  },
  {
    sortBy: "HIGHEST_LAST_SALE",
    value: "Highest Last Sale",
  },
  {
    sortBy: "VIEW",
    value: "Most Viewed",
  },
  {
    sortBy: "LIKED",
    value: "Most Favorited",
  },
  {
    sortBy: "OLDEST",
    value: "Oldest",
  },
];
const props = defineProps({
  contractId: String,
});

const collection = {
  name: "The Sandbox",
  slug: "sandbox",
};
const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const route = useRoute();
const chain = route.params.chain;
const contractId = computed(() => props.contractId);
const name = useDebouncedRef("", 1000);
const type = ref(filterTypeList[0]);
const sortby = ref(sortByList[1]);
const loading = ref(true);
const allAssets = ref({ assets: [], cursor: null });
const assets = ref([]);
const limit = ref(2);
const more = computed(
  () =>
    allAssets.value.cursor ||
    assets.value.length < allAssets.value.assets.length
);
const openFilter = ref(false);
const filterOption = ref({
  chain: chain,
  name: "",
  protection: false,
  buyNow: false,
  onAuction: false,
  hasOffer: false,
  hasNoOffer: false,
  recentSold: false,
  recentCancel: false,
  endingSoon: false,
  min: null,
  max: null,
  minSlippage: null,
  maxSlippage: null,
  staking: "",
  sortBy: "",
  hashtag: "",
});
const amount = ref(0);

const retrieveAssets = async () => {
  if (contractId.value)
    return new Promise((resolve, reject) => {
      marketService
        .searchNfts({
          ...filterOption.value,
          collection: [contractId.value],
          cursor: allAssets.value.cursor,
          limit: 24,
        })
        .then((res) => {
          allAssets.value = {
            assets: [...allAssets.value.assets, ...res.data.nfts],
            cursor: res.data.cursor,
          };
          resolve(true);
        })
        .catch((err) => {
          resolve(false);
        });
    });
};
const loadMoreAssets = async () => {
  loading.value = true;
  if (allAssets.value.cursor) await retrieveAssets();
  loading.value = false;
  const sliceLimit = limit.value * 4;
  const nextStartPoint = assets.value.length;
  assets.value = assets.value.concat(
    allAssets.value.assets.slice(nextStartPoint, nextStartPoint + sliceLimit)
  );
};
const initialAssets = async () => {
  allAssets.value = { assets: [], cursor: null };
  assets.value = [];
  loading.value = true;
  await retrieveAssets();
  loading.value = false;
  assets.value = assets.value.concat(
    allAssets.value.assets.slice(0, limit.value * 4)
  );
};
const setLimitValue = (value) => {
  if (value > limit.value) {
    const missed = value - (assets.value.length % value);
    const nextStartPoint = assets.value.length;
    assets.value = assets.value.concat(
      allAssets.value.assets.slice(nextStartPoint, nextStartPoint + missed)
    );
  } else if (value < limit.value) {
    const overflowed = assets.value.length % value;
    assets.value.splice(assets.value.length - overflowed);
  }
  limit.value = value;
};
watchEffect(() => {
  if (windowWidth.value >= themeConfig.xl3) {
    if (limit.value !== 6) {
      setLimitValue(6);
    }
  } else if (windowWidth.value >= themeConfig.xl2) {
    if (limit.value !== 5) {
      setLimitValue(5);
    }
  } else if (windowWidth.value >= themeConfig.xl) {
    if (limit.value !== 4) {
      setLimitValue(4);
    }
  } else if (windowWidth.value >= themeConfig.lg) {
    if (limit.value !== 3) {
      setLimitValue(3);
    }
  } else if (windowWidth.value >= themeConfig.sm) {
    if (limit.value !== 2) {
      setLimitValue(2);
    }
  } else {
    if (limit.value !== 1) {
      setLimitValue(1);
    }
  }
});
onMounted(() => {
  initialAssets();
});
watch(name, (val) => {
  filterOption.value = { ...filterOption.value, name: val };
  initialAssets();
});
watch(type, (val) => {
  initialAssets();
});
watch(sortby, (val) => {
  initialAssets();
});
watch(contractId, (val) => {
  initialAssets();
});
const applyNftFiltering = (option) => {
  filterOption.value = option;
  initialAssets();
};
</script>

<template>
  <div class="pb-10">
    <div class="py-4 lg:flex gap-4.75 justify-end">
      <div class="flex relative cursor-pointer border border-black">
        <font-awesome-icon
          :icon="['fas', 'search']"
          class="text-white text-lg absolute top-4 left-5 pointer-events-none"
        />
        <div class="bg-tertiary-800 w-full lg:w-68.25 text-sm">
          <nftmx-input
            v-model="name"
            class="h-12.5 px-12"
            placeholder="Search"
            border="none"
          />
        </div>
        <font-awesome-icon
          :icon="['fas', 'filter']"
          :class="[
            openFilter ? 'text-primary-900' : 'text-white',
            'text-sm absolute top-4.5 right-5 hover:text-primary-900 cursor-pointer transition',
          ]"
          @click="openFilter = !openFilter"
        />
      </div>
    </div>
    <search-option
      :filterOption="filterOption"
      @apply-filter="applyNftFiltering"
      :openFilter="openFilter"
    />
    <!-- <div class="flex items-center gap-4 text-white font-ibm text-sm">
      <div
        class="flex w-68 h-12.5 border border-black divide-x divide-black bg-tertiary-800"
      >
        <div class="bg-black w-12.5 flex items-center justify-center">
          <img src="/images/components/broom-wide.png" />
        </div>
        <div
          class="w-12.5 flex items-center justify-center text-tertiary-400 text-sm"
        >
          {{ amount }}
        </div>
        <div class="flex-1 p-4">
          <vue-slider
            v-model="amount"
            :min="0"
            :max="10"
            :interval="1"
            :dotSize="12"
            :dotOptions="[
              {
                style: {
                  backgroundColor: 'rgb(148 148 148)',
                },
              },
            ]"
            :height="2"
            :processStyle="{ backgroundColor: 'rgb(148 148 148)' }"
            :railStyle="{ backgroundColor: 'rgb(148 148 148)' }"
            tooltip="none"
          >
          </vue-slider>
        </div>
      </div>
      <span class="ml-6 transition hover:text-primary-900 cursor-pointer"
        >Sales</span
      >
      <div class="border-l border-l-black border-r border-r-tertiary-700 h-4" />
      <span class="transition hover:text-primary-900 cursor-pointer"
        >Depth</span
      >
    </div> -->
    <div>
      <!-- <div class="border border-black bg-tertiary-800">
        <nftmx-scatter-chart />
      </div> -->
      <div class="pt-10.5 pb-4">
        <div
          class="grid gap-4.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6"
        >
          <opensea-asset-card
            v-for="(asset, index) in assets"
            :key="index"
            :asset="{
              ...asset,
              orders: [
                {
                  ...(asset.orders ? asset.orders[0] : {}),
                  protectionRate:
                    asset.orders && asset.orders[0]
                      ? asset.orders[0].protectionRate
                      : Math.floor(Math.random() * 100),
                  protectionTime:
                    asset.orders && asset.orders[0]
                      ? asset.orders[0].protectionTime
                      : Math.floor(Math.random() * 86400000),
                },
              ],
            }"
          />
        </div>
        <div
          v-if="loading"
          class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
        >
          Loading...
        </div>
        <div
          v-if="!loading && allAssets.assets.length === 0"
          class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
        >
          No NFTs found
        </div>
      </div>
      <div
        v-if="more"
        class="text-sm text-right px-6 text-primary-900 font-ibm-medium"
        @click="loadMoreAssets()"
      >
        <span class="cursor-pointer">See More</span>
      </div>
    </div>
  </div>
</template>
