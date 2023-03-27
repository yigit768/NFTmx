<script setup>
import { computed, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { themeConfig, CHAIN_ROUTES } from "@/core/config/constant";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import FavoritedModal from "./FavoritedModal.vue";
import { useRoute } from "vue-router";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import nftsService from "@/core/services/market/nfts.service";
import { shortenAddress } from "vue-dapp";

const props = defineProps({
  asset: Object,
});

const store = useStore();
const route = useRoute();
const userId = computed(() => store.getters["auth/userId"]);
const favoritedByModal = ref(false);
const votePending = ref(false);
const chain = route.params.chain.toUpperCase();

const handleVote = () => {
  if (votePending.value) return;
  votePending.value = true;
  nftsService
    .vote({
      chain: chain,
      userId: userId.value,
      nftId: props.asset.id,
    })
    .then((res) => {
      if (res.data) {
        props.asset.votes.push(store.state.user);
      } else {
        const index = props.asset.votes.findIndex(
          (item) => item.id === userId.value
        );
        props.asset.votes.splice(index, 1);
      }
      votePending.value = false;
    });
};
</script>

<template>
  <div
    v-if="
      asset && !asset.currentOrder && asset.owner && asset.owner.id === userId
    "
    class="pb-1"
  >
    <div class="flex gap-6 justify-between items-center">
      <div class="font-ibm-bold text-lg text-primary-900 -mt-2">
        {{ (asset.owner && asset.owner.name) || "Unnamed" }}
      </div>
      <div
        class="text:xs md:text-base text-tertiary-400 flex items-end gap-5 font-ibm-medium"
      >
        <span
          @click="favoritedByModal = true"
          class="leading-4 text-lg cursor-pointer hover:text-white transition"
        >
          {{ asset && asset.votes ? asset.votes.length : 0 }}
        </span>
        <font-awesome-icon
          :icon="['fas', 'thumbs-up']"
          :class="[
            votePending ? 'cursor-wait' : 'cursor-pointer',
            asset &&
            asset.votes &&
            asset.votes.findIndex((user) => user.id === store.state.user.id) >
              -1
              ? 'text-primary-900'
              : 'text-white',
            'transition hover:text-primary-900 text-lg md:text-2xl',
          ]"
          @click="handleVote()"
        />
      </div>
    </div>
    <div class="flex gap-6 justify-between items-end -mt-0.5">
      <div class="flex-1">
        <div class="text-3xl font-ibm-bold">
          <nftmx-trim-string :line="1">
            {{ asset.name || "#" + asset.tokenId }}
          </nftmx-trim-string>
        </div>
        <div
          class="flex flex-col sm:flex-row text-11 tracking-wider font-ibm gap-4 mt-4.75"
        >
          <div>
            <span class="w-max"> Created by </span>
            <a
              v-if="asset && asset.creator"
              target="_blank"
              :href="'/account/' + asset.creator.walletAddress"
              class="text-primary-900"
            >
              {{
                asset.creator.name ||
                shortenAddress(asset.creator.walletAddress)
              }}
            </a>
          </div>
          <div
            class="border-l border-l-black border-r border-r-tertiary-700 my-0.5"
          />
          <div>
            <span class="w-max"> Owned by </span>
            <a
              v-if="asset && asset.owner"
              target="_blank"
              :href="'/account/' + asset.owner.walletAddress"
              class="text-primary-900"
            >
              {{
                asset.owner.name || shortenAddress(asset.owner.walletAddress)
              }}
            </a>
          </div>
        </div>
      </div>
      <div
        class="font-ibm text-right text-shadow-white text-xs text-tertiary-400"
      >
        <div>Pending APY reward from offers</div>
        <div>
          <span class="font-ibm-bold text-white text-lg">0 BNB</span>
          <span class="ml-2">($0)</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="asset" class="flex flex-col gap-6">
    <div class="flex gap-6 justify-between items-center">
      <div class="text-3xl font-ibm-bold leading-none -mt-0.5">
        {{ asset.name || "#" + asset.tokenId }}
      </div>
      <div
        class="text:xs md:text-base text-tertiary-400 flex items-center gap-5 font-ibm-medium"
      >
        <span
          @click="favoritedByModal = true"
          class="leading-4 text-lg cursor-pointer hover:text-white transition"
        >
          {{ asset && asset.votes ? asset.votes.length : 0 }}
        </span>
        <font-awesome-icon
          :icon="['fas', 'thumbs-up']"
          :class="[
            votePending ? 'cursor-wait' : 'cursor-pointer',
            asset &&
            asset.votes &&
            asset.votes.findIndex((user) => user.id === store.state.user.id) >
              -1
              ? 'text-primary-900'
              : 'text-white',
            'transition hover:text-primary-900 text-lg md:text-2xl',
          ]"
          @click="handleVote()"
        />
      </div>
    </div>
    <div class="flex gap-6 justify-between items-start">
      <div
        class="flex flex-col sm:flex-row text-11 tracking-wider font-ibm gap-2"
      >
        <div>
          <span class="w-max"> Created by </span>
          <a
            v-if="asset && asset.creator"
            target="_blank"
            :href="'/account/' + asset.creator.walletAddress"
            class="text-primary-900"
          >
            {{
              asset.creator.name || shortenAddress(asset.creator.walletAddress)
            }}
          </a>
        </div>
        <div
          class="border-l border-l-black border-r border-r-tertiary-700 my-0.5"
        />
        <div>
          <span class="w-max"> Owned by </span>
          <a
            v-if="asset && asset.owner"
            target="_blank"
            :href="'/account/' + asset.owner.walletAddress"
            class="text-primary-900"
          >
            {{ asset.owner.name || shortenAddress(asset.owner.walletAddress) }}
          </a>
        </div>
        <div
          class="border-l border-l-black border-r border-r-tertiary-700 my-0.5"
        />
        <!-- <div
          class="flex gap-1 transition cursor-pointer text-white hover:text-primary-900 w-max"
        >
          <div class="w-max">
            {{ asset && asset.votes ? asset.votes.length : 0 }} favorites
          </div>
        </div> -->
      </div>
      <div
        class="text-xs md:text-sm text-primary-900 font-ibm-bold tracking-wide text-right"
      >
        MAKE AN OFFER
      </div>
    </div>
    <favorited-modal v-model="favoritedByModal" :favoriteUsers="asset.votes" />
  </div>
</template>
