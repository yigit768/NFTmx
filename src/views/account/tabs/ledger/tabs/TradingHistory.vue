<script setup>
import BasicAccordion from "@/core/components/accordion/BasicAccordion.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import OfferCard from "@/core/components/cards/OfferCard.vue";
import { ref, onMounted, computed } from "vue";
import { roundTo, getDateAgo, getDateLeft } from "@/core/utils/common";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import marketService from "@/core/services/market.service";
import { useStore } from "vuex";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxWalletAddress from "@/core/components/blockchain-address/NftmxWalletAddress.vue";
import { NULL_ADDRESS } from "@/core/config/constant";
import { shortenHash } from "@/core/utils/common";

const store = useStore();
const history = ref([]);
const bnbPrice = computed(() => store.state.market.coinPrice.BSC_TESTNET);
const userId = computed(() => store.getters["auth/userId"]);
const myOffers = ref([]);
const receivedOffers = ref([]);

onMounted(() => {
  marketService
    .tradingHistoryByUser("BSC-TESTNET", store.state.user.walletAddress)
    .then((res) => {
      history.value = res.data;
    });
});
const getStatus = (status) => {
  switch (status) {
    case "0":
      return "List";
    case "1":
      return "Bidded";
    case "2":
      return "Downside protection";
    case "3":
      return "Completed";
    default:
      return "Canceled";
  }
};
</script>

<template>
  <div class="xl:pt-30 pb-22 text-white">
    <basic-accordion class="overflow-hidden">
      <template v-slot:caption>
        <div class="flex items-center">
          <div class="text-lg font-ibm-bold pt-4 pb-3.5">Trading History</div>
        </div>
      </template>
      <div class="text-left font-ibm text-xs">
        <nftmx-table class="text-11 tracking-wider leading-4">
          <nftmx-thead>
            <nftmx-tr>
              <nftmx-th class="text-left">Event</nftmx-th>
              <nftmx-th class="text-left">NFT</nftmx-th>
              <nftmx-th class="text-left">NFT price</nftmx-th>
              <nftmx-th class="text-left">Quantity</nftmx-th>
              <nftmx-th class="text-left">From</nftmx-th>
              <nftmx-th class="text-left">To</nftmx-th>
              <nftmx-th class="text-left">Date</nftmx-th>
              <nftmx-th class="text-left">Txn Hash</nftmx-th>
            </nftmx-tr>
          </nftmx-thead>
          <nftmx-tbody>
            <nftmx-tr
              v-for="(order, index) in history"
              :key="index"
              class="hover:bg-tertiary-300 transition cursor-pointer"
            >
              <nftmx-td>
                {{ getStatus(order.orderStatus) }}
              </nftmx-td>
              <nftmx-td>
                <div class="flex gap-4.5 items-center">
                  <div class="w-11 h-11">
                    <nftmx-img
                      :src="order.nft ? order.nft.image512 : ''"
                      class="h-full w-full object-cover bg-black"
                    />
                  </div>
                  <div>
                    <span>
                      {{ order.nft.name || "#" + order.nft.tokenId }}
                    </span>
                  </div>
                </div>
              </nftmx-td>
              <nftmx-td>
                ${{ roundTo(order.tokenPrice * bnbPrice, 2) }}
              </nftmx-td>
              <nftmx-td> 1 </nftmx-td>
              <nftmx-td>
                <div class="flex gap-4.5 items-center">
                  <div class="w-6 h-6">
                    <nftmx-img
                      :src="order.seller.profile_img"
                      class="h-full w-full object-cover bg-black object-center"
                    />
                  </div>
                  <nftmx-wallet-address
                    class="text-primary-900"
                    :address="order.sellerAddress"
                  >
                  </nftmx-wallet-address>
                </div>
              </nftmx-td>
              <nftmx-td>
                <div v-if="order.buyer" class="flex gap-4.5 items-center">
                  <div class="w-6 h-6">
                    <nftmx-img
                      :src="order.buyer.profile_img"
                      class="h-full w-full object-cover bg-black object-center"
                    />
                  </div>
                  <nftmx-wallet-address
                    v-if="order.buyerAddress !== NULL_ADDRESS"
                    class="text-primary-900"
                    :address="order.buyerAddress"
                  />
                </div>
              </nftmx-td>
              <nftmx-td>{{ getDateAgo(order.updatedAt) }}</nftmx-td>
              <nftmx-td class="text-secondary-600">
                {{ shortenHash(order.tx2 || order.tx1 || "") }}
              </nftmx-td>
            </nftmx-tr>
          </nftmx-tbody>
        </nftmx-table>
      </div>
    </basic-accordion>
  </div>
</template>

<style scoped>
.h-multilevel {
  height: calc(100vh - 240px);
}
</style>
