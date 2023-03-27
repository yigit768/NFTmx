<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import BodyContainer from "@/core/container/BodyContainer.vue";
import Assets from "./Assets.vue";
import SyndicationCarousel from "@/core/components/carousel/SyndicationCarousel.vue";
import Analyzer from "./Analyzer.vue";
import BackerCarousel from "@/core/components/carousel/BackerCarousel.vue";
import Collections from "./Collections.vue";
import Ledger from "./Ledger.vue";
import MemoryGame from "@/core/components/memory-game/MemoryGame.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import AllSearchOption from "./search-option/AllSearchOption.vue";
import InitialOfferingSearchOption from "./initial-offering/InitialOfferingSearchOption.vue";
import DerivativesOfferingSearchOption from "./derivatives-offering/DerivativesOfferingSearchOption.vue";
import SubCollectionsSearchOption from "./sub-collections/SubCollectionSearchOption.vue";
import DerivativesSearchOption from "./derivatives/DerivativeSearchOption.vue";
import NftSearchOption from "./search-option/NftSearchOption.vue";
import CollectionSearchOption from "./search-option/CollectionSearchOption.vue";
import CheckLiquidity from "./CheckLiquidity.vue";
import { useRoute, useRouter } from "vue-router";
import AllTabs from "./AllTabs.vue";
import InitialOffering from "./initial-offering/InitialOffering.vue";
import DerivativesOffering from "./derivatives-offering/DerivativesOffering.vue";
import SubCollections from "./sub-collections/SubCollections.vue";
import DerivativesCollection from "./derivatives/DerivativesCollection.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();
const tab = ref(route.query.tab);
const stats = {
  collections: 443,
  nfts: 39570193,
};
const nftCart = ref(false);

const filterActive = ref(false);
const ledgerPanelVisible = ref(false);
const nftFilterOption = ref({
  chain: "",
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
  collection: [],
  sortBy: "",
  hashtag: "",
});
const collectionFilterOption = ref({
  chain: "",
  name: "",
  min: null,
  max: null,
  sortBy: "",
});
const viewOption = ref("TILE");
const nftCartChain = ref("ETHEREUM");

const carouselPlay = ref(true);
const collections = ref([]);

const selectTab = (value) => {
  router.replace(`/home?tab=${value}`);
  tab.value = value;
  if (value === "NFTS") {
    ledgerPanelVisible.value = true;
  } else {
    ledgerPanelVisible.value = false;
    nftCart.value = false;
  }
};
const applyNftFiltering = (option) => {
  nftFilterOption.value = option;
  if (option.chain !== nftCartChain.value) {
    nftCartChain.value = option.chain;
  }
};
const applyCollectionFiltering = (option) => {
  collectionFilterOption.value = option;
};
const showNftCart = () => {
  nftCart.value = !nftCart.value;
};
const clickFilter = () => {
  filterActive.value = !filterActive.value;
};
const toggleLedgerPanel = () => {
  ledgerPanelVisible.value = !ledgerPanelVisible.value;
};
const changeView = (val) => {
  viewOption.value = val;
};
</script>

