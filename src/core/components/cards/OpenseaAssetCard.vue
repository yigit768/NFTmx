<script setup>
import Ribbon from "@/core/components/basic/Ribbon.vue";
import Icon from "@/core/components/basic/Icon.vue";
import SaleInfo from "@/core/components/cards/SaleInfo.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import Timer from "@/core/components/timer/Timer.vue";
import moralisService from "@/core/services/moralis.service";
import { useStore } from "vuex";
import marketService from "@/core/services/market.service";
import { useToast } from "vue-toastification";
import ConnectWalletModal from "../modal/ConnectWalletModal.vue";
import NftmxTrimString from "../basic/NftmxTrimString.vue";
import { CHAIN_ROUTES } from "@/core/config/constant";
import BundleImage from "../basic/BundleImage.vue";
import AssetCardCarousel from "../carousel/AssetCardCarousel.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import NftmxTooltip from "../basic/NftmxTooltip.vue";
import NftmxImg from "../basic/NftmxImg.vue";
import Web3 from "web3/dist/web3.min.js";
import nftsService from "@/core/services/market/nfts.service";

const props = defineProps({
  asset: Object,
});

const store = useStore();
const toast = useToast();
const userId = computed(() => store.getters["auth/userId"]);
const chainKey = getChainKey(props.asset.chain);
const vote = computed(
  () =>
    props.asset &&
    props.asset.votes &&
    props.asset.votes.find((item) =>
      item.id === store.getters["auth/userId"] ? true : false
    )
);
const voteCount = computed(() =>
  props.asset && props.asset.votes ? props.asset.votes.length : 0
);
const windowWidth = computed(() => store.state.app.windowWidth);
const card = ref(null);
const transferred = ref("not");
const price = ref(0);
const open = ref(false);
const walletPop = ref(false);
const bundleImage = computed(() =>
  props.asset.nfts && props.asset.nfts.length > 0
    ? props.asset.nfts.map((nft) => nft.image512)
    : []
);
const voteWaiting = ref(false);
const selectedAssetIndex = ref(0);
const coinPrice = computed(() => store.state.market.coinPrice[chainKey] || 1);

const handleVote = async () => {
  if (!userId.value) {
    walletPop.value = true;
    return;
  }
  if (voteWaiting.value) return;
  voteWaiting.value = true;
  await nftsService.vote({
    chain: props.asset.chain,
    userId: userId.value,
    nftId: props.asset.id,
  });
  voteWaiting.value = false;
  const index = props.asset.votes.findIndex((item) => item.id === userId.value);
  if (index > -1) {
    props.asset.votes.splice(index, 1);
  } else {
    props.asset.votes.push(store.state.user);
  }
};
</script>

