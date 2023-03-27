<script setup>
import BundleImage from "@/core/components/basic/BundleImage.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed } from "vue";
import Web3 from "web3/dist/web3.min.js";
import NftmxTooltip from "../basic/NftmxTooltip.vue";

const props = defineProps({
  collection: Object,
});

const items = computed(() =>
  props.collection.items
    ? props.collection.items.toLocaleString("en-US", {
        notation: "compact",
        compactDisplay: "short",
      })
    : 0
);
const owners = computed(() =>
  props.collection.owners
    ? props.collection.owners.toLocaleString("en-US", {
        notation: "compact",
        compactDisplay: "short",
      })
    : 0
);
const floorPrice = computed(() =>
  props.collection.floorPrice
    ? props.collection.floorPrice.toLocaleString("en-US", {
        notation: "compact",
        compactDisplay: "short",
      })
    : 0
);
const volume = computed(() =>
  props.collection.volumeTraded
    ? Web3.utils
        .fromWei(props.collection.volumeTraded)
        .toLocaleString("en-US", {
          notation: "compact",
          compactDisplay: "short",
        })
    : 0
);
</script>

<template>
  <router-link
    :to="{
      name: 'collection',
      params: { chain: collection.chain, contractAddress: collection.address },
    }"
    class="w-full relative font-ibm-medium p-2.5"
  >
    <div class="hover:shadow-default hover:shadow-primary-900 transition">
      <div class="relative z-10">
        <div class="bg-black relative w-full pt-[80%] p-6">
          <bundle-image
            class="absolute top-0 left-0"
            :images="
              collection.nftImages && collection.nftImages.length > 0
                ? collection.nftImages
                : ''
            "
          />
        </div>
        <div
          class="absolute top-0 -right-1 w-fill h-11 bg-primary-900 bg-opacity-60 px-4 flex items-center"
        >
          <div class="text-sm text-white leading-4">
            10%-100% / 7-365 Liquidity Protection
          </div>
          <div
            class="w-2 h-2 absolute right-0.5 -bottom-1 bg-primary-900 rotate-45 -z-10"
          ></div>
        </div>
        <div
          class="absolute top-0 -right-1 w-fill bg-tertiary-900 px-4 h-11 -z-10"
        ></div>
      </div>
      <div class="relative bg-tertiary-700 px-5 pt-11 pb-6.5 h-full">
        <div
          class="relative flex items-center gap-4 after:absolute after:top-13 after:h-9.5 after:border-l after:border-l-black after:left-5.5"
        >
          <img src="/images/nfts/item1-45x.png" class="w-11 h-11" />
          <div>
            <div class="text-xs text-tertiary-400">Collection</div>
            <nftmx-trim-string
              class="text-white font-ibm-bold text-lg leading-none mt-2"
            >
              Bored Ape Yatch Club
            </nftmx-trim-string>
          </div>
        </div>
        <div
          class="relative mt-5.5 pl-16 before:absolute before:left-0 before:top-1/2 before:border-t before:border-b before:border-t-black before:border-b-tertiary-600 before:w-8 before:ml-5.5"
        >
          <div class="flex items-center gap-4">
            <img src="/images/nfts/item1-45x.png" class="w-11.25 h-11.25" />
            <div class="text-11">
              <div class="text-tertiary-400">Locked NFT</div>
              <nftmx-trim-string class="text-white font-ibm-medium">
                NFT #4555
              </nftmx-trim-string>
            </div>
          </div>
        </div>
        <div class="flex gap-2 items-center mt-5.5">
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
          />
          <div
            class="text-black font-ibm-bold text-shadow-h1 text-11 whitespace-nowrap"
          >
            Liquidity Protection
          </div>
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
          />
        </div>
        <div
          class="flex justify-between text-11 leading-4.5 text-white mt-2.25"
        >
          <div>
            <span class="font-ibm-medium">Maximum Period</span>
            <nftmx-tooltip text="Maximum protection period in this collection">
              <font-awesome-icon
                :icon="['fas', 'question-circle']"
                class="ml-1 text-10 cursor-pointer"
              />
            </nftmx-tooltip>
          </div>
          <div class="text-primary-900 font-ibm">365 Days</div>
        </div>
        <div class="flex justify-between text-11 leading-4.5 text-white">
          <div>
            <span class="font-ibm-medium">Minimum Fees</span>
            <nftmx-tooltip text="Minimum slippage fees in this collection">
              <font-awesome-icon
                :icon="['fas', 'question-circle']"
                class="ml-1 text-10 cursor-pointer"
              />
            </nftmx-tooltip>
          </div>
          <div class="text-primary-900 font-ibm">
            <span> Slippage 0% </span>
            <span class="text-tertiary-400"> | </span>
            <span> Staking 7.5% </span>
          </div>
        </div>
        <div
          class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0 mt-4.5"
        />
        <div class="flex justify-between text-11 leading-4.5 mt-3.75">
          <div>
            <span class="font-ibm-medium">Items/Listing</span>
          </div>
          <div class="text-primary-900 font-ibm">
            <span> 103.4k </span>
            <span class="text-tertiary-400"> [1.23%] </span>
          </div>
        </div>
        <div class="flex justify-between text-11 leading-4.5">
          <div>
            <span class="font-ibm-medium">Owners/Unique</span>
          </div>
          <div class="text-primary-900 font-ibm">
            <span> 18.5k </span>
            <span class="text-tertiary-400"> [32.23%] </span>
          </div>
        </div>
        <div class="flex justify-between text-11 leading-4.5">
          <div>
            <span class="font-ibm-medium">Floor Price</span>
          </div>
          <div class="text-primary-900 font-ibm">
            <font-awesome-icon :icon="['fab', 'ethereum']" />
            <span> 3.6 </span>
            <span class="text-tertiary-400"> [$3.6k] </span>
          </div>
        </div>
        <div class="flex justify-between text-11 leading-4.5">
          <div>
            <span class="font-ibm-medium">Bottom Bid</span>
          </div>
          <div class="text-primary-900 font-ibm">
            <font-awesome-icon :icon="['fab', 'ethereum']" />
            <span> 0.25 </span>
            <span class="text-tertiary-400"> [$785,63] </span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.w-fill {
  width: calc(100% + 4px);
}
</style>
