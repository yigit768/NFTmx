<script setup>
import { useWindowSize } from "@vueuse/core";
import { onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import NftmxLayout from "./layouts/NftmxLayout.vue";
import { connectors } from "./core/config/constant";
import { useEthers, useWallet } from "vue-dapp";

const { wallet, autoConnect } = useWallet();
const { address } = useEthers();

const store = useStore();
const router = useRouter();

watch(address, (val) => {
  if (val) {
    store.dispatch("auth/login", val).then((res) => {
      if (router.currentRoute.value.path === "/login") {
        router.push("/profile");
      }
    });
    store.dispatch("market/setWeb3", wallet.provider, val);
  } else {
    store.dispatch("auth/login", null).then((res) => {
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push("/login");
      }
    });
  }
});

onMounted(async () => {
  try {
    await autoConnect(connectors);

    store.commit("app/UPDATE_WINDOW_WIDTH", window.innerWidth);
    store.commit("market/setCoinPrice");
  } catch (err) {
    console.error(err);
    // return;
  }
});

setInterval(async () => {
  try {
    await autoConnect(connectors);
  } catch (err) {
    console.error("auto connect err", err);
    // return;
  }
}, 5000);

setInterval(async () => {
  store.commit("market/setCoinPrice");
}, 60000);

const { width: windowWidth } = useWindowSize();
watch(windowWidth, (val) => {
  store.commit("app/UPDATE_WINDOW_WIDTH", val);
});
</script>

<template>
  <nftmx-layout />
</template>
