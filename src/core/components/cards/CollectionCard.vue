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
    class="w-full relative font-ibm-medium p-3"
  >
    <div
      class="hover:shadow-default hover:shadow-primary-900 transition grid grid-cols-5 h-75"
    >
      <div class="bg-black relative col-span-2">
        <bundle-image
          class="absolute top-0 left-0"
          :images="
            collection.nftImages && collection.nftImages.length > 0
              ? collection.nftImages
              : ''
          "
        />
      </div>
      <div class="relative col-span-3">
        <div
          class="w-2 h-2 absolute -right-0.5 top-9.5 bg-primary-900 bg-opacity-60 rotate-45"
        />
        <div class="relative bg-tertiary-700 px-5 pt-17.25 h-full">
          <div class="flex gap-4 w-full overflow-hidden">
            <div class="w-11 h-11 bg-black">
              <nftmx-img
                :src="collection.logoUrl"
                class="w-full h-full object-cover object-center"
              />
            </div>
            <div class="grow">
              <div class="text-tertiary-400 text-xs">Created by</div>
              <nftmx-trim-string
                :line="1"
                class="text-white text-lg mt-2.25 leading-5"
              >
                {{ collection.name }}
              </nftmx-trim-string>
            </div>
            <div>
              <span class="text-11 text-tertiary-400"> 55 </span>
              <font-awesome-icon
                :icon="['fas', 'thumbs-up']"
                class="text-sm text-primary-900"
              />
            </div>
          </div>
          <div class="flex gap-2 items-center mt-4.5 mb-1">
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
          <div class="flex justify-between text-11 text-white">
            <div>
              <span class="font-ibm-medium">Maximum Period</span>
              <nftmx-tooltip
                text="Maximum protection period in this collection"
              >
                <font-awesome-icon
                  :icon="['fas', 'question-circle']"
                  class="ml-1 text-10 cursor-pointer"
                />
              </nftmx-tooltip>
            </div>
            <div class="text-primary-900 font-ibm">365 Days</div>
          </div>
          <div class="flex justify-between text-11 text-white">
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
              <span> Staking leverage </span>
            </div>
          </div>
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0 mt-3.5"
          />
          <div class="grid grid-cols-2 gap-6 mt-3.5 text-11 text-white">
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">Items/Listing</span>
              </div>
              <div class="text-primary-900 font-ibm">
                <span> 103.4k </span>
                <span class="text-tertiary-400"> [1.23%] </span>
              </div>
            </div>
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">Bottom Bid</span>
              </div>
              <div class="text-primary-900 font-ibm">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                <span> 0.1253 </span>
                <span class="text-tertiary-400"> [$0.33k] </span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6 text-11 text-white">
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">Owners/Unique</span>
              </div>
              <div class="text-primary-900 font-ibm">
                <span> 18.5k </span>
                <span class="text-tertiary-400"> [32.23%] </span>
              </div>
            </div>
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">Floor Price</span>
              </div>
              <div class="text-primary-900 font-ibm">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                <span> 0.2556 </span>
                <span class="text-tertiary-400"> [$0.63k] </span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6 text-11 text-white">
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">7D Volume</span>
              </div>
              <div class="text-primary-900 font-ibm">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                <span> 35.5634 </span>
                <span class="text-tertiary-400"> [$256.52k] </span>
              </div>
            </div>
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">Floor Change</span>
              </div>
              <div class="text-primary-900 font-ibm">
                <span> +5% </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="absolute top-0 -right-1 w-fill h-10.5 bg-primary-900 bg-opacity-60 px-4 flex gap-2 items-center text-sm text-white leading-4 justify-center"
        >
          <font-awesome-icon :icon="['fas', 'shield-alt']" />
          <span> 100% Liquidity Protection </span>
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
