<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import usersService from "@/core/services/market/users.service";
import {
  themeConfig,
  defaultPagination,
  BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import { useStore } from "vuex";
import NftmxSearchInput from "@/core/components/basic/NftmxSearchInput.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef";
import marketService from "@/core/services/market.service";
import nftsService from "@/core/services/market/nfts.service";
import OfferSearchOptions from "../components/OfferSearchOptions.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import BasicAccordion from "@/core/components/accordion/BasicAccordion.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import {
  roundTo,
  getDateAgo,
  getDateLeft,
  shortenHash,
} from "@/core/utils/common";
import { acceptOffer } from "@/core/utils/contracts/market.utils";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "@/core/utils/contracts/erc721.utils.js";

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const bnbPrice = computed(() => store.state.market.coinPrice.BSC_TESTNET);
const loading = ref(false);
const allOffers = ref({ offers: [], cursor: null });
const offers = ref([]);
const more = computed(
  () =>
    allOffers.value.cursor ||
    offers.value.length < allOffers.value.offers.length
);
const limit = ref(2);
const filterOption = ref({
  chain: "BSC-TESTNET",
  name: "",
  min: null,
  max: null,
  collection: [],
  sortBy: "",
});
const searchText = useDebouncedRef("", 1000);
const filterActive = ref(false);

const clickFilter = () => {
  filterActive.value = !filterActive.value;
};
const filterOffers = (value) => {
  filterOption.value = value;
  initialOffers();
};
const cancelOffer = (id) => {
  usersService
    .cancelOffersReceived({
      chain: filterOption.value.chain,
      offerId: id,
    })
    .then((res) => {
      const index = allOffers.value.offers.findIndex(
        (asset) => asset.id === id
      );
      allOffers.value.offers.splice(index, 1);
      const lines = Math.ceil((offers.value.length - 1) / limit.value);
      offers.value = allOffers.value.offers.slice(0, limit.value * lines);
    });
};
const accept = async (index, offerId) => {
  const offer = offers.value[index];
  const approved = await isApprovedForAll(
    offer.tokenAddress,
    walletAddress.value,
    BSC_TESTNET_MARKET_CONTRACT_ADDRESS
  );
  if (!approved) {
    await setApprovalForAll(
      offer.tokenAddress,
      BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
      true
    );
  }
  acceptOffer(offerId)
    .then((res) => {
      const index = allOffers.value.offers.findIndex(
        (item) => item.id === offer.id
      );
      allOffers.value.offers.splice(index, 1);
      const lines = Math.ceil((offers.value.length - 1) / limit.value);
      offers.value = allOffers.value.offers.slice(0, limit.value * lines);
    })
    .catch((err) => {
      console.log("err: ", err);
    });
};
const loadMoreOffers = async () => {
  loading.value = true;
  if (allOffers.value.cursor) await retrieveOffers();
  loading.value = false;
  const sliceLimit = limit.value * 3;
  const nextStartPoint = offers.value.length;
  offers.value = offers.value.concat(
    allOffers.value.offers.slice(nextStartPoint, nextStartPoint + sliceLimit)
  );
};
const initialOffers = async () => {
  allOffers.value = { offers: [], cursor: null };
  offers.value = [];
  loading.value = true;
  await retrieveOffers();
  loading.value = false;
  offers.value = offers.value.concat(
    allOffers.value.offers.slice(0, limit.value * 4)
  );
};
const retrieveOffers = async () => {
  return new Promise((resolve, reject) => {
    usersService
      .offersReceived({
        ...filterOption.value,
        cursor: allOffers.value.cursor,
        limit: defaultPagination.limit,
        walletAddress: walletAddress.value,
      })
      .then((res) => {
        allOffers.value = {
          offers: [...allOffers.value.offers, ...res.data.offers],
          cursor: res.data.cursor,
        };
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
};
const setLimitValue = (width) => {
  let newLimit = 6;
  if (width >= themeConfig.xl3) {
    newLimit = 6;
  } else if (width >= themeConfig.xl2) {
    newLimit = 5;
  } else if (width >= themeConfig.xl) {
    newLimit = 4;
  } else if (width >= themeConfig.lg) {
    newLimit = 3;
  } else if (width >= themeConfig.sm) {
    newLimit = 2;
  } else {
    newLimit = 1;
  }
  if (limit.value === newLimit) return;
  const lines = Math.ceil(offers.value.length / limit.value);
  offers.value = allOffers.value.offers.slice(0, newLimit * lines);
  limit.value = newLimit;
};
watch(windowWidth, (width) => {
  setLimitValue(width);
});
watch(walletAddress, (val) => {
  initialOffers();
});
onMounted(() => {
  setLimitValue(windowWidth.value);
  initialOffers();
});
watch(searchText, (val) => {
  filterOffers({ ...filterOption.value, name: val });
});
</script>

<template>
  <div class="flex flex-col sm:flex-row mb-22 xl:pt-7.25 text-white">
    <div class="flex-1">
      <div class="flex xl:justify-end">
        <nftmx-search-input
          v-model="searchText"
          @handle-filter="clickFilter"
          :filterActive="filterActive"
          class="bg-tertiary-800 z-10"
        />
      </div>
      <div
        class="-ml-5 sm:-ml-10 md:-ml-16 xl:-ml-22 -mr-5 sm:-mr-10 md:-mr-16 xl:-mr-22"
      >
        <offer-search-options
          :gridExtend="false"
          :filterOption="filterOption"
          @filter-offers="filterOffers"
          :filterActive="filterActive"
        />
      </div>
      <div v-if="offers.length > 0">
        <basic-accordion class="overflow-hidden">
          <template v-slot:caption>
            <div class="flex items-center">
              <div class="text-lg font-ibm-bold pt-4 pb-3.5">
                Offers Received
              </div>
            </div>
          </template>
          <div class="text-left font-ibm text-xs">
            <nftmx-table class="text-11 tracking-wider leading-4">
              <nftmx-thead>
                <nftmx-tr>
                  <nftmx-th class="text-left">Item</nftmx-th>
                  <nftmx-th class="text-left">From</nftmx-th>
                  <nftmx-th class="text-left">Offer</nftmx-th>
                  <nftmx-th class="text-left">USD value</nftmx-th>
                  <nftmx-th class="text-left">Floor Difference</nftmx-th>
                  <nftmx-th class="text-left">Offered</nftmx-th>
                  <nftmx-th class="text-left">Expiration</nftmx-th>
                  <nftmx-th class="text-left">APY reward</nftmx-th>
                  <nftmx-th class="text-left">Txn Hash</nftmx-th>
                  <nftmx-th class="text-left"></nftmx-th>
                </nftmx-tr>
              </nftmx-thead>
              <nftmx-tbody>
                <nftmx-tr
                  v-for="(offer, index) in offers"
                  :key="index"
                  class="hover:bg-tertiary-300 transition"
                >
                  <nftmx-td>
                    <div class="flex gap-4.5 items-center">
                      <div class="w-11 h-11">
                        <nftmx-img
                          :src="offer.nft.image512"
                          class="w-full h-full"
                        />
                      </div>
                      <div>
                        {{ offer.nft.name || "#" + offer.nft.tokenId }}
                      </div>
                    </div>
                  </nftmx-td>
                  <nftmx-td>
                    <nftmx-wallet-address-pop
                      tx
                      class="text-primary-900"
                      :address="offer.buyer.walletAddress"
                    />
                  </nftmx-td>
                  <nftmx-td>
                    {{ roundTo(offer.offerPrice, 2) }}
                    ETH
                  </nftmx-td>
                  <nftmx-td>
                    ${{ roundTo(offer.offerPrice * bnbPrice, 2) }}
                  </nftmx-td>
                  <nftmx-td>
                    <span>
                      {{
                        roundTo(
                          (Math.abs(
                            offer.offerPrice -
                              (offer.nft.contract.floorPrice || 1)
                          ) *
                            100) /
                            (offer.nft.contract.floorPrice || 1)
                        )
                      }}
                    </span>
                    <span>% </span>
                    <span>
                      {{
                        offer.offerPrice > (offer.nft.contract.floorPrice || 1)
                          ? "above"
                          : "below"
                      }}
                    </span>
                  </nftmx-td>
                  <nftmx-td>{{ getDateAgo(offer.createdAt) }}</nftmx-td>
                  <nftmx-td>
                    {{ getDateLeft(offer.offerExpiryTime * 1000) }}
                  </nftmx-td>
                  <nftmx-td>0%</nftmx-td>
                  <nftmx-td class="text-secondary-600">
                    {{ offer.tx ? shortenHash(offer.tx) : "" }}
                  </nftmx-td>
                  <nftmx-td class="w-56">
                    <nftmx-button
                      color="primary"
                      outline
                      label="ACCEPT"
                      class="font-press text-10 h-8.75 w-38 mr-4 text-primary-900"
                      small
                      @click="accept(index, offer.offerId)"
                    />
                    <font-awesome-icon
                      :icon="['fas', 'trash-alt']"
                      class="transition text-tertiary-400 hover:text-red-900 cursor-pointer text-sm"
                      @click="cancelOffer(offer.id)"
                    />
                  </nftmx-td>
                </nftmx-tr>
              </nftmx-tbody>
            </nftmx-table>
          </div>
        </basic-accordion>
      </div>
      <div
        v-if="loading"
        class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
      >
        Loading...
      </div>
      <div
        v-if="!loading && offers.length === 0"
        class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
      >
        No Offers found
      </div>
      <div class="text-center w-full mt-8">
        <nftmx-button
          v-if="more"
          color="primary"
          label="SEE MORE"
          :outline="true"
          @click="loadMoreOffers"
          class="font-ibm-bold text-lg text-primary-900 w-full sm:w-68"
        />
      </div>
    </div>
  </div>
</template>
