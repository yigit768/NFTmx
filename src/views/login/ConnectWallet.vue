<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useToast } from "vue-toastification";
import { connectors } from "@/core/config/constant";
import { useWallet } from "vue-dapp";

defineProps({
  wallet: {
    type: Object,
    required: true,
  },
});

const store = useStore();
const toast = useToast();
const { connectWith } = useWallet();

const connect = (connectorId) => {
  if (typeof connectorId === "number") {
    connectWith(connectors[connectorId]);
  } else {
    toast.error(`Not implemented yet.`);
  }
};
</script>

<template>
  <div class="flex flex-col text-center justify-center items-center">
    <div class="w-fit font-press text-sm sm:pt-4 sm:pb-6">
      <img v-lazy="wallet.imgUrl" />
      <nftmx-button
        color="primary"
        label="CONNECT YOUR WALLET"
        class="font-press w-full text-sm h-13.5"
        @click="connect(wallet.connectorId)"
      />
    </div>
    <div class="text-white text-sm py-1.25">Use a different wallet</div>
  </div>
</template>
