<script setup>
import Accordion from "../container/AssetsAccordion.vue";
import NftmxSaleCard from "@/core/components/cards/NftmxSaleCard.vue";
import { useStore } from "vuex";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import marketService from "@/core/services/market.service";
import DerivativeAssetCard from "@/core/components/cards/DerivativeAssetCard.vue";
import { themeConfig, defaultPagination } from "@/core/config/constant";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import { roundTo } from "@/core/utils/common";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import Timer from "@/core/components/timer/Timer.vue";

const props = defineProps({
  title: String,
  ledgerPanelVisible: Boolean,
  filterOption: Object,
  first: Boolean,
  isCartOpened: Boolean,
  viewOption: String,
});

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const orders = ref([]);
const loading = ref(true);
const allAssets = ref({ assets: [], cursor: null });
const assets = ref([]);
const limit = ref(2);
const assetFilterOption = computed(() => props.filterOption);
const assetsAccordion = ref(null);
const open = computed(() =>
  assetsAccordion.value ? assetsAccordion.value.open : true
);
const more = computed(
  () =>
    allAssets.value.cursor ||
    assets.value.length < allAssets.value.assets.length
);
const loadMoreAssets = async () => {
  loading.value = true;
  if (allAssets.value.cursor) await retrieveAssets();
  loading.value = false;
  const sliceLimit = limit.value * 5;
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
    allAssets.value.assets.slice(
      0,
      props.title === "Explore" ? limit.value * 5 : limit.value
    )
  );
};
const retrieveAssets = async () => {
  return new Promise((resolve, reject) => {
    marketService
      .searchNfts({
        ...props.filterOption,
        cursor: allAssets.value.cursor,
        limit: 30,
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
const setLimitValue = (value) => {
  const lines = Math.ceil(assets.value.length / limit.value);
  assets.value = allAssets.value.assets.slice(0, value * lines);
  limit.value = value;
};
watchEffect(() => {
  let limit = 6;
  if (windowWidth.value >= themeConfig.xl3) {
    limit = 6;
  } else if (windowWidth.value >= themeConfig.xl2) {
    limit = 5;
  } else if (windowWidth.value >= themeConfig.xl) {
    limit = 4;
  } else if (windowWidth.value >= themeConfig.lg) {
    limit = 3;
  }
  if (props.ledgerPanelVisible) {
    limit--;
  }
  if (props.isCartOpened) {
    limit--;
  }
  if (windowWidth.value < themeConfig.lg) {
    if (windowWidth.value >= themeConfig.sm) {
      limit = 2;
    } else {
      limit = 1;
    }
  }
  setLimitValue(limit);
});
onMounted(() => {
  initialAssets();
});
watch(assetFilterOption, (value) => {
  initialAssets();
});
const startDrag = (evt, item) => {
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("movingItem", JSON.stringify(item));
};
</script>

<template>
  <div class="relative">
    <nftmx-divider v-if="!first" class="mt-11.5 mb-6.5 mx-4" />
    <accordion ref="assetsAccordion">
      <template v-slot:caption>
        <div class="flex items-center w-full">
          <div class="flex-1 text-base font-press pt-2 pb-1">
            {{ title }}
          </div>
        </div>
      </template>
      <div class="p-4">
        <div
          v-if="viewOption === 'TILE'"
          :class="[
            ledgerPanelVisible && isCartOpened
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4'
              : ledgerPanelVisible || isCartOpened
              ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6',
            'grid gap-4.5',
          ]"
        >
          <div v-for="(asset, index) in assets" :key="index">
            <derivative-asset-card
              :asset="asset"
              :draggable="true"
              @dragstart="startDrag($event, asset)"
              class="cursor-grab active:cursor-grabbing"
            />
          </div>
        </div>

        <div v-if="viewOption === 'LIST'" class="pb-2.5">
          <nftmx-table
            class="text-11 tracking-wider leading-4"
            :limitHeight="false"
          >
            <nftmx-thead>
              <tr>
                <th />
                <th />
                <th />
                <th />
                <th />
                <th
                  class="border border-black py-4 text-primary-900 bg-tertiary-800"
                  colspan="3"
                >
                  Liuidity Protection
                </th>
                <th />
              </tr>
              <nftmx-tr class="border border-black bg-tertiary-800">
                <nftmx-th class="text-left">Items</nftmx-th>
                <nftmx-th class="text-left">Rarity</nftmx-th>
                <nftmx-th class="text-left">Transfers</nftmx-th>
                <nftmx-th class="text-left">Last value</nftmx-th>
                <nftmx-th class="text-left">ROI</nftmx-th>
                <nftmx-th>Period</nftmx-th>
                <nftmx-th>Slippage</nftmx-th>
                <nftmx-th>Staking</nftmx-th>
                <nftmx-th>Status</nftmx-th>
              </nftmx-tr>
            </nftmx-thead>
            <nftmx-tbody
              :style="{
                border: '1px solid black',
              }"
              class="bg-tertiary-800"
            >
              <nftmx-tr
                v-for="(asset, index) in assets"
                :key="index"
                class="hover:bg-tertiary-300 transition cursor-pointer"
              >
                <nftmx-td>
                  <div class="flex gap-4.5 items-center">
                    <div class="w-11 h-11">
                      <nftmx-img
                        :src="asset.image512"
                        class="h-full w-full object-cover bg-black"
                      />
                    </div>
                    <div class="flex-grow">
                      <span>
                        {{ asset.name }}
                      </span>
                    </div>
                    <div class="flex items-center">
                      <span class="pr-1 text-tertiary-400">
                        {{ asset.votes.length }}
                      </span>
                      <font-awesome-icon :icon="['fas', 'thumbs-up']" />
                    </div>
                  </div>
                </nftmx-td>
                <nftmx-td class="text-primary-900">
                  1:{{ asset.contract.items }}
                </nftmx-td>
                <nftmx-td class="text-primary-900">
                  {{ asset.transfers }}
                </nftmx-td>
                <nftmx-td class="text-primary-900">
                  <div class="flex items-center">
                    <font-awesome-icon
                      v-if="asset.chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                    />
                    <div
                      v-if="asset.chain === 'BSC-TESTNET'"
                      class="w-3 h-3 fill-primary-900"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Binance</title>
                        <path
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    <span class="ml-1">
                      {{ roundTo(0.1) }}
                    </span>
                  </div>
                  <div class="text-tertiary-400">
                    [${{ roundTo(0.4781, 4) }}]
                  </div>
                </nftmx-td>
                <nftmx-td class="text-primary-900">
                  <div class="text-primary-900">+4,780.80</div>
                  <div class="text-tertiary-400">[47.81x]</div>
                </nftmx-td>
                <nftmx-td class="text-center"> {{ 365 }} Days </nftmx-td>
                <nftmx-td class="text-center"> 0% </nftmx-td>
                <nftmx-td class="text-center">
                  <div>Yes</div>
                  <div class="text-tertiary-400">[Venus]</div>
                </nftmx-td>
                <nftmx-td>
                  <div
                    v-if="
                      asset.orders &&
                      asset.orders[0] &&
                      asset.orders[0].orderType === '0'
                    "
                  >
                    <span> Asking price </span>
                    <div
                      class="flex items-end pt-1.75 w-fit mx-auto max-w-full"
                    >
                      <div
                        class="flex items-center text-lg text-primary-900 font-ibm-medium"
                      >
                        <font-awesome-icon
                          v-if="asset.chain === 'ETHEREUM'"
                          :icon="['fab', 'ethereum']"
                        />
                        <div
                          v-if="asset.chain === 'BSC-TESTNET'"
                          class="w-4 h-4 fill-white"
                        >
                          <svg
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Binance</title>
                            <path
                              d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                            />
                          </svg>
                        </div>
                        {{ roundTo(asset.orders[0].tokenPrice) }}
                      </div>
                      <span class="ml-2">[$</span>
                      <span>
                        {{ roundTo(asset.orders[0].tokenPrice * 200) }}
                      </span>
                      <span>]</span>
                    </div>
                  </div>
                  <div v-else-if="asset.orders && asset.orders[0]">
                    <span> Current auction ends in </span>
                    <div class="pt-2.5 w-fit mx-auto max-w-full">
                      <timer
                        :time="
                          parseInt(
                            asset.orders[0].offerClosingTime -
                              new Date().getTime() / 1000 >
                              0
                              ? asset.orders[0].offerClosingTime -
                                  new Date().getTime() / 1000
                              : 0
                          )
                        "
                      />
                    </div>
                  </div>
                  <div v-else class="text-center">
                    <span class="text-tertiary-400 tracking-normal">
                      Current auction ends in
                    </span>
                    <div class="pt-2.5 w-fit mx-auto max-w-full">
                      <timer :time="0" />
                    </div>
                  </div>
                </nftmx-td>
              </nftmx-tr>
            </nftmx-tbody>
          </nftmx-table>
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
    </accordion>
    <div
      v-if="more && open"
      class="text-13 text-right text-primary-900 font-ibm-medium px-4"
      @click="loadMoreAssets()"
    >
      <span class="cursor-pointer">See More</span>
    </div>
  </div>
</template>
