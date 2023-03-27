<script setup>
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import AccordionPagenation from "@/core/components/accordion/AccordionPagination.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxWalletAddress from "@/core/components/blockchain-address/NftmxWalletAddress.vue";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import { computed, onMounted, ref } from "vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import {
  getChainKey,
  roundTo,
  getDateAgo,
  getDateLeft,
} from "@/core/utils/common";
import { shortenAddress } from "vue-dapp";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { shortenHash } from "@/core/utils/common";
import ordersService from "@/core/services/market/orders.service";

const props = defineProps({
  asset: Object,
  myOffer: Object,
});

const emit = defineEmits(["open-offer-modal", "open-cancel-offer-modal"]);

const store = useStore();
const route = useRoute();
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId.toLowerCase();
const chain = route.params.chain.toUpperCase();
const chainKey = getChainKey(chain);
const userId = computed(() => store.getters["auth/userId"]);
const coinPrice = computed(() =>
  store.getters["market/getCoinPrice"](chainKey)
);
const currency = ref("ETH");
const offers = ref([]);
const page = ref(1);
const count = ref(0);

const openOfferModal = (value) => {
  emit("open-offer-modal", value);
};
const getNftOffers = (page, limit) => {
  ordersService
    .getNftOffers({
      chain,
      tokenAddress,
      tokenId,
      offset: page * limit,
    })
    .then((res) => {
      count.value = res.data.count;
      offers.value = res.data.offers;
    });
};
const selectPage = (val) => {
  if (page.value === val) return;
  page.value = val;
  getNftOffers(val - 1, 10);
};
const updateOffers = () => {
  getNftOffers(page.value - 1, 10);
};
onMounted(() => {
  getNftOffers(0, 10);
});
defineExpose({ updateOffers });
</script>

<template>
  <div>
    <accordion class="overflow-hidden">
      <template v-slot:caption>
        <div class="flex justify-between pr-8">
          <div class="flex items-center">
            <div class="text-lg font-ibm-bold pt-4 pb-3.5">Offers</div>
            <font-awesome-icon
              :icon="['fas', 'external-link-alt']"
              class="text-primary-900 text-sm cursor-pointer ml-8 mt-1"
            />
          </div>
          <div class="flex items-center gap-3 text-lg text-black font-ibm-bold">
            <font-awesome-icon
              v-if="chain === 'ETHEREUM'"
              :icon="['fab', 'ethereum']"
              :class="[
                currency === 'ETH'
                  ? 'text-primary-900'
                  : 'transition hover:text-primary-900',
                'cursor-pointer',
              ]"
              @click.stop
              @click="currency = 'ETH'"
            />
            <div
              v-if="chain === 'BSC-TESTNET'"
              :class="[
                currency === 'ETH'
                  ? 'fill-primary-900'
                  : 'transition hover:fill-primary-900',
                'w-4 h-4',
              ]"
              @click.stop
              @click="currency = 'ETH'"
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
            <div
              class="h-5 border-l border-l-black border-r border-r-tertiary-700 my-3.5"
            />
            <span
              :class="[
                currency === 'DOLAR'
                  ? 'text-primary-900'
                  : 'transition hover:text-primary-900',
                'cursor-pointer',
              ]"
              @click.stop
              @click="currency = 'DOLAR'"
            >
              $
            </span>
          </div>
        </div>
      </template>
      <div v-if="offers && offers.length > 0" class="text-left text-xs">
        <nftmx-table>
          <nftmx-thead>
            <nftmx-tr>
              <nftmx-th first>Date</nftmx-th>
              <nftmx-th>Buyer address</nftmx-th>
              <nftmx-th>Offer</nftmx-th>
              <nftmx-th>Liquidity Protection</nftmx-th>
              <nftmx-th>Days</nftmx-th>
              <nftmx-th>APY reward</nftmx-th>
              <nftmx-th></nftmx-th>
            </nftmx-tr>
          </nftmx-thead>
          <nftmx-tbody>
            <nftmx-tr v-for="(offer, index) in offers" :key="index">
              <nftmx-td>
                <span class="ml-1.5">{{ getDateAgo(offer.createdAt) }}</span>
              </nftmx-td>
              <nftmx-td class="text-primary-900">
                {{ shortenAddress(offer.buyer.walletAddress) }}
              </nftmx-td>
              <nftmx-td>
                <div class="flex items-center gap-0.5">
                  <font-awesome-icon
                    v-if="currency === 'ETH' && chain === 'ETHEREUM'"
                    :icon="['fab', 'ethereum']"
                  />
                  <div
                    v-if="currency === 'ETH' && chain === 'BSC-TESTNET'"
                    class="w-4 h-4 fill-white"
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
                  <span v-if="currency === 'DOLAR'">$</span>
                  <span>
                    {{
                      currency === "ETH"
                        ? offer.offerPrice
                        : roundTo(offer.offerPrice * coinPrice)
                    }}
                  </span>
                </div>
              </nftmx-td>
              <nftmx-td>{{ offer.protectionRate }}%</nftmx-td>
              <nftmx-td>{{ roundTo(offer.protectionTime / 86400) }}</nftmx-td>
              <nftmx-td>0%</nftmx-td>
              <td class="w-40 text-center">
                <nftmx-button
                  v-if="asset && asset.owner && asset.owner.id === userId"
                  color="primary"
                  outline
                  label="ACCEPT"
                  class="font-press text-10 w-45 mx-4"
                  small
                  h="xs1"
                />
                <span v-else class="text-secondary-600">
                  {{ offer.tx ? shortenHash(offer.tx) : "" }}
                </span>
              </td>
            </nftmx-tr>
          </nftmx-tbody>
        </nftmx-table>
      </div>
      <div
        v-else
        class="h-30 text-white text-2xl flex items-center justify-center"
      >
        No offers yet
      </div>
      <div
        :class="[
          asset && asset.owner && asset.owner.id === userId
            ? ''
            : 'py-3 border-t border-black',
          'px-4',
        ]"
      >
        <div v-if="asset && asset.owner && asset.owner.id === userId"></div>
        <nftmx-button
          v-else-if="myOffer"
          color="red"
          outline
          label="CANCEL MY OFFER"
          class="font-press text-10"
          h="xs"
          @click="emit('open-cancel-offer-modal')"
        />
        <button
          v-else
          @click="openOfferModal(true)"
          class="font-press w-45 text-10 text-primary-900 h-8 border-2 border-primary-900 transition hover:border-black hover:bg-black"
        >
          MAKE AN OFFER
        </button>
      </div>
    </accordion>
    <div
      class="flex justify-end text-11 text-tertiary-400 mt-2 gap-4 items-center"
    >
      <span> Page </span>
      <div class="relative w-20 h-8">
        <accordion-pagenation>
          <template v-slot:caption>
            <div class="text-11 flex justify-between">
              <span> 1 </span>
            </div>
          </template>
          <div class="text-left font-ibm text-11 max-h-30 overflow-auto">
            <div
              v-for="i in Math.ceil(count / 10)"
              :key="i"
              class="py-1 cursor-pointer transition hover:text-white"
              @click="selectPage(i)"
            >
              {{ i }}
            </div>
          </div>
        </accordion-pagenation>
      </div>
      <span>
        result {{ (page - 1) * 10 + 1 }}-{{ page * 10 }} of {{ count }}
      </span>
    </div>
  </div>
</template>
