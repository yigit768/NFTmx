<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import NavBarItem from "./NavBarItem.vue";
import TopBar from "@/core/components/basic/TopBar.vue";
import Projects from "@/views/sidebar/projects/Projects.vue";
import MenuBar from "@/views/sidebar/menu/MenuBar.vue";
import NotificationsBar from "@/views/sidebar/notification/NotificationsBar.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftmxBadge from "@/core/components/basic/NftmxBadge.vue";
import ordersService from "@/core/services/market/orders.service";
import AccountModal from "@/core/components/modal/AccountModal.vue";
import { useRouter } from "vue-router";
import ConnectWalletModal from "@/core/components/modal/ConnectWalletModal.vue";
import DropDown from "@/core/components/dropdown/DropDown.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";

const store = useStore();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const orderLogs = ref([]);
const accountModal = ref(false);
const listButtonName = ref("List NFT");
const router = useRouter();
const walletModalPop = ref(false);
const projectsBar = ref(false);
const offerReceivedCount = ref(0);

const onClickOutside = () => {
  store.commit("app/TOGGLE_MENU", false);
  store.commit("app/TOGGLE_NOTIFICATION_BAR", false);
  projectsBar.value = false;
};
const toggleSidebar = () => {
  store.commit("app/TOGGLE_MENU", !store.state.app.menuOpened);
  store.commit("app/TOGGLE_NOTIFICATION_BAR", false);
};
const toggleNotificationBar = () => {
  store.commit("app/TOGGLE_NOTIFICATION_BAR", !store.state.app.logBarOpened);
  store.commit("app/TOGGLE_MENU", false);
};
watchEffect(() => {
  if (userId.value) {
    ordersService
      .offerReceivedCount({
        userId: userId.value,
      })
      .then((res) => {
        offerReceivedCount.value = res.data;
      });
  }
});
</script>

<template>
  <div v-click-outside="onClickOutside">
    <top-bar class="px-2 font-ibm-medium text-sm">
      <div class="flex-1 items-center flex h-17.5 font-ibm gap-5">
        <nav-bar-item to="/home?tab=NFTS" class="gap-6">
          <img v-lazy="'/images/logo/nftmx-logo.png'" alt="NFT mx" />
          <div class="relative h-2 w-2 flex justify-center">
            <font-awesome-icon
              @click="projectsBar = true"
              @click.prevent
              :icon="['fas', 'sort-down']"
              class="absolute text-white hover:text-primary-900 hover:text-xl -top-1 hover:-top-2 transition"
            />
          </div>
        </nav-bar-item>
        <div class="hidden 3xl:flex items-center gap-5">
          <div class="border-l border-l-tertiary-700 h-6" />
          <span> Peer-2-Peer </span>
          <div class="border-l border-l-tertiary-700 h-6" />
          <span> Peer-2-Contract </span>
          <div class="border-l border-l-tertiary-700 h-6" />
          <span> Contract-2-Contract </span>
        </div>
      </div>
      <div class="h-17.5 flex items-center justify-end ml-auto">
        <div class="hidden xl:flex items-center">
          <router-link
            to="/home?tab=NFTS"
            class="px-6 cursor-pointer transition hover:text-primary-700 flex"
          >
            Initial Offering
            <div class="relative text-white">
              <div
                class="absolute inline-flex items-center justify-center px-1.75 h-5 text-xs rounded-full -top-2 -left-1 z-50 bg-primary-900"
              >
                {{ 3 }}
              </div>
            </div>
          </router-link>
          <div class="border-l border-l-tertiary-700 h-6" />
          <router-link
            to="/home?tab=NFTS"
            class="px-6 cursor-pointer transition hover:text-secondary-700 flex"
          >
            Derivatives Offering
            <div class="relative text-white">
              <div
                class="absolute inline-flex items-center justify-center px-1.75 h-5 text-xs rounded-full -top-2 -left-1 z-50 bg-secondary-700"
              >
                {{ 7 }}
              </div>
            </div>
          </router-link>
          <div class="border-l border-l-tertiary-700 h-6" />
          <router-link
            to="/multilevel"
            class="px-6 cursor-pointer transition hover:text-primary-700 relative"
          >
            Multilevel Ownership OTC
          </router-link>
          <div class="border-l border-l-tertiary-700 h-6" />
        </div>
        <div
          class="w-38 transition flex justify-center hover:text-primary-900 cursor-pointer"
          @mouseover="walletAddress ? '' : (listButtonName = 'Connect Wallet')"
          @mouseout="listButtonName = 'List NFT'"
          @click="
            walletAddress
              ? router.push('/account/' + walletAddress)
              : (walletModalPop = true)
          "
        >
          {{ listButtonName }}
        </div>
        <nav-bar-item class="mr-6">
          <nftmx-tooltip
            :text="`You have received ${offerReceivedCount} offers`"
          >
            <component
              :is="walletAddress ? 'router-link' : 'div'"
              :to="
                walletAddress
                  ? `/account/${walletAddress}?category=ledger&tab=offers-received`
                  : ''
              "
              class="inline-flex relative top-1"
            >
              <font-awesome-icon
                :icon="['fas', 'bell']"
                class="text-lg text-white"
              />
              <div class="relative">
                <div
                  class="absolute inline-flex items-center justify-center px-1.75 h-5 text-xs rounded-full -top-2 -left-2 z-50 shadow-default shadow-white bg-black"
                >
                  {{ offerReceivedCount }}
                </div>
              </div>
            </component>
          </nftmx-tooltip>
        </nav-bar-item>
        <nav-bar-item @click="toggleSidebar" class="hover:text-primary-900">
          <div class="flex flex-col gap-1 items-center">
            <div class="w-2 h-2 bg-primary-900 rounded" />
            <div class="w-1.5 h-1.5 bg-primary-900 rounded" />
            <div class="w-1 h-1 bg-primary-900 rounded" />
          </div>
        </nav-bar-item>
      </div>
    </top-bar>
    <projects
      :class="[
        projectsBar ? 'translate-x-0' : '-translate-x-full',
        'transition',
      ]"
      @close="projectsBar = false"
    />
    <menu-bar
      :class="[
        store.state.app.menuOpened ? '-translate-x-0' : 'translate-x-full',
        'transition',
      ]"
      @open-modal="accountModal = true"
    />
    <notifications-bar
      :class="[
        store.state.app.logBarOpened ? '-translate-x-0' : 'translate-x-full',
        'transition',
      ]"
      :orderLogs="orderLogs"
    />
  </div>
  <account-modal v-model="accountModal" />
  <connect-wallet-modal v-model="walletModalPop" />
</template>
