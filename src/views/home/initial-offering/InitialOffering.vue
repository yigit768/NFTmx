<script setup>
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import InitialOfferingCarousel from "@/core/components/carousel/InitialOfferingCarousel.vue";
import VueSlider from "vue-3-slider-component";
import { ref } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import Cart from "./Cart.vue";
import PublicSaleCard from "./PublicSaleCard.vue";

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
      <div class="flex justify-between">
        <div class="flex gap-4 font-press text-base text-white py-3">
          <span> Live Now </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span> Coming Soon </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span> Past </span>
        </div>
        <div class="relative w-60 z-10 h-13.5">
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
      </div>
      <div class="flex justify-between">
        <div class="flex gap-4 font-ibm-medium text-sm text-white py-3">
          <span>
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <span> 100% Liquidity Protection </span>
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span class="text-tertiary-400">
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <span> Multilevel Ownership </span>
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span class="text-tertiary-400"> Individual Supply </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span class="text-tertiary-400"> Fractional Supply </span>
        </div>
        <div class="flex gap-8">
          <div
            class="flex w-68 h-12.5 border border-black divide-x divide-black bg-tertiary-800"
          >
            <div class="bg-black w-12.5 flex items-center justify-center">
              s
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
      <div
        v-if="openDescription"
        class="relative border border-black pt-6.5 pl-6.5 pb-10 pr-10 bg-tertiary-800 mt-8 text-tertiary-400 text-sm leading-6"
      >
        Reverse Market Making (RMM) is a liquidity solution for NFTs that
        provides instant liquidity through a smart contract without the need for
        a counterparty buyer. RMM is designed to provide 100% liquidity
        protection for buyers and allows sellers to act as market makers, which
        reduces the barried to entry for NFT trading. <br /><br />
        Example: <br />
        <div class="flex gap-4 mt-2">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Bob seeks to sell his NFT for $1,000 while simultaneously earning a
            reward for acting as a market maker for future buyers. He employs
            Reverse Market Making (RMM) to provide the future buyer with
            complete liquidity protection fo 90 days, in exchange for a 5%
            slippage fee in case of cancellation. This ensures that even in the
            event of a canceled sale, Bob still earns a 5% profit over 90 days,
            equating to a 20% annual percentage yield (APY).
          </p>
        </div>
        <br />
        <div class="flex gap-4">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Lisa decided to purchase Bob's NFT for $1,000 and transfers her
            funds to a Liquidity Protection smart contract acting as a
            safeguard. If Lisa finalizes the transaction, she will only have to
            pay the base price of $1,000 to Bos. However, if market conditions
            deteriorate or if Lisa is unable to resell the NFT, she has the
            option to reverse the transaction and receive a full refund of her
            funds, minus any applicable fees and slippage.
          </p>
        </div>
        <div
          @click="openDescription = false"
          class="absolute top-0 right-0 bg-black px-2.25 py-0.75 text-white hover:text-red-900 cursor-pointer transition"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
        </div>
      </div>
      <div class="flex">
        <div class="flex-1">
          <public-sale-card v-for="(item, index) in 2" :key="index" />
          <div
            v-for="(item, index) in 2"
            :key="index"
            class="relative bg-black text-white mt-10 hover:shadow-default hover:shadow-primary-900 h-141.5"
          >
            <div
              class="w-2 h-2 absolute -left-0.5 top-9.5 bg-primary-900 bg-opacity-60 rotate-45"
            />
            <img
              src="/images/landing/hero-image-background-1920.png"
              class="w-full h-full object-center object-cover absolute"
            />
            <div
              class="absolute top-0 -left-1 h-10.5 w-full flex gap-2 items-center text-sm text-white leading-4 justify-between"
            >
              <div
                class="px-6 bg-primary-900 bg-opacity-60 h-full flex items-center justify-center shadow-default shadow-primary-900"
              >
                <font-awesome-icon :icon="['fas', 'shield-alt']" />
                <span>
                  100% Liquidity Protection | 365 Days | 10% Slippage | 20%
                  Ownership
                </span>
              </div>
              <div class="flex items-center gap-4 text-tertiary-400 mr-10 mt-2">
                <font-awesome-icon :icon="['fas', 'tag']" class="text-xl" />
                <font-awesome-icon :icon="['fas', 'gavel']" class="text-xl" />
                <font-awesome-icon
                  :icon="['fas', 'shield-alt']"
                  class="text-xl"
                />
                <img src="/images/components/opensea-icon.png" />
                <font-awesome-icon
                  :icon="['fas', 'layer-group']"
                  class="text-xl"
                />
                <font-awesome-icon
                  :icon="['fab', 'ethereum']"
                  class="text-2xl"
                />
              </div>
            </div>
            <div class="relative grid grid-cols-2 text-white pt-20">
              <div class="px-13 border-r border-r-black">
                <div class="flex items-center gap-8">
                  <img src="/images/nfts/item1-45x.png" class="w-21 h-21" />
                  <div>
                    <div class="flex font-press text-lg">
                      <nftmx-trim-string
                        class="text-white text-lg mt-2.25 leading-5"
                      >
                        Bored Ape Yatch Club
                      </nftmx-trim-string>
                      <font-awesome-icon
                        :icon="['fas', 'external-link-alt']"
                        class="relative text-xs"
                      />
                    </div>
                    <div class="text-sm mt-3.5">
                      <span class="text-tertiary-400"> Created by </span>
                      <span class="text-primary-900"> TomSachsDeployer </span>
                    </div>
                  </div>
                </div>
                <div class="text-sm font-ibm mt-6 leading-6">
                  <nftmx-trim-string :line="2">
                    BAYC is a collection of 10,000 Bored Ape NFTs-unique digital
                    collectibles living on the Ethereum
                  </nftmx-trim-string>
                </div>
                <div class="flex justify-between items-center text-sm mt-7">
                  <div
                    class="flex justify-center sm:justify-start border border-black divide-x divide-black cursor-pointer"
                  >
                    <div
                      class="transition w-8 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
                    >
                      <font-awesome-icon :icon="['fas', 'globe']" />
                    </div>
                    <div
                      class="transition w-7.75 h-8 px-2.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
                    >
                      <font-awesome-icon :icon="['fab', 'twitter']" />
                    </div>
                    <div
                      class="transition w-7.75 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
                    >
                      <font-awesome-icon :icon="['fab', 'medium-m']" />
                    </div>
                    <div
                      class="transition w-7.75 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
                    >
                      <font-awesome-icon :icon="['fab', 'telegram-plane']" />
                    </div>
                    <div
                      class="transition w-7.75 h-8 px-1.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
                    >
                      <font-awesome-icon :icon="['fab', 'discord']" />
                    </div>
                    <div
                      class="transition w-7.5 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
                    >
                      <font-awesome-icon :icon="['fab', 'instagram']" />
                    </div>
                    <div
                      class="transition w-7.5 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
                    >
                      <font-awesome-icon :icon="['fas', 'edit']" />
                    </div>
                  </div>
                  <div class="text-primary-900">
                    <span> Details </span>
                    <font-awesome-icon :icon="['fas', 'copy']" />
                  </div>
                </div>
              </div>
              <div class="px-13 pt-3.75 border-l border-l-tertiary-700">
                <div class="flex justify-between font-ibm-bold">
                  <span> Offering ends in </span>
                  <timer :time="999999" size="head" />
                </div>
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
                <div class="flex justify-between mt-10 text-sm">
                  <div class="font-ibm-bold mt-3">Amount of NFTs</div>
                  <div>
                    <div class="flex items-center w-full">
                      <div
                        class="bg-tertiary-700 w-40 flex-1 shadow-default shadow-tertiary-700"
                      >
                        <nftmx-input
                          class="h-11.5"
                          number
                          border="none"
                          placeholder="Type amount"
                        />
                      </div>
                      <div
                        class="bg-primary-900 shadow-default shadow-primary-900 h-11.5 flex items-center justify-center w-24"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'cart-arrow-down']"
                          class="transition text-white cursor-pointer text-lg"
                        />
                      </div>
                    </div>
                    <div class="text-11">
                      <font-awesome-icon :icon="['fab', 'ethereum']" class="" />
                      <span> 5.345 </span>
                      <span class="text-tertiary-400"> [$14,56k] </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="relative text-11 px-13 mt-7.5">
              Choose NFTs manually
            </div>
            <div class="h-41 w-full mt-3.5">
              <initial-offering-carousel
                :images="[
                  '/images/nfts/img1.png',
                  '/images/nfts/img2.png',
                  '/images/nfts/img3.png',
                  '/images/nfts/img4.png',
                  '/images/nfts/img5.png',
                  '/images/nfts/img6.png',
                  '/images/nfts/img7.png',
                  '/images/nfts/img8.png',
                ]"
              />
            </div>
          </div>
        </div>
        <cart :nftCart="isCartOpened" :chain="filterOption.chain" />
      </div>
    </div>
  </div>
</template>
