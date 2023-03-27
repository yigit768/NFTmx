<script setup>
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import ListGroupAccordion from "@/core/components/accordion/ListGroupAccordion.vue";
import MenuFooter from "./MenuFooter.vue";
import SidebarContainer from "@/core/container/SidebarContainer.vue";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import ListGroupItem from "@/core/components/basic/ListGroupItem.vue";
import ListGroupSubItem from "@/core/components/basic/ListGroupSubItem.vue";
import NftmxWalletAddress from "@/core/components/blockchain-address/NftmxWalletAddress.vue";
import { toggleDarkMode } from "@/core/utils/common/window.js";

const emit = defineEmits(["open-modal"]);
const store = useStore();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const themeMode = ref(localStorage.getItem("theme"));

const toggleSidebar = () => {
  store.commit("app/TOGGLE_MENU", !store.state.app.menuOpened);
  store.commit("app/TOGGLE_NOTIFICATION_BAR", false);
};
const openAccountModal = () => {
  emit("open-modal");
};
const setThemeMode = (mode) => {
  themeMode.value = mode;
  localStorage.setItem("theme", mode);
  toggleDarkMode();
};
</script>

<template>
  <sidebar-container>
    <div
      class="mt-5 mb-7 flex items-center cursor-pointer justify-between"
      @click="toggleSidebar"
    >
      <div>
        <nftmx-wallet-address
          v-if="walletAddress"
          class="pt-1 text-base hover:text-primary-900 transition"
          :address="walletAddress"
          @click="openAccountModal"
        />
      </div>
      <div class="ml-6 flex flex-col gap-1 items-center">
        <div class="w-2 h-2 bg-primary-900 rounded" />
        <div class="w-1.5 h-1.5 bg-primary-900 rounded" />
        <div class="w-1 h-1 bg-primary-900 rounded" />
      </div>
    </div>
    <list-group-item sidebar to="/profile">Profile</list-group-item>
    <list-group-item sidebar to="/">Create an NFT</list-group-item>
    <list-group-item sidebar to="/dvc/launch">Launch your DVC</list-group-item>
    <list-group-item sidebar to="/">My collection</list-group-item>
    <list-group-item sidebar to="/">Free license</list-group-item>
    <list-group-accordion open title="Marketplace" class="mt-3.25">
      <list-group-sub-item sidebar to="/browse">Browse</list-group-sub-item>
      <list-group-sub-item sidebar to="/">Rankings</list-group-sub-item>
      <list-group-sub-item sidebar to="/">Recently sold</list-group-sub-item>
      <list-group-sub-item sidebar to="/">Recently added</list-group-sub-item>
      <list-group-sub-item sidebar to="/"
        >Recently canceled</list-group-sub-item
      >
      <list-group-sub-item sidebar to="/">Biggest sales</list-group-sub-item>
      <list-group-sub-item sidebar to="/">Ending soon</list-group-sub-item>
      <list-group-sub-item sidebar to="/">Most viewed</list-group-sub-item>
    </list-group-accordion>
    <list-group-accordion open title="Community" class="mt-3.25">
      <list-group-sub-item sidebar to="/">Help center</list-group-sub-item>
      <list-group-sub-item sidebar to="/">Suggestions</list-group-sub-item>
      <list-group-sub-item sidebar to="/">FAQ</list-group-sub-item>
      <list-group-sub-item sidebar to="/">Blog</list-group-sub-item>
    </list-group-accordion>
    <list-group-item sidebar to="/" class="mt-3.25">Developers</list-group-item>
    <list-group-item sidebar to="/" class="my-1.5"
      >Affiliate program</list-group-item
    >
    <list-group-item sidebar to="/">Docs</list-group-item>

    <nftmx-divider class="border-tertiary-900 mt-5 mb-5.25"></nftmx-divider>

    <list-group-item sidebar to="/">New</list-group-item>
    <list-group-item sidebar to="/" class="my-1.5">Art</list-group-item>
    <list-group-item sidebar to="/">Domain names</list-group-item>
    <list-group-item sidebar to="/" class="my-1.5"
      >Virtual worlds</list-group-item
    >
    <list-group-item sidebar to="/">Trading cards</list-group-item>
    <list-group-item sidebar to="/" class="my-1.5"
      >Collectibles</list-group-item
    >
    <list-group-item sidebar to="/">Sports</list-group-item>
    <list-group-item sidebar to="/" class="my-1.5">Utility</list-group-item>
    <list-group-item sidebar to="/">LootBoxes</list-group-item>

    <nftmx-divider class="border-tertiary-900 my-5.25"></nftmx-divider>

    <list-group-accordion open title="My Account">
      <list-group-sub-item sidebar to="/profile"
        >My collections</list-group-sub-item
      >
      <list-group-sub-item sidebar to="/">My ledger</list-group-sub-item>
      <list-group-sub-item sidebar to="/">My offers</list-group-sub-item>
      <list-group-sub-item sidebar to="/">My referrals</list-group-sub-item>
      <list-group-sub-item sidebar to="/">Gift items</list-group-sub-item>
    </list-group-accordion>
    <list-group-accordion open title="Company" class="mt-2.75">
      <list-group-sub-item sidebar to="/">About</list-group-sub-item>
      <list-group-sub-item sidebar to="/">Join the team</list-group-sub-item>
    </list-group-accordion>
    <list-group-accordion open title="Social media" class="mt-2.75">
      <list-group-sub-item sidebar to="/">
        <div class="flex">
          <div class="w-3 mr-4 text-center">
            <font-awesome-icon :icon="['fab', 'facebook-f']" />
          </div>
          Facebook
        </div>
      </list-group-sub-item>
      <list-group-sub-item sidebar to="/">
        <div class="flex">
          <div class="w-3 mr-4 text-center">
            <font-awesome-icon :icon="['fab', 'telegram-plane']" />
          </div>
          Telegram
        </div>
      </list-group-sub-item>
      <list-group-sub-item sidebar to="/">
        <div class="flex">
          <div class="w-3 mr-4 text-center">
            <font-awesome-icon :icon="['fab', 'discord']" />
          </div>
          Discord
        </div>
      </list-group-sub-item>
      <list-group-sub-item sidebar to="/">
        <div class="flex">
          <div class="w-3 mr-4 text-center">
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </div>
          Twitter
        </div>
      </list-group-sub-item>
      <list-group-sub-item sidebar to="/">
        <div class="flex">
          <div class="w-3 mr-4 text-center">
            <font-awesome-icon :icon="['fab', 'medium-m']" />
          </div>
          Medium
        </div>
      </list-group-sub-item>
    </list-group-accordion>
    <list-group-item sidebar to="/" class="mt-3.25">
      Privacy of policy
    </list-group-item>
    <list-group-item sidebar to="/">Terms of service</list-group-item>
    <div class="py-4 flex gap-6">
      <font-awesome-icon
        :icon="['fas', 'moon']"
        :class="[
          themeMode === 'dark' ? 'text-primary-900' : 'text-tertiary-400',
          'text-lg transition hover:text-primary-900 cursor-pointer',
        ]"
        @click="setThemeMode('dark')"
      />
      <font-awesome-icon
        :icon="['fas', 'sun']"
        :class="[
          themeMode === 'light' ? 'text-primary-900' : 'text-tertiary-400',
          'text-lg transition hover:text-primary-900 cursor-pointer',
        ]"
        @click="setThemeMode('light')"
      />
    </div>
    <nftmx-divider class="border-tertiary-900 mt-3"></nftmx-divider>
    <menu-footer />
  </sidebar-container>
</template>
