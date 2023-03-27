<script setup>
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import InitialOfferingCarousel from "@/core/components/carousel/InitialOfferingCarousel.vue";
import FilterAssets from "./FilterAssets.vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import Derivatives from "./derivatives/Derivatives.vue";
import SubCollectionCard from "@/core/components/cards/SubCollectionCard.vue";
import { computed, onMounted, ref, watchEffect } from "vue";
import marketService from "@/core/services/market.service";
import { themeConfig } from "@/core/config/constant";
import { useStore } from "vuex";

const props = defineProps({
  ledgerPanelVisible: Boolean,
  filterOption: Object,
  isCartOpened: Boolean,
});

const contracts = ref([]);
const loadingContract = ref(true);
const displaySubCollectionLimit = ref(1);
const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);

const initialContracts = async () => {
  loadingContract.value = true;
  marketService
    .getContracts({
      ...props.filterOption,
      limit: 5,
    })
    .then((res) => {
      contracts.value = res.data.contracts;
    })
    .catch((err) => {})
    .finally(() => {
      loadingContract.value = false;
    });
};

onMounted(() => {
  initialContracts();
});
const setLimitValue = (value) => {
  displaySubCollectionLimit.value = value;
};
watchEffect(() => {
  if (windowWidth.value >= themeConfig.xl3) {
    props.ledgerPanelVisible ? setLimitValue(4) : setLimitValue(5);
  } else if (windowWidth.value >= themeConfig.xl) {
    props.ledgerPanelVisible ? setLimitValue(3) : setLimitValue(4);
  } else if (windowWidth.value >= themeConfig.lg) {
    props.ledgerPanelVisible ? setLimitValue(2) : setLimitValue(3);
  } else if (windowWidth.value >= themeConfig.sm && !props.ledgerPanelVisible) {
    setLimitValue(2);
  } else {
    setLimitValue(1);
  }
});
</script>

<template>
  <div :class="[ledgerPanelVisible ? 'lg:pl-5' : 'pl-0', 'flex-1 text-white']">
    <div class="font-press text-sm py-2.75">
      Initial Offering
      <font-awesome-icon
        :icon="['fas', 'external-link-alt']"
        class="relative -top-2 text-xs"
      />
    </div>
    <div
      class="relative bg-black text-white mt-3.25 hover:shadow-default hover:shadow-primary-900 h-141.5"
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
            100% Liquidity Protection | 365 Days | 10% Slippage | 20% Ownership
          </span>
        </div>
        <div class="flex items-center gap-4 text-tertiary-400 mr-10 mt-2">
          <font-awesome-icon :icon="['fas', 'tag']" class="text-xl" />
          <font-awesome-icon :icon="['fas', 'gavel']" class="text-xl" />
          <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-xl" />
          <img src="/images/components/opensea-icon.png" />
          <font-awesome-icon :icon="['fas', 'layer-group']" class="text-xl" />
          <font-awesome-icon :icon="['fab', 'ethereum']" class="text-2xl" />
        </div>
      </div>
      <div class="relative grid grid-cols-2 text-white pt-20">
        <div class="px-13 border-r border-r-black">
          <div class="flex items-center gap-8">
            <img src="/images/nfts/item1-45x.png" class="w-21 h-21" />
            <div>
              <div class="flex font-press text-lg">
                <nftmx-trim-string class="text-white text-lg mt-2.25 leading-5">
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
              <font-awesome-icon :icon="['fab', 'ethereum']" class="mx-1" />
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
      <div class="relative text-11 px-13 mt-7.5">Choose NFTs manually</div>
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
    <div class="-mx-4">
      <filter-assets
        title="NFTs"
        :filterOption="{ chain: 'ETHEREUM', sortBy: 'VIEW' }"
        :ledgerPanelVisible="ledgerPanelVisible"
        :isCartOpened="isCartOpened"
        viewOption="TILE"
      />
    </div>
    <div class="border-t border-black" />
    <div class="font-press text-sm py-2.75 mt-6">
      Derivatives Offering
      <font-awesome-icon
        :icon="['fas', 'external-link-alt']"
        class="relative -top-2 text-xs"
      />
    </div>
    <div class="grid grid-cols-2 gap-6">
      <div
        v-for="(item, index) in 2"
        :key="index"
        class="relative text-white mt-3.25 hover:shadow-default hover:shadow-primary-900 border border-black"
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
            <font-awesome-icon :icon="['fab', 'ethereum']" class="text-xl" />
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
              <img src="/images/nfts/item1-45x.png" class="w-11.25 h-11.25" />
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
                <font-awesome-icon :icon="['fab', 'ethereum']" class="mx-1" />
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
    <div class="-mx-4">
      <derivatives
        title="Derivatives NFTs"
        :filterOption="{ chain: 'ETHEREUM', sortBy: 'VIEW' }"
        :ledgerPanelVisible="ledgerPanelVisible"
        :isCartOpened="isCartOpened"
        viewOption="TILE"
      />
    </div>
    <div class="border-t border-black mt-8" />
    <div class="flex-1 -mx-2.5 -mb-2.5 overflow-auto mt-8">
      <div>
        <div class="font-press text-base text-white px-2">Subcollections</div>
        <div
          :class="[
            ledgerPanelVisible
              ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5',
            'grid pt-0.75',
          ]"
        >
          <sub-collection-card
            v-for="(contract, index) in contracts.slice(
              0,
              displaySubCollectionLimit
            )"
            :key="index"
            :collection="contract"
          />
        </div>
      </div>
      <div
        v-if="loadingContract"
        class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
      >
        Loading...
      </div>
      <div
        v-if="!loadingContract && contracts.length === 0"
        class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
      >
        No Subcollections found
      </div>
    </div>
  </div>
</template>

<style scoped>
.w-fill {
  width: calc(100% + 4px);
}
</style>
