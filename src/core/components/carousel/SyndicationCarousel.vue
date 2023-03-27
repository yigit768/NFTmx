<script setup>
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import BundleImage from "@/core/components/basic/BundleImage.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftmxProgressBar from "@/core/components/basic/NftmxProgressBar.vue";
import NftmxPriceCommon from "@/core/components/price/NftmxPriceCommon.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxHelp from "@/core/components/basic/NftmxHelp.vue";
import { themeConfig } from "@/core/config/constant";
import { useStore } from "vuex";
import syndicationsService from "@/core/services/market/syndications.service";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";

const props = defineProps({
  carouselPlay: Boolean,
});

const store = useStore();
const syndicationNfts = ref([]);
const innerStyles = ref({});
const step = ref("");
const transitioning = ref(false);
const inner = ref(null);
const left = ref(0);
const anim = ref(null);
const windowWidth = computed(() => store.state.app.windowWidth);
const coinPrice = computed(
  () => store.state.market.coinPrice["BSC_TESTNET"] || 1
);

watchEffect(() => {
  if (!anim.value & props.carouselPlay) {
    anim.value = setInterval(() => {
      left.value = left.value - 1;
      if (left.value < -inner.value.scrollWidth / 2) {
        left.value = 0;
      }
    }, 50);
  } else if (anim.value && !props.carouselPlay) {
    clearInterval(anim.value);
    anim.value = null;
  }
});
onMounted(() => {
  syndicationsService.find().then((res) => {
    syndicationNfts.value = res.data;
  });
});
onUnmounted(() => {
  clearInterval(anim.value);
  anim.value = null;
});
</script>

<template>
  <div class="w-full overflow-hidden">
    <div
      :class="['relative w-full flex inner z-10']"
      :style="{ left: left + 'px' }"
      ref="inner"
    >
      <div
        class="flex"
        v-for="(nft, index) in [...syndicationNfts, ...syndicationNfts]"
        :key="index"
      >
        <div
          class="w-max transition grid sm:grid-cols-2 m-4 cursor-default hover:shadow-[0_0px_12px_0px_rgb(0_0_0_/_0.1),_0_0px_0px_0px_rgb(0_0_0_/_0.1);] hover:shadow-primary-700"
        >
          <bundle-image
            :images="nft.image512"
            class="relative w-70.75 h-70.75 2xl:w-82.5 2xl:h-82.5 overflow-hidden col-span-2 sm:col-span-1"
          />
          <div
            class="relative w-70.75 h-70.75 2xl:w-82.5 2xl:h-82.5 bg-black text-white pt-11.25"
          >
            <div
              class="absolute top-0 -right-1 w-fill h-10 2xl:h-11.25 bg-primary-900 bg-opacity-70 font-ibm-medium text-white text-11 2xl:text-13 flex items-center justify-center"
            >
              <div>
                <font-awesome-icon
                  :icon="['fas', 'shield-alt']"
                  class="text-sm mt-0.5"
                />
                <span> Liquidity Protection </span>
              </div>
              <div
                class="w-2 h-2 absolute right-0.5 -bottom-1 bg-primary-900 rotate-45 -z-10"
              ></div>
            </div>
            <div class="px-6 pt-1.5 pb-4">
              <div class="2xl:py-2.75 text-left font-ibm-medium">
                <div class="text-11 tracking-wider leading-5">
                  <div class="flex justify-between">
                    <span>Period</span>
                    <span class="text-primary-900">
                      {{ (nft.currentOrder.protectionTime / 86400).toFixed() }}
                      Days
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span>Fees</span>
                    <div class="flex items-center">
                      <span class="text-tertiary-400">
                        Slippage
                        {{ 100 - nft.currentOrder.protectionRate }}%
                      </span>
                      <div class="h-2.5 mx-1.5 border-l border-tertiary-400" />
                      <span class="text-primary-900"> Staking {{ 7.5 }}% </span>
                    </div>
                  </div>
                  <div class="border-t border-tertiary-700 mt-2.75 mb-1.5" />
                  <div class="flex justify-between">
                    <span>
                      Syndication Type
                      <nftmx-tooltip
                        text="Syndication type can be either an auction or fixed sale"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'question-circle']"
                          class="text-11 cursor-pointer"
                        />
                      </nftmx-tooltip>
                    </span>
                    <span class="text-primary-900">
                      {{
                        nft.currentOrder.orderType === "1"
                          ? "Auction"
                          : "Fixed sale"
                      }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span>
                      TVL
                      <nftmx-tooltip
                        text="Amount of funds pending in the syndication to purchase the NFT"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'question-circle']"
                          class="text-11 cursor-pointer"
                        />
                      </nftmx-tooltip>
                    </span>
                    <div class="flex items-center">
                      <span class="text-primary-900">
                        <font-awesome-icon :icon="['fab', 'ethereum']" />
                        322.4445
                      </span>
                      <span class="ml-1 text-tertiary-400">
                        [$458,685.29]
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-2.25 2xl:mt-1.25 h-1.75">
                <nftmx-progress-bar />
              </div>
              <div class="mt-2 2xl:mt-3.25 text-11 tracking-wider">
                <div v-if="nft.currentOrder.orderType === '0'">
                  <div class="text-center">Asking price</div>
                  <div class="flex items-end pt-1.75 w-fit mx-auto max-w-full">
                    <div
                      class="flex items-center text-lg text-primary-900 font-ibm-medium"
                    >
                      <font-awesome-icon :icon="['fab', 'ethereum']" />
                      <span class="ml-1">
                        {{ nft.currentOrder.tokenPrice }}
                      </span>
                    </div>
                    <div class="text-tertiary-400">
                      <span class="ml-2">[$</span>
                      <span>
                        {{
                          (nft.currentOrder.tokenPrice * coinPrice).toFixed(1)
                        }}
                      </span>
                      <span>]</span>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="font-ibm text-11 tracking-wider text-center">
                    Current auction ends in
                  </div>
                  <div class="flex justify-center mt-2.75 2xl:mt-2.25">
                    <timer
                      :size="
                        store.state.app.windowWidth >= themeConfig.xl2
                          ? 'head'
                          : 'small'
                      "
                      :time="
                        parseInt(
                          nft.currentOrder.offerClosingTime -
                            new Date().getTime() / 1000
                        )
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute left-0 bottom-0 w-full">
              <router-link
                :to="{
                  name: 'asset',
                  params: {
                    chain: 'BSC-TESTNET',
                    tokenAddress: nft.tokenAddress,
                    tokenId: nft.tokenId,
                  },
                }"
                target="_blank"
              >
                <nftmx-button
                  color="secondary"
                  label="JOIN SYNDICATION"
                  class="font-press w-full text-xs 2xl:text-sm h-12.5 2xl:h-15"
                />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inner {
  transition: transform 5s;
  transition-timing-function: linear;
}
/* optional */
button {
  margin-right: 5px;
  margin-top: 10px;
}
.w-fill {
  width: calc(100% + 4px);
}
</style>
