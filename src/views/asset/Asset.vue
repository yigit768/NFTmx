<script setup>
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import marketService from "@/core/services/market.service";
import ordersService from "@/core/services/market/orders.service";
import BodyContainer from "@/core/container/BodyContainer.vue";
import {
  MainToken,
  themeConfig,
  ChainIds,
  BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import AssetHead from "./AssetHead.vue";
import AssetDetail from "./AssetDetail.vue";
import AssetHistory from "./AssetHistory.vue";
import AssetOffers from "./AssetOffers.vue";
import AssetLedger from "./AssetLedger.vue";
import AssetMlr from "./AssetMlr.vue";
import OfferModal from "./purchase/OfferModal.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import AssetSellModal from "./sell/AssetSellModal.vue";
import PurchaseAction from "./purchase/PurchaseAction.vue";
import { cancelOffer } from "@/core/utils/contracts/market.utils";
import NftmxCancelModal from "@/core/components/modal/NftmxCancelModal.vue";
import { formatAMPM, getChainKey } from "@/core/utils/common";
import OpenseaAssetCard from "@/core/components/cards/OpenseaAssetCard.vue";
import { createSyndication } from "@/core/utils/contracts/syndication-factory.utils.js";
import { useToast } from "vue-toastification";
import Web3 from "web3/dist/web3.min.js";
import { NULL_ADDRESS } from "../../core/config/constant";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_APP_SERVER_URL);
const store = useStore();
const route = useRoute();
const toast = useToast();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const chain = route.params.chain.toUpperCase();
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId.toLowerCase();
const windowWidth = computed(() => store.state.app.windowWidth);
const asset = ref({});
const myOffer = ref();
const history = ref([
  {
    block_timestamp: "2022-10-02T01:33:23.000Z",
    transaction_hash:
      "0x8875918fe809e4cb7ebdf46a7c016e9a0964c04bbd1e53e984fd8e95612be553",
    transaction_index: 30,
    value: 0,
    token_address: "0xd3e3912cb7df9482d0e4eabdbafe843a35d9fee0",
    token_id: "730",
    from_address: "0x3c6575d71c02991dbe974703d0895622729a0450",
    to_address: "0xf532920bb32122d6475ad4cc7634dc3a69631902",
    amount: "1",
  },
  {
    block_timestamp: "2022-05-01T17:10:47.000Z",
    transaction_hash:
      "0x9918b3747f73b1c9bb27f009487f83d37b753d0f2cc2c2a30baaa08b5c7e0d8c",
    transaction_index: 69,
    value: 0.14,
    token_address: "0xd3e3912cb7df9482d0e4eabdbafe843a35d9fee0",
    token_id: "730",
    from_address: "0xe1bcbe7133c53ed46218908f2e419ae082889b40",
    to_address: "0x3c6575d71c02991dbe974703d0895622729a0450",
    amount: "1",
  },
  {
    block_timestamp: "2021-11-01T17:05:23.000Z",
    transaction_hash:
      "0xb26a9ee5d51d9d4c4a48ae73c3e9bc4af6471b81a7e410e45945c6cd6cc0584d",
    transaction_index: 100,
    value: 0,
    token_address: "0xd3e3912cb7df9482d0e4eabdbafe843a35d9fee0",
    token_id: "730",
    from_address: "0x0000000000000000000000000000000000000000",
    to_address: "0xe1bcbe7133c53ed46218908f2e419ae082889b40",
    amount: "1",
  },
]);
const totalTransfers = ref(0);
const offerModal = ref(false);
const offerCancelModal = ref(false);
const saleModal = ref(false);
const waiting = ref(false);
const currentSale = computed(() =>
  asset.value ? asset.value.currentOrder : null
);
const lastSale = computed(() => (asset.value ? asset.value.lastOrder : null));
const lastSaleDate = computed(() => {
  if (asset.value && asset.value.lastOrder) {
    const date = new Date(asset.value.lastOrder.updatedAt);
    return (
      date.toLocaleString("default", { month: "long" }) +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear() +
      " at " +
      formatAMPM(date) +
      " UTC"
    );
  }
  if (asset.value) {
    const date = new Date(asset.value.createdAt);
    return (
      date.toLocaleString("default", { month: "long" }) +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear() +
      " at " +
      formatAMPM(date) +
      " UTC"
    );
  }
  return "No last sale";
});
const moreAssets = ref([]);
const syndicationable = ref(false);
const assetOffers = ref(null);

