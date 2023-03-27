<script setup>
import NftmxHelp from "@/core/components/basic/NftmxHelp.vue";
import NftmxPrice from "@/core/components/price/NftmxPrice.vue";
import AnalyzerCardContainer from "./container/AnalyzerCardContainer.vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import { onMounted, ref } from "vue";
import marketService from "@/core/services/market.service";
import { MainToken } from "@/core/config/constant";
import { roundTo } from "@/core/utils/common";

const downsideFunds = ref(0);
const totalSalesFunds = ref(0);
const dvcFunds = ref(0);
const apyFunds = ref(0);

onMounted(() => {
  // marketService.getDownsideProtectionFunds().then((res) => {
  //   const initialDownsideFunds = (res.data / Math.pow(10, 18)) * ethPrice;
  //   const downsideFundsInterval = setInterval(() => {
  //     downsideFunds.value += roundTo(initialDownsideFunds / 123, 0);
  //     if (downsideFunds.value >= initialDownsideFunds) {
  //       clearInterval(downsideFundsInterval);
  //     }
  //   }, 10);
  // });
  // marketService.getTotalSalesFunds().then((res) => {
  //   totalSalesFunds.value = (res.data / Math.pow(10, 18)) * ethPrice;
  // });
});
</script>

<template>
  <div
    class="grid lg:grid-cols-2 3xl:flex justify-center 3xl:justify-between pt-12 px-22 text-11"
  >
    <analyzer-card-container>
      <div class="h-9.75 text-center">Total sales to Date</div>
      <div
        class="font-ibm-semi-bold text-lg sm:text-xl text-center flex justify-center"
      >
        <nftmx-price :price="1256859.6559"></nftmx-price>
      </div>
    </analyzer-card-container>
    <analyzer-card-container>
      <div class="h-9.75 text-center">Multilevel Ownership Reward to Date</div>
      <div class="font-ibm-semi-bold text-lg sm:text-xl w-fit">
        <div class="flex justify-center">
          <nftmx-price :price="6452653.3248"></nftmx-price>
        </div>
        <div class="text-11 font-ibm-medium pt-2 pb-3 text-right">
          <router-link
            to="multilevel"
            class="cursor-pointer text-primary-900 hover:text-primary-700 transition"
          >
            Create New Ownership Level
          </router-link>
        </div>
      </div>
    </analyzer-card-container>
    <analyzer-card-container>
      <div class="h-9.75 text-center">
        <span>
          Market Making Rewards to Date
          <nftmx-tooltip
            text="Total amount of APY reward to be paid to sellers during liquidity protection period"
          >
            <font-awesome-icon
              :icon="['fas', 'question-circle']"
              class="text-xs cursor-pointer"
            />
          </nftmx-tooltip>
        </span>
      </div>
      <div
        class="font-ibm-semi-bold text-lg sm:text-xl text-center flex justify-center"
      >
        <nftmx-price :price="25689963.3289"></nftmx-price>
      </div>
    </analyzer-card-container>
    <analyzer-card-container>
      <div class="h-9.75 flex justify-center">
        <span>
          <span>Decentralized Venture Capital</span>
          <nftmx-tooltip
            text="Total capital locked in DVC smart contracts, ready to deploy to NFTs listed on NFT.protection network"
          >
            <font-awesome-icon
              :icon="['fas', 'question-circle']"
              class="text-xs cursor-pointer"
            />
          </nftmx-tooltip>
        </span>
      </div>
      <div
        class="font-ibm-semi-bold text-lg sm:text-xl text-center flex justify-center"
      >
        <nftmx-price :price="1548985.53" color="secondary"></nftmx-price>
      </div>
      <div class="text-11 font-ibm text-tertiary-400 pt-2 pb-3">
        <span class="mr-3">Avg ROI 125.52%</span>
        <router-link
          to="/dvc"
          class="font-ibm-semi-bold text-secondary-500 cursor-pointer"
        >
          Become A Baker
        </router-link>
        <span> | </span>
        <router-link
          to="/dvc/launch"
          class="font-ibm-semi-bold text-secondary-500 cursor-pointer"
        >
          Launch DVC
        </router-link>
      </div>
    </analyzer-card-container>
  </div>
</template>