<template>
  <div
    class="bg-black md:bg-[url('/images/landing/hero-background.png')] bg-no-repeat bg-cover bg-right font-press text-white w-full"
  >
    <div
      class="flex flex-col lg:flex-row h-full items-center justify-center px-4 lg:px-20"
    >
      <div class="text-xl xl:text-2xl text-shadow py-10 lg:py-0">
        <div class="flex items-start 3xl:items-end gap-3.5">
          <nftmx-img src="/images/landing/nftmx.png" />
          <p>Buy NFTs with 100% Liquidity Protection</p>
        </div>
        <div class="flex items-start 3xl:items-end gap-3.5">
          <nftmx-img src="/images/landing/nftmx.png" />
          <p>Make Unlimited Offers with Your Vault</p>
        </div>
        <div class="flex items-start 3xl:items-end gap-3.5 mt-1.5">
          <nftmx-img src="/images/landing/nftmx.png" />
          <p>Sell NFTs and Keep Multilevel Ownership</p>
        </div>
        <div class="flex items-start 3xl:items-end gap-3.5 mt-1.5">
          <nftmx-img src="/images/landing/nftmx.png" />
          <p>Invest Via Automated Decentralized VC</p>
        </div>
        <div class="flex items-start 3xl:items-end gap-3.5 mt-1.5">
          <nftmx-img src="/images/landing/nftmx.png" />
          <p>Fork NFTs Into Derivatives Subcollection</p>
        </div>
        <div class="flex items-start 3xl:items-end gap-3.5 mt-1.5">
          <nftmx-img src="/images/landing/nftmx.png" />
          <p>Conduct Initial or Derivatives Offering</p>
        </div>
        <div
          class="flex items-start 3xl:items-end gap-3.5 mt-1.5 text-primary-900"
        >
          <nftmx-img src="/images/landing/nftmx.png" />
          <p>Forever Sell NFT P2P with 0% Fee</p>
        </div>
      </div>
      <memory-game class="2xl:ml-40" />
    </div>
  </div>
  <body-container :padding="false" footerExtended>
    <div class="pt-6 pb-5 sm:py-4.25 sm:pb-3.25">
      <syndication-carousel :carouselPlay="carouselPlay" />
    </div>
    <div class="bg-tertiary-800 border border-black pt-3.5">
      <backer-carousel :carouselPlay="carouselPlay" />
      <div
        class="w-full flex gap-6 justify-center text-tertiary-600 text-sm pt-1 pb-6"
      >
        <font-awesome-icon
          v-if="!carouselPlay"
          :icon="['fas', 'play']"
          class="text-primary-900 cursor-pointer transition hover:text-primary-900"
          @click="carouselPlay = true"
        />
        <font-awesome-icon
          v-if="carouselPlay"
          :icon="['fas', 'pause']"
          class="cursor-pointer transition hover:text-primary-900"
          @click="carouselPlay = false"
        />
      </div>
    </div>
    <analyzer />
    <div id="home_content">
      <!-- <div
        class="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 text-center text-sm font-press mt-2"
      > -->
      <div class="grid grid-cols-2 text-center text-sm font-press mt-2">
        <!-- <div
          @click="selectTab('INITIAL_OFFERING')"
          :class="[
            tab === 'INITIAL_OFFERING'
              ? 'text-primary-900 border-primary-900'
              : 'text-white border-white hover:text-primary-900 hover:border-primary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>Initial Offering</div>
          <div>
            {{ stats.collections.toLocaleString() }}
          </div>
        </div> -->
        <div
          @click="selectTab('COLLECTIONS')"
          :class="[
            tab === 'COLLECTIONS'
              ? 'text-primary-900 border-primary-900'
              : 'text-white border-white hover:text-primary-900 hover:border-primary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>Collections</div>
          <div>
            {{ stats.collections.toLocaleString() }}
          </div>
        </div>
        <div
          @click="selectTab('NFTS')"
          :class="[
            tab === 'NFTS'
              ? 'text-primary-900 border-primary-900'
              : 'text-white border-white hover:text-primary-900 hover:border-primary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>NFTs</div>
          <div>
            {{ stats.nfts.toLocaleString() }}
          </div>
        </div>
        <!-- <div
          @click="selectTab('DERIVATIVES_OFFERING')"
          :class="[
            tab === 'DERIVATIVES_OFFERING'
              ? 'text-secondary-900 border-secondary-900'
              : 'text-white border-white hover:text-secondary-900 hover:border-secondary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>Derivatives Offering</div>
          <div>
            {{ stats.nfts.toLocaleString() }}
          </div>
        </div>
        <div
          @click="selectTab('SUB_COLLECTIONS')"
          :class="[
            tab === 'SUB_COLLECTIONS'
              ? 'text-secondary-900 border-secondary-900'
              : 'text-white border-white hover:text-secondary-900 hover:border-secondary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>Subcollections</div>
          <div>
            {{ stats.nfts.toLocaleString() }}
          </div>
        </div>
        <div
          @click="selectTab('DERIVATIVES')"
          :class="[
            tab === 'DERIVATIVES'
              ? 'text-secondary-900 border-secondary-900'
              : 'text-white border-white hover:text-secondary-900 hover:border-secondary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>Derivatives</div>
          <div>
            {{ stats.nfts.toLocaleString() }}
          </div>
        </div> -->
      </div>
      <initial-offering-search-option
        v-if="tab === 'INITIAL_OFFERING'"
        :filterOption="nftFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="applyNftFiltering"
        @show-cart="showNftCart"
        :nftCart="nftCart"
      />
      <collection-search-option
        v-else-if="tab === 'COLLECTIONS'"
        :filterOption="collectionFilterOption"
        :viewOption="viewOption"
        @apply-filter="applyCollectionFiltering"
        @change-view="changeView"
      />
      <nft-search-option
        v-else-if="tab === 'NFTS'"
        :filterOption="nftFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="applyNftFiltering"
        @show-cart="showNftCart"
        :nftCart="nftCart"
      />
      <derivatives-offering-search-option
        v-else-if="tab === 'DERIVATIVES_OFFERING'"
        :filterOption="nftFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="applyNftFiltering"
        @show-cart="showNftCart"
        :nftCart="nftCart"
      />
      <sub-collections-search-option
        v-else-if="tab === 'SUB_COLLECTIONS'"
        :filterOption="nftFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="applyNftFiltering"
        @show-cart="showNftCart"
        :nftCart="nftCart"
      />
      <derivatives-search-option
        v-else-if="tab === 'DERIVATIVES'"
        :filterOption="nftFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="applyNftFiltering"
        @show-cart="showNftCart"
        :nftCart="nftCart"
      />
      <all-search-option
        v-else
        :filterOption="nftFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="applyNftFiltering"
        @show-cart="showNftCart"
        :nftCart="nftCart"
      />
    </div>
    <div
      :class="[
        tab === 'COLLECTIONS' ? 'pb-38.5' : 'pb-4 lg:pb-41',
        'relative lg:flex justify-center px-4 sm:px-10 pt-6.5  lg:px-22',
      ]"
    >
      <ledger
        :ledgerPanelVisible="ledgerPanelVisible"
        :tab="tab"
        @toggle-ledger-panel="toggleLedgerPanel"
      />
      <initial-offering
        :ledgerPanelVisible="ledgerPanelVisible"
        v-if="tab === 'INITIAL_OFFERING'"
        :filterOption="nftFilterOption"
        :isCartOpened="nftCart"
        :viewOption="viewOption"
      />
      <collections
        v-else-if="tab === 'COLLECTIONS'"
        :ledgerPanelVisible="ledgerPanelVisible"
        :collectionFilterOption="collectionFilterOption"
        :viewOption="viewOption"
      />
      <assets
        :ledgerPanelVisible="ledgerPanelVisible"
        v-else-if="tab === 'NFTS'"
        :filterOption="nftFilterOption"
        :isCartOpened="nftCart"
        :viewOption="viewOption"
      />
      <derivatives-offering
        :ledgerPanelVisible="ledgerPanelVisible"
        v-else-if="tab === 'DERIVATIVES_OFFERING'"
        :filterOption="nftFilterOption"
        :isCartOpened="nftCart"
        :viewOption="viewOption"
      />
      <sub-collections
        :ledgerPanelVisible="ledgerPanelVisible"
        v-else-if="tab === 'SUB_COLLECTIONS'"
        :collectionFilterOption="collectionFilterOption"
        :isCartOpened="nftCart"
        :viewOption="viewOption"
      />
      <derivatives-collection
        :ledgerPanelVisible="ledgerPanelVisible"
        v-else-if="tab === 'DERIVATIVES'"
        :filterOption="nftFilterOption"
        :isCartOpened="nftCart"
        :viewOption="viewOption"
      />
      <all-tabs
        v-else
        :ledgerPanelVisible="ledgerPanelVisible"
        :filterOption="nftFilterOption"
        :isCartOpened="nftCart"
      />
    </div>
    <check-liquidity />
  </body-container>
</template>