const getAsset = () => {
  marketService
    .getAsset(chain, tokenAddress, tokenId, userId.value)
    .then((res) => {
      asset.value = res.data;
      getNfts();
    });
};
const getNfts = () => {
  marketService
    .searchNfts({
      chain: chain,
      collection: asset.value.contract.id,
      limit: 6,
    })
    .then((res) => {
      moreAssets.value = res.data.nfts;
    });
};
const cancelMyOffer = () => {
  cancelOffer(myOffer.value.offerId)
    .then((res) => {
      offerCancelModal.value = false;
    })
    .catch((err) => console.log("err: ", err));
};
const openOfferModal = () => {
  offerModal.value = true;
};
const openCancelOfferModal = () => {
  offerCancelModal.value = true;
};
const openSaleModal = async () => {
  saleModal.value = true;
};
const updateAsset = (deploySyndication) => {
  syndicationable.value = deploySyndication;
};
const offerCreated = (offer) => {
  asset.value["offer"] = offer;
};
const removeBacker = (backerId) => {
  const index = asset.value.syndication.backers.findIndex(
    (item) => item.id === backerId
  );
  asset.value.syndication.backers.splice(index, 1);
};
const createNewSyndication = async () => {
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }

  try {
    createSyndication(
      [
        [
          tokenAddress,
          tokenId,
          true,
          !asset.value.currentOrder
            ? 2
            : asset.value.currentOrder.orderType === "0"
            ? 0
            : 1,
          !asset.value.currentOrder ? 0 : asset.value.currentOrder.orderId,
          asset.value.mlrContract
            ? asset.value.mlrContract.address
            : BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
        ],
      ],
      NULL_ADDRESS,
      Web3.utils.toWei("0")
    )
      .then((res) => {
        toast.success("Syndication is created successfully");
      })
      .catch((err) => {
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong.");
        }
      });
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
  }
};
const getMyOffer = () => {
  ordersService
    .getMyOffer({
      tokenAddress,
      tokenId,
      walletAddress: walletAddress.value,
    })
    .then((res) => {
      myOffer.value = res.data || null;
    });
};
onBeforeMount(() => {
  socket.on(`update-asset/${tokenAddress}/${tokenId}`, (res) => {
    asset.value = res;
    if (syndicationable.value && asset.value.currentOrder) {
      createNewSyndication();
      syndicationable.value = false;
    }
  });
  socket.on(`update-offer/${tokenAddress}/${tokenId}`, (buyerAddress) => {
    if (walletAddress.value === buyerAddress) {
      getMyOffer();
    }
    if (assetOffers.value) {
      assetOffers.value.updateOffers();
    }
  });
});
onMounted(() => {
  getAsset();
  getMyOffer();
});
watch(walletAddress, () => {
  getMyOffer();
});
</script>

