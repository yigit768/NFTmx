<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import { capitalize } from "lodash";
import {
  themeConfig,
  BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import InsideModal from "@/core/components/modal/InsideModal.vue";
import ListGroupItem from "@/core/components/basic/ListGroupItem.vue";
import ListGroupSubItem from "@/core/components/basic/ListGroupSubItem.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { useToast } from "vue-toastification";
import ItemReportModal from "@/core/components/modal/ItemReportModal.vue";
import Ribbon from "@/core/components/basic/Ribbon.vue";
import CardCarousel from "@/core/components/carousel/CardCarousel.vue";
import Jazzicon from "@/core/components/jazzicon/Jazzicon.vue";
import { useRoute } from "vue-router";
import { getChainKey } from "@/core/utils/common";
import { shortenAddress } from "vue-dapp";

const props = defineProps({
  asset: Object,
  currentSale: Object,
});

const store = useStore();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const toast = useToast();
const open = ref(false);
const tab = ref("Please select");
const currentHref = ref(null);
const openShare = ref(false);
const previewShare = ref(false);
const assetDetailTabs = [
  "NFT details",
  "Subcollection",
  "Liquidity Protection",
];
const route = useRoute();
const chain = route.params.chain.toUpperCase();
const chainKey = getChainKey(chain);
const openItemReportModal = ref(false);
const tokenImage = computed(() => {
  if (props.asset.nfts) {
    return props.asset.nfts.map((nft) => nft.image512);
  } else {
    return [];
  }
});

const handleClick = () => {
  open.value = !open.value;
};
const selectTab = (value) => {
  tab.value = value || "Please select";
  open.value = false;
};
const cancelNFT = () => {};
onMounted(() => {
  currentHref.value = window.location.href;
});
const onCopy = (e) => {
  toast.success("Link is copied");
};
const refresh = () => {
  toast.success(
    "We've queued this item for an update! Check back in a minute..."
  );
};
</script>

<template>
  <div class="h-full flex flex-col lg:pr-2">
    <div
      :class="[
        !currentSale &&
        asset.owner &&
        asset.owner.walletAddress === walletAddress
          ? 'h-[520px]'
          : '',
        'relative overflow-hidden w-full min-h-[315px] lg:min-h-[490px] max-h-[520px] flex-grow border border-black text-11 tracking-wider font-ibm bg-black',
      ]"
    >
      <ribbon big class="z-10" />
      <div
        v-if="tokenImage && tokenImage.length > 0"
        class="w-full h-full absolute text-8xl"
      >
        <card-carousel :images="tokenImage" />
      </div>
      <nftmx-img
        v-else
        :src="asset.image512"
        class="w-full h-full absolute object-cover text-8xl"
      />
      <inside-modal
        :title="capitalize(tab)"
        v-if="tab === assetDetailTabs[0]"
        @select-tab="selectTab"
      >
        <div>
          <div class="flex justify-between">
            <span>Creator:</span>
            <nftmx-img :src="asset.creator.profile_img" class="w-13 h-13" />
          </div>
          <div class="flex justify-between mt-4">
            <span>Creator name:</span>
            <span>
              <span class="text-tertiary-400">{{
                asset.creator.name || "Unnamed"
              }}</span>
              <span class="text-tertiary-600"> | </span>
              <a
                v-if="asset.creator"
                target="_blank"
                :href="'/account/' + asset.creator.walletAddress"
                class="text-primary-900"
              >
                {{
                  asset.creator.name ||
                  shortenAddress(asset.creator.walletAddress)
                }}
              </a>
            </span>
          </div>
          <div class="flex justify-between mt-4">
            <span>Owner name:</span>
            <span>
              <span class="text-tertiary-400">{{
                asset.owner.name || "Unnamed"
              }}</span>
              <span class="text-tertiary-600"> | </span>
              <a
                v-if="asset.owner"
                target="_blank"
                :href="'/account/' + asset.owner.walletAddress"
                class="text-primary-900"
              >
                {{
                  asset.owner.name || shortenAddress(asset.owner.walletAddress)
                }}
              </a>
            </span>
          </div>
          <div class="flex justify-between mt-4">
            <span>Collection name:</span>
            <a
              v-if="asset.contract"
              target="_blank"
              :href="`/collection/${chain}/${asset.contract.address}`"
              class="text-primary-900"
            >
              {{
                asset.contract.name || shortenAddress(asset.contract.address)
              }}
            </a>
          </div>
          <div class="mt-4">About the collection:</div>
          <div class="text-tertiary-500 mt-4">
            {{ asset.description }}
          </div>
          <div class="mt-4">Hashtags #</div>
          <div
            v-if="asset.hashtags"
            class="text-tertiary-500 mt-4 w-full flex flex-wrap gap-2.5"
          >
            <div
              v-for="(item, index) in asset.hashtags"
              :key="index"
              class="px-2 bg-tertiary-700"
            >
              #{{ item.name }}
            </div>
          </div>
        </div>
      </inside-modal>
      <inside-modal
        :title="capitalize(tab)"
        v-if="tab === assetDetailTabs[1]"
        @select-tab="selectTab"
      >
        <div>
          <div class="flex justify-between">
            <span>Amount of derivatives:</span>
            <span class="text-tertiary-400">100</span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Derivatives ever sold:</span>
            <span class="text-tertiary-400">26 / 26%</span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Derivatives under contract:</span>
            <span class="text-tertiary-400">10 / 10%</span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Total value locked under Liquidity Protection:</span>
            <span class="text-tertiary-400">5 ETH [$5,000]</span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>All time APY income stream:</span>
            <span class="text-tertiary-400">0.25 ETH ($250.0)</span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Available derivatives for sale:</span>
            <span class="text-tertiary-400">74 / 74%</span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Listing:</span>
            <span class="text-tertiary-400">20</span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Floor price:</span>
            <span class="text-tertiary-400">1 ETH [$1,000]</span>
          </div>
        </div>
      </inside-modal>
      <inside-modal
        :title="capitalize(tab)"
        v-if="tab === assetDetailTabs[2]"
        @select-tab="selectTab"
      >
        <div class="h-full flex flex-col justify-around text-center">
          <div class="text-lg 3xl:text-2xl font-ibm-bold 3xl:leading-9">
            Your Investment Automatically Includes 100% Liquidity Protection for
            365 days
          </div>
          <div class="text-tertiary-500 text-sm 3xl:leading-6">
            If you are a buyer, think of NFT.protection as a new strategic
            staking program with upside from selling the NFT, while also
            providing the option to cancel your investment and get a 100% refund
            with your original tokens.
          </div>
          <div class="flex flex-col gap-6">
            <div class="flex justify-around">
              <div class="text-center">
                <div class="font-ibm-bold text-lg">Days left</div>
                <div class="text-3.5xl text-primary-800 -mt-0.75">
                  {{
                    currentSale
                      ? parseInt(currentSale.protectionTime / 86400) +
                        "/" +
                        parseInt(currentSale.protectionTime / 86400)
                      : "58 / 365"
                  }}
                </div>
              </div>
              <div class="text-center">
                <div class="font-ibm-bold text-lg">Protection</div>
                <div class="text-3.5xl text-primary-800 -mt-0.75">
                  {{ currentSale ? currentSale.protectionRate : 100 }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </inside-modal>
    </div>
    <div class="mt-6.5">
      <div
        class="relative sm:flex gap-4 w-full text-sm font-ibm items-baseline"
      >
        <div
          v-if="store.state.app.windowWidth >= themeConfig.xl3"
          class="flex-1 flex pr-5 gap-5"
        >
          <list-group-item
            @click="selectTab(tab === 'NFT details' ? '' : 'NFT details')"
            :active="tab === 'NFT details'"
            class="min-w-max"
          >
            NFT details
          </list-group-item>
          <div
            class="border-l border-l-black border-r border-r-tertiary-700 my-2"
          />
          <list-group-item
            @click="selectTab(tab === 'Subcollection' ? '' : 'Subcollection')"
            :active="tab === 'Subcollection'"
            class="min-w-max"
          >
            Subcollection
          </list-group-item>
          <div
            class="border-l border-l-black border-r border-r-tertiary-700 my-2"
          />
          <list-group-item
            @click="
              selectTab(
                tab === 'Liquidity Protection' ? '' : 'Liquidity Protection'
              )
            "
            active
            class="min-w-max"
          >
            Liquidity Protection
          </list-group-item>
        </div>
        <accordion
          v-if="store.state.app.windowWidth < themeConfig.xl3"
          :border="false"
          :sidebar="true"
          v-model="open"
          @handle-click="handleClick"
          :handleEmit="true"
          class="flex-grow w-full"
        >
          <template v-slot:caption>
            <list-group-item class="text-sm pt-1.5">{{ tab }}</list-group-item>
          </template>
          <div v-for="(name, i) in assetDetailTabs" :key="i">
            <list-group-sub-item
              @click="selectTab(name === tab ? '' : name)"
              :active="name === tab"
            >
              {{ name }}
            </list-group-sub-item>
          </div>
        </accordion>
        <div class="flex object-right">
          <div
            class="border border-black transition w-8 h-8 px-2.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800 cursor-pointer"
            @click="refresh"
          >
            <font-awesome-icon :icon="['fas', 'undo']" />
          </div>
          <a
            :href="asset && asset.externalLink ? asset.externalLink : ''"
            target="_blank"
          >
            <div
              class="border-y border-black transition w-8 h-8 px-2.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800 cursor-pointer"
            >
              <font-awesome-icon :icon="['fas', 'external-link-alt']" />
            </div>
          </a>
          <div class="relative">
            <div
              @mouseover="openShare = true"
              @mouseout="openShare = false"
              class="border-y border-l border-black transition w-8 h-8 px-2.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800 cursor-pointer"
            >
              <font-awesome-icon :icon="['fas', 'share-alt']" />
            </div>
            <div
              @mouseover="previewShare = true"
              @mouseout="previewShare = false"
              :class="[
                openShare || previewShare ? 'block' : 'hidden',
                'absolute left-0 top-7.75 border border-black bg-tertiary-800 px-4.25 py-3 z-10 w-48 transition',
              ]"
            >
              <div
                v-clipboard:copy="currentHref"
                v-clipboard:success="onCopy"
                class="flex gap-4 py-1.25 cursor-pointer text-white hover:text-primary-900 transition"
              >
                <div class="w-4 flex justify-center items-center">
                  <font-awesome-icon :icon="['fas', 'link']" />
                </div>
                <div class="font-ibm text-11 tracking-wider">Copy link</div>
              </div>
              <a
                :href="
                  'https://www.facebook.com/sharer/sharer.php?u=' + currentHref
                "
                target="_blank"
              >
                <div
                  class="flex gap-4 py-1.25 cursor-pointer text-white hover:text-primary-900 transition"
                >
                  <div class="w-4 flex justify-center items-center">
                    <font-awesome-icon :icon="['fab', 'facebook-f']" />
                  </div>
                  <div class="font-ibm text-11 tracking-wider">
                    Share on Facebook
                  </div>
                </div>
              </a>

              <a
                :href="
                  'https://twitter.com/intent/tweet?text=Check out this item on NFT Protection&url=' +
                  currentHref +
                  '&via=NFT Protection'
                "
                target="_blank"
              >
                <div
                  class="flex gap-4 py-1.25 cursor-pointer text-white hover:text-primary-900 transition"
                >
                  <font-awesome-icon :icon="['fab', 'twitter']" />
                  <div class="font-ibm text-11 tracking-wider">
                    Share on twitter
                  </div>
                </div>
              </a>
              <div
                class="flex gap-4 py-1.25 cursor-pointer text-white hover:text-primary-900 transition"
              >
                <font-awesome-icon :icon="['fas', 'code']" />
                <div class="font-ibm text-11 tracking-wider">Embed Item</div>
              </div>
            </div>
          </div>
          <div
            class="border border-black transition w-8 h-8 px-2.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800 cursor-pointer"
            @click="openItemReportModal = true"
          >
            <font-awesome-icon :icon="['fas', 'flag']" />
          </div>
        </div>
      </div>
    </div>
    <item-report-modal v-model="openItemReportModal" />
  </div>
</template>
