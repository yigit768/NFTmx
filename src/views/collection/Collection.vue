<script setup>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import BodyContainer from "@/core/container/BodyContainer.vue";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import { onMounted, ref } from "vue";
import Items from "./Items.vue";
import History from "./History.vue";
import marketService from "@/core/services/market.service";
import CollectionHeader from "./CollectionHeader.vue";
import { getChainKey } from "@/core/utils/common";
import { owner } from "../../core/utils/contracts/erc721.utils";
import ListGroupAccordion from "@/core/components/accordion/ListGroupAccordion.vue";
import ListGroupSubItem from "@/core/components/basic/ListGroupSubItem.vue";

const store = useStore();
const route = useRoute();
const chain = route.params.chain;
const chainKey = getChainKey(chain);
const contractAddress = route.params.contractAddress;
const collection = ref({});
const tab = ref("ITEMS");
onMounted(() => {
  marketService.getContract(chain, contractAddress).then((res) => {
    collection.value = res.data;

    if (!collection.value.bannerUrl) {
      collection.value.bannerUrl =
        "/images/components/default_collection_banner.png";
    }
  });
});
</script>

<template>
  <div
    class="w-full h-62.5 bg-black"
    :style="{
      background: 'url(' + collection.bannerUrl + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#222222',
    }"
  />
  <body-container>
    <collection-header
      :collection="collection"
      :contractAddress="contractAddress"
    />
    <div class="border-t border-t-black border-b border-b-tertiary-800" />
    <div class="relative">
      <div
        class="xl:absolute top-3 lg:flex font-ibm-medium text-sm my-6 hidden"
      >
        <div
          @click="tab = 'ITEMS'"
          :class="[
            tab === 'ITEMS' ? 'text-primary-900' : 'text-white',
            'transition hover:text-primary-900 cursor-pointer pr-4.75 border-r border-r-black',
          ]"
        >
          Collections For Sale
        </div>
        <div
          @click="tab = 'HISTORY'"
          :class="[
            tab === 'HISTORY' ? 'text-primary-900' : 'text-white',
            'transition  hover:text-primary-900 cursor-pointer px-4.75 border-l border-l-tertiary-800',
          ]"
        >
          Trading History
        </div>
      </div>
      <list-group-accordion
        :title="tab === 'ITEMS' ? 'Collections For Sale' : 'Trading History'"
        class="my-3.25 overflow-hidden lg:hidden"
      >
        <list-group-sub-item @click="tab = 'ITEMS'">
          Collections For Sale
        </list-group-sub-item>
        <list-group-sub-item @click="tab = 'HISTORY'">
          Trading History
        </list-group-sub-item>
      </list-group-accordion>
    </div>
    <div
      class="xl:hidden border-t border-t-black border-b border-b-tertiary-800"
    />
    <items v-if="tab === 'ITEMS'" :contractId="collection.id" />
    <history v-if="tab === 'HISTORY'" />
  </body-container>
</template>
