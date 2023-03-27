<script setup>
import AccountHeader from "./AccountHeader.vue";
import BodyContainer from "@/core/container/BodyContainer.vue";
import { useStore } from "vuex";
import { themeConfig } from "@/core/config/constant";
import ListGroupAccordion from "@/core/components/accordion/ListGroupAccordion.vue";
import ListGroupItem from "@/core/components/basic/ListGroupItem.vue";
import ListGroupSubItem from "@/core/components/basic/ListGroupSubItem.vue";
import Collections from "./tabs/collections/Collections.vue";
import Ledger from "./tabs/ledger/Ledger.vue";
import { onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import authService from "@/core/services/auth.service";
import Web3 from "web3/dist/web3.min.js";

const store = useStore();
const route = useRoute();
const accountAddress = route.params.address.toLowerCase();
const account = ref();

const tab = ref(
  route.query.category === "ledger" ? "Ledger" : "My Collections"
);

const selectTab = (value) => {
  tab.value = value;
};

onMounted(() => {
  authService
    .findUser(accountAddress)
    .then((res) => {
      account.value = res.data;
    })
    .catch((err) => {
      console.log("err:", err);
    });
});
watchEffect(() => {
  if (route.query.category === "ledger") {
    tab.value = "Ledger";
  }
});
</script>

<template>
  <account-header :account="account" />
  <body-container>
    <div class="pt-3 pb-4 sm:pt-3 sm:pb-7.75">
      <div
        v-if="store.state.app.windowWidth > themeConfig.sm"
        class="flex justify-between text-white font-ibm-medium text-sm"
      >
        <div class="flex gap-5 items-center">
          <list-group-item
            :active="tab === 'My Collections'"
            @click="selectTab('My Collections')"
          >
            My Collections
          </list-group-item>
          <div
            class="border-l border-black border-r border-r-tertiary-700 h-4.25"
          />
          <list-group-item
            :active="tab === 'Ledger'"
            @click="selectTab('Ledger')"
          >
            Ledger
          </list-group-item>
        </div>
      </div>
      <list-group-accordion
        v-if="store.state.app.windowWidth <= themeConfig.sm"
        :title="tab"
        active
      >
        <list-group-sub-item
          :active="tab === 'My Collections'"
          @click="selectTab('My Collections')"
        >
          My Collections
        </list-group-sub-item>
        <list-group-sub-item
          :active="tab === 'Ledger'"
          @click="selectTab('Ledger')"
        >
          Ledger
        </list-group-sub-item>
      </list-group-accordion>
    </div>
    <div class="border-t border-black" />
    <div>
      <collections v-if="tab === 'My Collections'" :account="account" />
      <ledger v-if="tab === 'Ledger'" :account="account" />
    </div>
  </body-container>
</template>