<template>
  <div ref="card" class="w-full">
    <div
      class="transition hover:shadow-[0_0px_12px_0px_rgb(0_0_0_/_0.1),_0_0px_0px_0px_rgb(0_0_0_/_0.1);] hover:shadow-primary-900"
      @mouseover="open = true"
      @mouseleave="open = false"
    >
      <div class="relative w-full overflow-hidden pt-73per bg-black">
        <router-link
          :to="{
            name: 'asset',
            params: {
              chain: asset.contract.chain,
              tokenAddress: asset.tokenAddress,
              tokenId: asset.tokenId,
            },
          }"
          target="_blank"
          class="w-full h-full absolute top-0 left-0"
        >
          <div
            v-if="bundleImage.length > 0"
            class="w-full h-full absolute top-0 left-0 object-cover"
          >
            <asset-card-carousel
              :images="bundleImage"
              v-model="selectedAssetIndex"
            />
          </div>
          <div v-else class="w-full h-full absolute top-0 left-0">
            <nftmx-img
              :src="asset.image512"
              class="w-full h-full object-cover text-6xl"
            />
            <!-- <div
              class="absolute top-2 right-3 flex flex-col gap-1 text-tertiary-400"
            >
              <div
                class="rounded-full w-7 h-7 bg-tertiary-900 flex items-center justify-center"
              >
                <font-awesome-icon
                  :icon="['fab', 'ethereum']"
                  class="text-xl"
                />
              </div>
              <div
                class="rounded-full w-7 h-7 bg-tertiary-900 flex items-center justify-center"
              >
                <font-awesome-icon
                  :icon="['fas', 'shield-alt']"
                  class="text-base"
                />
              </div>
              <div
                class="rounded-full w-7 h-7 bg-tertiary-900 flex items-center justify-center"
              >
                <font-awesome-icon
                  :icon="['fas', 'layer-group']"
                  class="text-base"
                />
              </div>
              <div
                class="rounded-full w-7 h-7 bg-tertiary-900 flex items-center justify-center"
              >
                <img
                  src="/images/components/opensea-icon.png"
                  class="w-4.5 h-4.5"
                />
              </div>
              <div
                class="rounded-full w-7 h-7 bg-tertiary-900 flex items-center justify-center"
              >
                <font-awesome-icon :icon="['fas', 'gavel']" class="text-base" />
              </div>
              <div
                class="rounded-full w-7 h-7 bg-tertiary-900 flex items-center justify-center"
              >
                <font-awesome-icon :icon="['fas', 'tag']" class="text-base" />
              </div>
            </div> -->
          </div>
        </router-link>
        <ribbon />
      </div>
      <div class="relative px-4.5 pt-5.5 pb-4 bg-tertiary-700">
        <div class="flex text-white overflow-hidden">
          <div class="flex-1 text-base font-ibm-bold leading-6 pr-2 h-15">
            <router-link
              :to="{
                name: 'asset',
                params: {
                  chain: asset.contract.chain,
                  tokenAddress: asset.tokenAddress,
                  tokenId: asset.tokenId,
                },
              }"
              target="_blank"
              class="cursor-pointer"
            >
              <nftmx-trim-string :line="2">
                {{ asset.name || "#" + asset.tokenId }}
              </nftmx-trim-string>
            </router-link>
          </div>
          <div class="text-xs flex mt-1.5">
            <span class="pr-1 text-tertiary-400">{{ voteCount }}</span>
            <font-awesome-icon
              :icon="['fas', 'thumbs-up']"
              :class="[
                vote ? 'text-primary-900' : 'text-white',
                voteWaiting ? 'cursor-wait' : 'cursor-pointer',
                'hover:text-primary-900 transition',
              ]"
              @click="handleVote()"
            />
          </div>
        </div>
        <div class="text-11 text-white font-ibm">
          <div class="flex justify-between items-end">
            <div class="flex">
              <span class="font-ibm-medium">ROI</span>
              <nftmx-tooltip text="ROI from baseline price to all time high.">
                <font-awesome-icon
                  :icon="['fas', 'question-circle']"
                  class="ml-1 text-10 cursor-pointer"
                />
              </nftmx-tooltip>
            </div>
            <div class="flex items-center">
              <span class="text-primary-900"> +4,780.80 </span>
              <span class="ml-1 text-tertiary-400"> [47.81x] </span>
            </div>
          </div>
          <div class="flex justify-between items-end">
            <div class="flex">
              <span class="font-ibm-medium">Floor Price</span>
            </div>
            <div class="flex items-center">
              <span class="text-primary-900">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                {{ asset.lastOrder ? asset.lastOrder.tokenPrice : 0 }}
              </span>
              <span class="ml-1 text-tertiary-400">
                <span>[$</span>
                <span>
                  {{
                    asset.lastOrder
                      ? roundTo(asset.lastOrder.tokenPrice * coinPrice)
                      : 0
                  }}
                </span>
                <span>]</span>
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 items-center mt-3 mb-1.5">
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
          />
          <div
            class="text-black font-ibm-bold text-11 whitespace-nowrap text-shadow-h1"
          >
            Multilevel Ownership
          </div>
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
          />
        </div>
        <div class="text-11 text-white font-ibm">
          <div class="flex justify-between">
            <span class="font-ibm-medium">Owners</span>
            <span class="text-primary-900">
              {{
                asset.mlrContract && asset.mlrContract.owners
                  ? asset.mlrContract.owners.length
                  : 0
              }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-ibm-medium">Total Ownership</span>
            <div class="flex items-center">
              <span class="text-primary-900">
                {{
                  asset.mlrContract && asset.mlrContract.owners
                    ? asset.mlrContract.owners.reduce(
                        (ac, owner) => ac + owner.realRoyalty,
                        0
                      )
                    : 0
                }}%
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 items-center mt-3 mb-1.5">
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
          />
          <div
            class="text-black font-ibm-bold text-11 whitespace-nowrap text-shadow-h1"
          >
            Liquidity Protection
          </div>
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
          />
        </div>
        <div class="text-11 text-white font-ibm">
          <div class="flex justify-between">
            <span class="font-ibm-medium">Period</span>
            <span class="text-primary-900">
              {{
                asset.currentOrder
                  ? Math.round(asset.currentOrder.protectionTime / 86400)
                  : 0
              }}
              Days
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-ibm-medium">Fees</span>
            <div class="flex items-center">
              <span class="text-tertiary-400">
                Slippage
                {{
                  asset.currentOrder
                    ? 100 - asset.currentOrder.protectionRate
                    : 0
                }}%
              </span>
              <div class="h-2.5 mx-1.5 border-l border-tertiary-400" />
              <span class="text-primary-900"> Staking {{ 7.5 }}% </span>
            </div>
          </div>
        </div>
        <div class="h-14 text-tertiary-400 text-11 text-center relative mt-4">
          <div
            v-if="asset.currentOrder && asset.currentOrder.orderType === '0'"
          >
            <span> Asking price </span>
            <div class="flex items-end pt-1.75 w-fit mx-auto max-w-full">
              <div
                class="flex items-center text-lg text-primary-900 font-ibm-medium"
              >
                <font-awesome-icon
                  v-if="asset.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                />
                <div
                  v-if="asset.chain === 'BSC-TESTNET'"
                  class="w-4 h-4 fill-primary-900"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                {{ roundTo(asset.currentOrder.tokenPrice) }}
              </div>
              <span class="ml-2">[$</span>
              <span>
                {{ roundTo(asset.currentOrder.tokenPrice * coinPrice) }}
              </span>
              <span>]</span>
            </div>
          </div>
          <div
            v-else-if="
              asset.currentOrder && asset.currentOrder.orderType === '1'
            "
          >
            <span> Current auction ends in </span>
            <div class="pt-2.5 w-fit mx-auto max-w-full">
              <timer
                :time="
                  parseInt(
                    asset.currentOrder.offerClosingTime -
                      new Date().getTime() / 1000 >
                      0
                      ? asset.currentOrder.offerClosingTime -
                          new Date().getTime() / 1000
                      : 0
                  )
                "
              />
            </div>
          </div>
        </div>
        <div
          :class="[
            open ? 'h-15' : 'h-0',
            'absolute overflow-hidden bottom-0 left-0 w-full transition-all',
          ]"
        >
          <nftmx-button
            v-if="!userId"
            label="CONNECT WALLET"
            class="transition-all w-full font-press text-sm h-15 bg-black hover:bg-tertiary-900 text-white"
            @click="walletPop = true"
            h="lg"
          />
          <router-link
            :to="{
              name: 'asset',
              params: {
                chain: asset.contract.chain,
                tokenAddress: asset.tokenAddress,
                tokenId: asset.tokenId,
              },
            }"
            target="_blank"
          >
            <nftmx-button
              v-if="
                asset.currentOrder &&
                asset.currentOrder.orderStatus === '0' &&
                asset.currentOrder.orderType === '0'
              "
              color="primary"
              :label="'BUY NOW'"
              class="w-full font-press text-sm"
              h="lg"
            />
            <nftmx-button
              v-else-if="
                asset.currentOrder &&
                asset.currentOrder.orderType === '1' &&
                (asset.currentOrder.orderStatus === '0' ||
                  asset.currentOrder.orderStatus === '1')
              "
              color="primary"
              label="BID NOW"
              class="w-full font-press text-sm h-15"
              h="lg"
            />
            <div
              v-else
              class="flex items-center justify-center transition-all w-full font-press text-sm h-15 bg-black hover:bg-tertiary-900 text-primary-900"
            >
              MAKE AN OFFER
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <router-link
      v-if="asset.nfts && asset.nfts.length > 0"
      :to="{
        name: 'collection',
        params: {
          chain: asset.contract.chain,
          contractAddress: asset.nfts[selectedAssetIndex].tokenAddress,
        },
      }"
      class="px-2 shadow-xl cursor-pointer block"
    >
      <div class="w-full h-1.25 bg-primary-200" />
      <div class="px-2">
        <div class="w-full h-1.25 bg-primary-100" />
      </div>
    </router-link>
    <div v-else class="h-2.5" />
    <connect-wallet-modal v-model="walletPop" />
  </div>
</template>
