<script setup>
import BodyContainer from "@/core/container/BodyContainer.vue";
import Accordion from "@/core/components/accordion/AccordionInTable.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed, onMounted, ref } from "vue";
import ConnectWalletModal from "@/core/components/modal/ConnectWalletModal.vue";
import { useStore } from "vuex";
import BuyoutModal from "@/core/components/multilevel/BuyoutModal.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import { useRoute } from "vue-router";
import AccordionPagenation from "@/core/components/accordion/AccordionPagination.vue";
import mlrService from "@/core/services/market/mlr.service";

const props = defineProps({
  asset: Object,
});

const buyoutModal = ref(false);
const walletPop = ref(false);
const store = useStore();
const route = useRoute();
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId.toLowerCase();
const chain = route.params.chain.toUpperCase();
const chainKey = getChainKey(chain);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const buyoutOwner = ref();
const coinPrice = computed(() =>
  store.getters["market/getCoinPrice"](chainKey)
);
const currency = ref("ETH");
const mlrOwners = ref([]);
const page = ref(1);
const count = ref(0);

const openBuyout = (item) => {
  buyoutModal.value = true;
  buyoutOwner.value = item;
};
const buyout = () => {
  buyoutOwner.value.user = store.state.user;
};
const getNftMlrOwners = (page, limit) => {
  mlrService
    .getNftMlrOwners({
      chain,
      tokenAddress,
      tokenId,
      offset: page * limit,
    })
    .then((res) => {
      count.value = res.data.count;
      mlrOwners.value = res.data.mlrOwners;
    });
};
const selectPage = (val) => {
  if (page.value === val) return;
  page.value = val;
  getNftMlrOwners(val - 1, 10);
};
onMounted(() => {
  getNftMlrOwners(0, 10);
});
</script>

<template>
  <div>
    <div
      class="border border-black bg-tertiary-800 divide-y divide-black overflow-hidden"
    >
      <accordion :border="false">
        <template v-slot:caption>
          <div class="flex justify-between">
            <div
              class="flex gap-4 items-center text-white px-6 h-14.5 text-lg font-ibm-bold"
            >
              <span> Buyout ownership positions for Play Quiet #10/10 </span>
              <div
                class="h-5 border-l border-l-black border-r border-r-tertiary-700"
              />
              <div class="w-6 h-6 fill-white stroke-white">
                <svg viewBox="0 0 110 110">
                  <circle
                    cx="55"
                    cy="55"
                    r="50"
                    fill="none"
                    stroke-width="10"
                  />
                  <path d="M60,60 L0,60 A60,60 0 0,1 60,0 Z" />
                </svg>
              </div>
              <span class="text-red-900"> -20.53% </span>
            </div>
            <div
              class="flex items-center gap-3 text-lg text-black font-ibm-bold"
            >
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
        <div class="text-left font-ibm text-xs bg-tertiary-800">
          <nftmx-table v-if="mlrOwners.length > 0">
            <nftmx-thead>
              <nftmx-tr>
                <nftmx-th>
                  <div class="px-2">Ownership positions</div>
                </nftmx-th>
                <nftmx-th>Baseline ownership %</nftmx-th>
                <nftmx-th>Actual ownership %</nftmx-th>
                <nftmx-th> Ownership reward to date </nftmx-th>
                <nftmx-th>Buyout asking price</nftmx-th>
                <nftmx-th />
              </nftmx-tr>
            </nftmx-thead>
            <nftmx-tbody>
              <nftmx-tr
                v-for="(item, index) in mlrOwners"
                :key="index"
                class="transition hover:bg-tertiary-300"
              >
                <nftmx-td class="py-1.5">
                  {{ index + 1 }}
                </nftmx-td>
                <nftmx-td class="py-1.5">{{ item.royalty }}%</nftmx-td>
                <nftmx-td class="py-1.5">{{ item.realRoyalty }}%</nftmx-td>
                <nftmx-td class="py-1.5">
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
                          ? item.buyout
                          : roundTo(item.buyout * coinPrice)
                      }}
                    </span>
                  </div>
                </nftmx-td>
                <nftmx-td class="py-1.5">
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
                          ? item.buyout
                          : roundTo(item.buyout * coinPrice)
                      }}
                    </span>
                  </div>
                </nftmx-td>
                <nftmx-td class="w-40 py-2">
                  <button
                    v-if="walletAddress !== item.user?.walletAddress"
                    class="h-7.25 border-2 border-primary-900 hover:bg-primary-900 transition font-press text-10 text-primary-900 hover:text-white px-15 shadow-[0_0px_12px_0px_rgb(0_0_0_/_0),_0_0px_0px_0px_rgb(0_0_0_/_0);] shadow-[#19cb5866]"
                    @click="openBuyout(item)"
                  >
                    BUYOUT
                  </button>
                  <span v-else class=""> My ownership </span>
                </nftmx-td>
              </nftmx-tr>
            </nftmx-tbody>
          </nftmx-table>
          <div
            v-else
            class="font-ibm text-2xl text-white h-40 flex items-center justify-center"
          >
            No ownership position yet
          </div>
        </div>
      </accordion>
    </div>
    <div class="flex justify-between">
      <div class="text-primary-900 text-xs font-ibm-medium mt-4">
        <router-link to="/multilevel" class="cursor-pointer">
          Search more ownership for other NFTs in the OTC
        </router-link>
      </div>
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
    <buyout-modal
      v-if="asset && buyoutOwner"
      v-model="buyoutModal"
      :asset="asset"
      :owner="buyoutOwner"
      @buyout="buyout"
    />
  </div>
</template>

<style scoped>
.h-multilevel {
  height: calc(100vh - 240px);
}
</style>