<template>
  <body-container>
    <div class="py-4">
      <div class="lg:grid grid-cols-7 text-white gap-8 lg:my-7">
        <div class="col-span-3">
          <asset-head
            v-if="windowWidth < themeConfig.lg"
            :asset="asset"
            :currentSale="currentSale"
          />
          <asset-detail :asset="asset" :currentSale="currentSale" />
        </div>
        <div class="col-span-4 relative">
          <asset-head
            v-if="windowWidth >= themeConfig.lg"
            :asset="asset"
            :currentSale="currentSale"
          />
          <div class="mt-9.25">
            <div
              v-if="
                asset &&
                !asset.currentOrder &&
                asset.owner &&
                asset.owner.id === userId
              "
            >
              <div
                class="bg-tertiary-800 border border-black px-6 pt-7 pb-8.75 grid grid-cols-1 sm:grid-cols-2"
              >
                <div>
                  <div class="text-lg">Last value</div>
                  <div class="flex text-5xl text-primary-900 font-ibm py-2">
                    <div class="flex items-center">
                      <font-awesome-icon
                        v-if="chain === 'ETHEREUM'"
                        :icon="['fab', 'ethereum']"
                      />
                      <div
                        v-if="chain === 'BSC-TESTNET'"
                        class="w-10 h-10 fill-primary-900"
                      >
                        <svg
                          role="img"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Binance</title>
                          <path
                            d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                          />
                        </svg>
                      </div>
                      <span class="ml-5"> 0 </span>
                    </div>
                    <span class="ml-3 mt-5 font-ibm text-lg text-tertiary-500">
                      [${{ 0 }}]
                    </span>
                  </div>
                  <div class="font-ibm text-lg text-tertiary-500 mt-0.5">
                    {{ lastSaleDate }}
                  </div>
                </div>
                <div class="flex items-center">
                  <nftmx-button
                    color="primary"
                    label="LIST FOR SALE"
                    :class="[
                      waiting ? 'cursor-wait' : '',
                      'font-press w-full text-lg',
                    ]"
                    h="lg"
                    @click="openSaleModal"
                  />
                </div>
              </div>
              <div
                class="border border-black px-8 pt-11.5 pb-13.5 flex justify-between font-ibm-medium text-lg bg-tertiary-800 mt-4.75"
              >
                <div>
                  <div>Total derivatives</div>
                  <div class="mt-0.75 font-ibm-bold text-primary-900 text-2xl">
                    0
                  </div>
                </div>
                <div class="border-x border-l-black border-r-tertiary-700" />
                <div>
                  <div>Value of subcollection</div>
                  <div
                    class="flex items-center mt-0.75 font-ibm-bold text-primary-900 text-2xl"
                  >
                    <font-awesome-icon
                      v-if="chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                    />
                    <div
                      v-if="chain === 'BSC-TESTNET'"
                      class="w-6 h-6 fill-primary-900"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Binance</title>
                        <path
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    <span class="ml-3">0</span>
                    <span class="ml-1 font-ibm text-sm text-tertiary-400">
                      [0]
                    </span>
                  </div>
                </div>
                <div class="border-x border-l-black border-r-tertiary-700" />
                <div>
                  <div>Downside protection locked</div>
                  <div
                    class="flex items-center mt-0.75 font-ibm-bold text-primary-900 text-2xl"
                  >
                    <font-awesome-icon
                      v-if="chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                    />
                    <div
                      v-if="chain === 'BSC-TESTNET'"
                      class="w-6 h-6 fill-primary-900"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Binance</title>
                        <path
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    <span class="ml-3">0</span>
                    <span class="ml-1 font-ibm text-sm text-tertiary-400">
                      [0]
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <purchase-action
              v-else-if="asset && asset.id"
              :asset="asset"
              :currentSale="currentSale"
              :lastSale="lastSale"
              :myOffer="myOffer"
              @open-offer-modal="openOfferModal"
              @update-asset="updateAsset"
              @offer-created="offerCreated"
              @open-cancel-offer-modal="openCancelOfferModal"
              @remove-backer="removeBacker"
            />
          </div>
        </div>
      </div>
      <div class="mb-19 text-white">
        <div>
          <asset-history :history="history" :totalTransfers="totalTransfers" />
        </div>
        <div class="mt-5">
          <asset-offers
            ref="assetOffers"
            @open-offer-modal="openOfferModal"
            @open-cancel-offer-modal="openCancelOfferModal"
            :asset="asset"
            :myOffer="myOffer"
          />
        </div>
        <div class="mt-5">
          <asset-ledger
            :tokenAddress="asset.tokenAddress"
            :tokenId="asset.tokenId"
          />
        </div>
        <div class="mt-5">
          <asset-mlr :asset="asset" />
        </div>
        <div class="mt-12 font-ibm-bold text-2xl text-white">
          <div>Subcollection Derivatives</div>
          <div
            class="font-ibm text-2xl text-white h-60 flex items-center justify-center"
          >
            No derivatives yet
          </div>
        </div>
        <div class="mt-12 font-ibm-bold text-2xl text-white">
          <div>More From This Collection</div>
          <div
            v-if="moreAssets.length > 0"
            class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4.5"
          >
            <div v-for="(asset, index) in moreAssets" :key="index">
              <opensea-asset-card
                :asset="asset"
                :draggable="true"
                @dragstart="startDrag($event, asset)"
                class="cursor-grab active:cursor-grabbing"
              />
            </div>
          </div>
          <div
            v-else
            class="font-ibm text-2xl text-white h-60 flex items-center justify-center"
          >
            No nfts
          </div>
          <div
            v-if="asset && asset.tokenAddress"
            class="text-right font-ibm-medium text-sm text-primary-900 mt-4"
          >
            <router-link
              :to="{
                name: 'collection',
                params: {
                  chain: chain,
                  contractAddress: asset.tokenAddress,
                },
              }"
              class="w-full relative font-ibm-medium"
            >
              <span>View full collection</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <asset-sell-modal
      :asset="asset"
      v-model="saleModal"
      @update-asset="updateAsset"
    />
    <offer-modal
      v-if="!currentSale"
      :asset="asset"
      v-model="offerModal"
      @offer-created="offerCreated"
      @update-asset="updateAsset"
    />
    <nftmx-cancel-modal v-model="offerCancelModal" @confirm="cancelMyOffer" />
  </body-container>
</template>
