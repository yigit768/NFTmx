<script setup>
import { $vfm } from "vue-final-modal";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { shortenAddress } from "vue-dapp";

defineProps({
  users: Array,
});

const cancel = () => {
  $vfm.hide("follwersModal");
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex items-center justify-center"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="follwersModal"
    esc-to-close
    fit-parent
  >
    <div
      class="relative bg-tertiary-900 text-white overflow-auto w-90vw sm:w-modal-sm"
    >
      <div class="text-right text-[22px] leading-none p-5 absolute w-full">
        <span
          class="cursor-pointer hover:text-red-900 transition"
          @click="cancel"
        >
          &#10005;
        </span>
      </div>
      <div class="text-center font-press text-lg py-6">Followers</div>
      <div
        class="overflow-auto max-h-80vh border-y border-black divide-y divide-black"
      >
        <div v-for="(user, index) in users" :key="index" class="p-6 flex gap-4">
          <div class="w-10 h-10">
            <nftmx-img
              :src="user.profile_img"
              class="w-full h-full rounded-full"
            />
          </div>
          <div class="flex flex-col justify-between flex-1">
            <div class="font-ibm-bold">{{ user.name || "Unnamed" }}</div>
            <div class="text-xs">
              <a
                target="_blank"
                :href="'/account/' + user.walletAddress"
                class="text-secondary-600 font-ibm-medium"
              >
                {{ shortenAddress(user.walletAddress) }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<style scoped>
.max-h-80vh {
  max-height: calc(80vh - theme("spacing[10]"));
}
.w-90vw {
  width: 90vw;
}
@media (min-width: 640px) {
  .sm\:w-modal-sm {
    width: 550px;
  }
}
</style>
