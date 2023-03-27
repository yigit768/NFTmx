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
import { roundTo } from "@/core/utils/common";
import NftmxTooltip from "../basic/NftmxTooltip.vue";
import NftmxImg from "../basic/NftmxImg.vue";
import Web3 from "web3/dist/web3.min.js";
import { cancelOffer } from "@/core/utils/contracts/market.utils";

const props = defineProps({
  offer: Object,
});

const emit = defineEmits(["cancel-offer"]);

const store = useStore();
const toast = useToast();
const userId = computed(() => store.getters["auth/userId"]);
const vote = computed(
  () =>
    props.offer.nft &&
    props.offer.nft.votes &&
    props.offer.nft.votes.find((item) =>
      item.id === store.getters["auth/userId"] ? true : false
    )
);
const voteCount = computed(() =>
  props.offer.nft && props.offer.nft.votes ? props.offer.nft.votes.length : 0
);
const windowWidth = computed(() => store.state.app.windowWidth);
const card = ref(null);
const transferred = ref("not");
const price = ref(0);
const image = computed(() =>
  props.offer.nft.image512 && props.offer.nft.image512.indexOf("ipfs://") === 0
    ? props.offer.nft.image512.replace("ipfs://", "https://ipfs.io:/ipfs/")
    : props.offer.nft.image512
);
const bundleImage = computed(() =>
  props.offer.nft.nfts && props.offer.nft.nfts.length > 0
    ? props.offer.nft.nfts.map((nft) => nft.image512)
    : []
);
const voteWaiting = ref(false);
const selectedofferIndex = ref(0);

const handleVote = async () => {
  if (voteWaiting.value) return;
  voteWaiting.value = true;
  await marketService.vote(
    userId.value,
    CHAIN_ROUTES.BSC_TESTNET,
    props.offer.nft.tokenAddress,
    props.offer.nft.tokenId
  );
  voteWaiting.value = false;
  const index = props.offer.nft.votes.findIndex(
    (item) => item.id === userId.value
  );
  if (index > -1) {
    props.offer.nft.votes.splice(index, 1);
  } else {
    props.offer.nft.votes.push(store.state.user);
  }
};
const cancelMyOffer = () => {
  cancelOffer(props.offer.offerId)
    .then((res) => {
      emit("cancel-offer", props.offer.id);
    })
    .catch((err) => console.log("err: ", err));
};
</script>

<template>
  <div ref="card" class="w-full">
    <div>
      <div class="relative w-full overflow-hidden pt-73per bg-black">
        <div
          v-if="bundleImage.length > 0"
          class="w-full h-full absolute top-0 left-0 object-cover"
        >
          <asset-card-carousel
            :images="bundleImage"
            v-model="selectedAssetIndex"
          />
        </div>
        <nftmx-img
          v-else
          :src="image"
          class="w-full h-full absolute top-0 left-0 object-cover text-6xl"
        />
        <ribbon
          v-if="offer"
          :percent="offer.protectionRate"
          :period="Math.ceil(offer.protectionTime / 86400)"
        />
        <div
          class="bg-black bg-opacity-50 w-full h-full absolute top-0 left-0 text-white"
        >
          <div
            class="flex flex-col justify-around items-center h-full py-8 text-xs"
          >
            <div>
              <span> Offer price: </span>
              <span> {{ offer.offerPrice }} </span>
              <span> BNB </span>
            </div>
            <div>
              <span
                class="text-red-900 font-ibm-medium cursor-pointer"
                @click="cancelMyOffer"
              >
                Cancel Offer
              </span>
            </div>
            <div class="text-tertiary-400">
              {{
                offer.offerStatus === "0"
                  ? "Due date left for expiration"
                  : "Due date left for protection"
              }}
            </div>
            <timer
              :time="
                offer.offerExpiryTime - new Date().getTime() / 1000 > 0
                  ? parseInt(
                      offer.offerExpiryTime - new Date().getTime() / 1000
                    )
                  : 0
              "
            />
          </div>
        </div>
      </div>
      <div class="relative px-4.5 pt-5 pb-8 bg-tertiary-700">
        <div class="flex text-white overflow-hidden">
          <div class="flex-1 text-base font-ibm-bold leading-6 pr-2 h-16">
            <nftmx-trim-string :line="2">
              {{ offer.nft.name || "#" + offer.nft.tokenId }}
            </nftmx-trim-string>
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
        <div
          class="flex justify-between gap-x-4 text-11 items-baseline font-ibm-light leading-4.5 text-white"
        >
          <div>
            <div>Unique</div>
            <div class="text-primary-900">1:{{ offer.nft.contract.items }}</div>
            <div class="flex mt-3">
              <span>ROI</span>
              <nftmx-tooltip
                class="-top-0.5"
                text="ROI from baseline price to all time high."
              >
                <font-awesome-icon
                  :icon="['fas', 'question-circle']"
                  class="-mt-1 ml-1 text-10 cursor-pointer"
                />
              </nftmx-tooltip>
            </div>
            <div class="text-primary-900">
              +{{ (1234.12).toLocaleString() }}%
              <div class="text-tertiary-400 leading-3.5">({{ 1.23 }}x)</div>
            </div>
          </div>
          <div class>
            <div class="w-max flex">
              <span>Transferred</span>
              <nftmx-tooltip
                class="-top-0.5"
                text="Times transferred means going from one wallet to another wallet on the blockchain which does not always equal a sale."
              >
                <font-awesome-icon
                  :icon="['fas', 'question-circle']"
                  class="-mt-1 ml-1 text-10 cursor-pointer"
                />
              </nftmx-tooltip>
            </div>
            <div class="text-primary-900">{{ 12 + "/" + 20 }}</div>

            <div class="flex mt-3">
              <span>Last Value</span>
            </div>
            <div class="text-primary-900">${{ roundTo(123) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
