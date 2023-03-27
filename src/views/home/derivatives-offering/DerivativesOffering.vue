<script setup>
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import InitialOfferingCarousel from "@/core/components/carousel/InitialOfferingCarousel.vue";
import VueSlider from "vue-3-slider-component";
import { ref } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import Cart from "./Cart.vue";

const props = defineProps({
  ledgerPanelVisible: Boolean,
  filterOption: Object,
  isCartOpened: Boolean,
});

const open = ref(false);
const amount = ref(2);
const openDescription = ref(true);

const onClickOutside = () => {
  open.value = false;
};
const handleClick = () => {
  open.value = !open.value;
};
</script>

<template>
  <div :class="[ledgerPanelVisible ? 'lg:pl-5' : 'pl-0', 'flex-1 text-white']">
    <div>
      <div class="flex justify-between pb-2.5">
        <div class="flex gap-4 font-press text-base text-white py-2">
          <span> Derivatives Offering </span>
        </div>
        <div class="flex gap-8 items-center -mt-2.5">
          <div
            class="flex w-68 h-12.5 border border-black divide-x divide-black bg-tertiary-800"
          >
            <div class="bg-black w-12.5 flex items-center justify-center">
              <img src="/images/components/dice_white.png" />
            </div>
            <div class="w-12.5 flex items-center justify-center">
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
                      backgroundColor: '#19cb58',
                    },
                  },
                ]"
                :height="2"
                :processStyle="{ backgroundColor: 'rgb(25 203 88)' }"
                :railStyle="{ backgroundColor: 'rgb(148 148 148)' }"
                tooltip="none"
              >
              </vue-slider>
            </div>
          </div>
          <div class="relative w-60 z-10 h-13.5 pt-1.5">
            <div
              class="absolute w-full z-10 px-5 overflow-hidden bg-tertiary-800"
              v-click-outside="onClickOutside"
            >
              <accordion
                mIcon
                :border="false"
                :sidebar="true"
                v-model="open"
                @handle-click="handleClick"
                handleEmit
                class="w-full"
              >
                <template v-slot:caption>
                  <div class="text-13 font-ibm-medium py-3 mr-4 h-10">
                    2 projects
                  </div>
                </template>
                <div class="pb-2">
                  <div class="text-sm py-2">Bored Ape Yatch Club</div>
                  <div class="text-sm py-2">ABC</div>
                </div>
              </accordion>
            </div>
          </div>
          <div class="flex gap-4 items-center text-sm font-ibm-medium">
            <span class="text-primary-900"> All </span>
            <div
              class="h-6 border-l border-l-black border-r border-r-tertiary-700"
            />
            <span class="text-white"> Auction </span>
            <div
              class="h-6 border-l border-l-black border-r border-r-tertiary-700"
            />
            <span class="text-white"> Asking price </span>
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="flex-1">
          <div class="grid grid-cols-2 gap-6">
            <div
              v-for="(item, index) in 4"
              :key="index"
              class="relative text-white hover:shadow-default hover:shadow-primary-900 border border-black"
            >
              <div
                class="w-2 h-2 absolute -right-0.5 top-9.5 bg-primary-900 bg-opacity-60 rotate-45"
              />
              <!-- <img
          src="/images/landing/hero-image-background-1920.png"
          class="w-full h-full object-center object-cover absolute"
        /> -->
              <div
                class="relative text-white pt-3.5 px-9 pb-7 bg-tertiary-800 h-full"
              >
                <div
                  class="flex items-center justify-end gap-4 text-tertiary-400 pt-14.5"
                >
                  <font-awesome-icon :icon="['fas', 'gavel']" class="text-lg" />
                  <img src="/images/components/dice.png" />
                  <img src="/images/components/opensea-icon.png" />
                  <img src="/images/components/layer.png" />
                  <font-awesome-icon
                    :icon="['fab', 'ethereum']"
                    class="text-xl"
                  />
                </div>
                <div
                  class="relative mt-4 flex items-center gap-4 after:absolute after:top-14 after:h-9.5 after:border-l after:border-l-black after:left-5.5"
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
                  class="relative mt-6.5 pl-16 before:absolute before:left-0 before:top-1/2 before:border-t before:border-b before:border-t-black before:border-b-tertiary-700 before:w-8 before:ml-5.5 after:absolute after:top-13.5 after:h-4 after:border-l after:border-l-black after:left-21"
                >
                  <div class="flex items-center gap-4">
                    <img
                      src="/images/nfts/item1-45x.png"
                      class="w-11.25 h-11.25"
                    />
                    <div class="text-11">
                      <div class="text-tertiary-400">Locked NFT</div>
                      <nftmx-trim-string class="text-white font-ibm-medium">
                        NFT #4555
                      </nftmx-trim-string>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 mt-9">
                  <div
                    v-for="(item, index) in 3"
                    :key="index"
                    class="bg-tertiary-900 text-4xl font-press text-tertiary-700 h-22 flex items-center justify-center"
                  >
                    ?
                  </div>
                </div>
                <div class="mt-10.25">
                  <div class="relative bg-tertiary-700 h-6 mt-9">
                    <div
                      class="h-full bg-primary-900 shadow-default shadow-primary-900"
                      :style="{ width: '70%' }"
                    />
                    <div
                      class="absolute text-xs w-full h-full top-0 left-0 flex justify-center items-center"
                    >
                      <span> Total Sales: </span>
                      <font-awesome-icon
                        :icon="['fab', 'ethereum']"
                        class="mx-1"
                      />
                      <span> 53.6353 [$253.56k] </span>
                    </div>
                  </div>
                  <div class="relative bg-tertiary-700 h-6 mt-2.5">
                    <div
                      class="h-full bg-primary-900 shadow-default shadow-primary-900"
                      :style="{ width: '70%' }"
                    />
                    <div
                      class="absolute text-xs w-full h-full top-0 left-0 flex justify-center items-center"
                    >
                      <span> Supply Available: </span>
                      <span> 146 NFTS [34.56%] </span>
                    </div>
                  </div>
                </div>
                <div class="flex justify-between font-ibm-bold mt-7.75">
                  <span> Offering ends in </span>
                  <timer :time="999999" size="head" />
                </div>
                <div class="flex justify-between mt-10 text-sm">
                  <div class="font-ibm-bold mt-3">Amount of Derivatives</div>
                  <div>
                    <div class="flex items-center w-full">
                      <div
                        class="bg-tertiary-700 w-40 flex-1 shadow-default shadow-tertiary-700"
                      >
                        <nftmx-input
                          class="h-13"
                          number
                          border="none"
                          placeholder="Type amount"
                        />
                      </div>
                      <div
                        class="bg-primary-900 shadow-default shadow-primary-900 h-13 flex items-center justify-center w-24"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'cart-arrow-down']"
                          class="transition text-white cursor-pointer text-lg"
                        />
                      </div>
                    </div>
                    <div class="text-11 mt-2.5">
                      <font-awesome-icon :icon="['fab', 'ethereum']" class="" />
                      <span> 5.345 </span>
                      <span class="text-tertiary-400"> [$14,56k] </span>
                    </div>
                  </div>
                </div>
                <div
                  class="border-t border-t-black border-b border-b-tertiary-700 mt-3.5"
                />
                <div class="mt-3">
                  <accordion
                    mIcon
                    :border="false"
                    :sidebar="true"
                    class="w-full overflow-hidden"
                  >
                    <template #caption="{ open }">
                      <div
                        class="flex justify-between items-center text-15 font-ibm-medium py-3 mr-4 h-10"
                      >
                        <div class="flex items-center gap-4">
                          <div class="w-3 h-3 rounded-full bg-primary-900" />
                          <span> Live #1 </span>
                        </div>
                        <span> {{ open ? "Hide" : "Show" }} </span>
                      </div>
                    </template>
                    <div class="mt-1">
                      <div class="flex justify-between text-sm py-1.25">
                        <span class="text-tertiary-400 font-ibm-medium">
                          Blockchain:
                        </span>
                        <span> Ethereum </span>
                      </div>
                      <div class="flex justify-between text-sm py-1.25">
                        <span class="text-tertiary-400 font-ibm-medium">
                          Amount of derivatives:
                        </span>
                        <span> 10,000 </span>
                      </div>
                      <div class="flex justify-between text-sm py-1.25">
                        <span class="text-tertiary-400 font-ibm-medium">
                          Type of supply:
                        </span>
                        <span> Fractional </span>
                      </div>
                      <div class="flex justify-between text-sm py-1.25">
                        <span class="text-tertiary-400 font-ibm-medium">
                          Type of sale:
                        </span>
                        <span> Auction </span>
                      </div>
                      <div class="flex justify-between text-sm py-1.25">
                        <span class="text-tertiary-400 font-ibm-medium">
                          Fundrasing soft cap:
                        </span>
                        <span>
                          <font-awesome-icon :icon="['fab', 'ethereum']" />
                          <span> 100[$160,000] </span>
                        </span>
                      </div>
                    </div>
                    <div
                      class="border-t border-t-black border-b border-b-tertiary-700 mt-10"
                    />
                    <div class="mt-3">
                      <div
                        class="text-sm py-1.25 text-tertiary-400 font-ibm-medium underline decoration-2"
                      >
                        Multilevel Ownership
                      </div>
                      <div class="flex justify-between text-sm py-1.25 mt-1">
                        <span class="text-tertiary-400 font-ibm-medium">
                          Owners:
                        </span>
                        <span> 1 </span>
                      </div>
                      <div class="flex justify-between text-sm py-1.25">
                        <span class="text-tertiary-400 font-ibm-medium">
                          Total ownership:
                        </span>
                        <span> 20% </span>
                      </div>
                    </div>
                    <div
                      class="border-t border-t-black border-b border-b-tertiary-700 mt-4"
                    />
                    <div class="mt-2">
                      <div
                        class="text-sm py-1.25 text-tertiary-400 font-ibm-medium underline decoration-2"
                      >
                        100% Liquidity Protection
                      </div>
                      <div class="flex justify-between text-sm py-1.25 mt-1">
                        <span class="text-tertiary-400 font-ibm-medium">
                          Maximum Period:
                        </span>
                        <span> 365 days </span>
                      </div>
                      <div class="flex justify-between text-sm py-1.25">
                        <span class="text-tertiary-400 font-ibm-medium">
                          Minimum Fees:
                        </span>
                        <span> slippage 10% | staking leverage </span>
                      </div>
                    </div>
                  </accordion>
                </div>
              </div>
              <div
                class="absolute top-0 -right-1 h-10.5 w-fill items-center text-sm text-white leading-4"
              >
                <div
                  class="px-6 bg-primary-900 bg-opacity-60 h-full flex items-center justify-center"
                >
                  <font-awesome-icon :icon="['fas', 'shield-alt']" />
                  <span>
                    100% Liquidity Protection | 365 Days | 10% Slippage | 20%
                    Ownership
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <cart :nftCart="isCartOpened" :chain="filterOption.chain" />
      </div>
    </div>
  </div>
</template>
