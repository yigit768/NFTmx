<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import Derivatives from "./Derivatives.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import Cart from "./Cart.vue";

const defaultFilterOptions = [
  {
    title: "Most Value",
    option: {
      chain: "ETHEREUM",
      sortBy: "HIGH_TO_LOW",
    },
  },
  {
    title: "Most New",
    option: {
      chain: "ETHEREUM",
      sortBy: "NEW",
    },
  },
  {
    title: "Most Activity",
    option: {
      chain: "ETHEREUM",
      sortBy: "ACTIVITY",
    },
  },
  {
    title: "Most View",
    option: {
      chain: "ETHEREUM",
      sortBy: "VIEW",
    },
  },
  {
    title: "Most Liked",
    option: {
      chain: "ETHEREUM",
      sortBy: "LIKED",
    },
  },
];

const props = defineProps({
  ledgerPanelVisible: Boolean,
  filterOption: Object,
  isCartOpened: Boolean,
  viewOption: String,
});

const assetFilterOption = computed(() => props.filterOption);
const filterOptions = ref([]);
const selectedFilterOptions = ref([]);
const more = computed(
  () => filterOptions.value.length > selectedFilterOptions.value.length
);

const setFilterOption = (filterOption) => {
  if (
    !filterOption.name &&
    !filterOption.min &&
    !filterOption.max &&
    !filterOption.minSlippage &&
    !filterOption.maxSlippage &&
    filterOption.collection.length === 0 &&
    !filterOption.sortBy &&
    !filterOption.buyNow &&
    !filterOption.onAuction &&
    !filterOption.hasOffer &&
    !filterOption.hasNoOffer &&
    !filterOption.recentSold &&
    !filterOption.recentCancel &&
    !filterOption.endingSoon &&
    !filterOption.safeDownside
  ) {
    filterOptions.value = defaultFilterOptions.map((option) => {
      return {
        title: option.title,
        option: {
          ...filterOption,
          sortBy: option.option.sortBy,
        },
      };
    });
    selectedFilterOptions.value = filterOptions.value.slice(0, 3);
  } else {
    filterOptions.value = [{ title: "Explore", option: filterOption }];
    selectedFilterOptions.value = filterOptions.value;
  }
};
onMounted(() => {
  setFilterOption(props.filterOption);
  selectedFilterOptions.value = filterOptions.value.slice(0, 5);
});
const loadMore = () => {
  selectedFilterOptions.value = filterOptions.value;
};
watch(assetFilterOption, (filterOption) => {
  setFilterOption(filterOption);
});
</script>

<template>
  <div class="flex-1 flex -mb-11.5">
    <div class="flex-1 lg:pl-1.5 -mr-4 -ml-4 lg:-ml-0 overflow-auto">
      <div>
        <derivatives
          v-for="(item, index) in selectedFilterOptions"
          :key="index"
          :title="item.title"
          :filterOption="item.option"
          :ledgerPanelVisible="ledgerPanelVisible"
          :first="index === 0"
          :isCartOpened="isCartOpened"
          :viewOption="viewOption"
        />
      </div>
      <div class="absolute bottom-0 left-0 flex justify-center w-full h-26">
        <div class="text-center w-full px-4 sm:px-10">
          <nftmx-button
            v-if="more"
            color="primary"
            label="SEE MORE"
            :outline="true"
            @click="loadMore"
            class="font-ibm-bold text-lg text-primary-900 h-13.5 w-full md:w-auto md:px-22.5"
          />
        </div>
      </div>
    </div>
    <cart :nftCart="isCartOpened" :chain="filterOption.chain" />
  </div>
</template>

<style scoped>
.text-center {
  text-align: -webkit-center;
}
</style>
