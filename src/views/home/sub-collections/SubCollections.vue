<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import SubCollectionCard from "@/core/components/cards/SubCollectionCard.vue";
import marketService from "@/core/services/market.service";
import {
  themeConfig,
  defaultPagination,
  CHAIN_ROUTES,
} from "@/core/config/constant";
import { useStore } from "vuex";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";

const props = defineProps({
  ledgerPanelVisible: Boolean,
  collectionFilterOption: Object,
  viewOption: String,
});

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const allContracts = ref({ contracts: [], cursor: null });
const contracts = ref([]);
const limit = ref(2);
const more = computed(
  () =>
    allContracts.value.cursor ||
    allContracts.value.contracts.length > contracts.value.length
);
const loading = ref(true);
const filterOption = computed(() => props.collectionFilterOption);

const retrieveContracts = async () => {
  return new Promise((resolve, reject) => {
    marketService
      .getContracts({
        ...filterOption.value,
        cursor: allContracts.value.cursor,
        limit: 30,
      })
      .then((res) => {
        allContracts.value = {
          contracts: [...allContracts.value.contracts, ...res.data.contracts],
          cursor: res.data.cursor,
        };
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
};
const loadMoreContracts = async () => {
  loading.value = true;
  if (allContracts.value.cursor) await retrieveContracts();
  loading.value = false;
  const sliceLimit = limit.value * 3;
  const nextStartPoint = contracts.value.length;
  contracts.value = contracts.value.concat(
    allContracts.value.contracts.slice(
      nextStartPoint,
      nextStartPoint + sliceLimit
    )
  );
};
const initialContracts = async () => {
  allContracts.value = { contracts: [], cursor: null };
  contracts.value = [];
  loading.value = true;
  await retrieveContracts();
  loading.value = false;
  contracts.value = contracts.value.concat(
    allContracts.value.contracts.slice(0, limit.value * 5)
  );
};

onMounted(() => {
  initialContracts();
});
const setLimitValue = (value) => {
  const lines = Math.ceil(contracts.value.length / limit.value);
  contracts.value = allContracts.value.contracts.slice(0, value * lines);
  limit.value = value;
};
watchEffect(() => {
  if (windowWidth.value >= themeConfig.xl3) {
    props.ledgerPanelVisible ? setLimitValue(4) : setLimitValue(5);
  } else if (windowWidth.value >= themeConfig.xl) {
    props.ledgerPanelVisible ? setLimitValue(3) : setLimitValue(4);
  } else if (windowWidth.value >= themeConfig.lg) {
    props.ledgerPanelVisible ? setLimitValue(2) : setLimitValue(3);
  } else if (windowWidth.value >= themeConfig.sm && !props.ledgerPanelVisible) {
    setLimitValue(2);
  } else {
    setLimitValue(1);
  }
});
watch(filterOption, (value) => {
  initialContracts();
});
</script>

<template>
  <div
    :class="[
      ledgerPanelVisible ? 'lg:pl-5' : 'pl-0',
      'flex-1 -mx-3 -mb-2.5 overflow-auto',
    ]"
  >
    <div>
      <div class="font-press text-base text-white my-2.25 pl-3">
        Subcollections
      </div>
      <div
        v-if="viewOption === 'TILE'"
        :class="[
          ledgerPanelVisible
            ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5',
          'grid pt-0.75',
        ]"
      >
        <sub-collection-card
          v-for="(contract, index) in contracts"
          :key="index"
          :collection="contract"
        />
      </div>
      <div v-if="viewOption === 'LIST'" class="-mt-9.25 pb-2.5">
        <nftmx-table
          class="text-11 tracking-wider leading-4"
          :limitHeight="false"
        >
          <nftmx-thead>
            <tr>
              <th />
              <th />
              <th />
              <th />
              <th />
              <th />
              <th />
              <th
                class="border border-black py-4 text-primary-900 bg-tertiary-800"
                colspan="2"
              >
                100% Liuidity Protection
              </th>
            </tr>
            <nftmx-tr class="border border-black text-left bg-tertiary-800">
              <nftmx-th>Created by</nftmx-th>
              <nftmx-th>Items</nftmx-th>
              <nftmx-th>Owners</nftmx-th>
              <nftmx-th>Unique owners</nftmx-th>
              <nftmx-th>Volume traded</nftmx-th>
              <nftmx-th>Floor change</nftmx-th>
              <nftmx-th>All Time high</nftmx-th>
              <nftmx-th>Minimum slippage</nftmx-th>
              <nftmx-th>Maximum days</nftmx-th>
            </nftmx-tr>
          </nftmx-thead>
          <nftmx-tbody
            :style="{
              border: '1px solid black',
            }"
            class="bg-tertiary-800"
          >
            <nftmx-tr
              v-for="(contract, index) in contracts"
              :key="index"
              class="hover:bg-tertiary-300 transition cursor-pointer"
            >
              <nftmx-td>
                <div class="flex gap-4.5 items-center">
                  <div class="w-11 h-11">
                    <nftmx-img
                      :src="contract.imageUrl"
                      class="h-full w-full object-cover bg-black"
                    />
                  </div>
                  <div>
                    <span>
                      {{ contract.name }}
                    </span>
                  </div>
                </div>
              </nftmx-td>
              <nftmx-td class="text-primary-900">
                {{
                  contract.items.toLocaleString("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  })
                }}
              </nftmx-td>
              <nftmx-td class="text-primary-900">
                {{
                  contract.owners.toLocaleString("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  })
                }}
              </nftmx-td>
              <nftmx-td class="text-primary-900">
                {{
                  contract.owners.toLocaleString("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  })
                }}
              </nftmx-td>
              <nftmx-td class="text-primary-900">
                {{
                  contract.volumeTraded.toLocaleString("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  })
                }}
              </nftmx-td>
              <nftmx-td class="text-primary-900">
                ${{
                  contract.floorPrice.toLocaleString("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  })
                }}
              </nftmx-td>
              <nftmx-td class="text-primary-900">
                {{
                  contract.items.toLocaleString("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  })
                }}
              </nftmx-td>
              <nftmx-td>
                {{
                  contract.items.toLocaleString("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  })
                }}
              </nftmx-td>
              <nftmx-td>
                {{
                  contract.items.toLocaleString("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  })
                }}
              </nftmx-td>
            </nftmx-tr>
          </nftmx-tbody>
        </nftmx-table>
      </div>
    </div>
    <div
      v-if="loading"
      class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
    >
      Loading...
    </div>
    <div
      v-if="!loading && contracts.length === 0"
      class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
    >
      No Collections found
    </div>
    <div class="absolute bottom-1.25 left-0 flex justify-center w-full h-27">
      <div class="text-center w-full px-4 sm:px-10">
        <nftmx-button
          v-if="more"
          color="primary"
          label="SEE MORE"
          :outline="true"
          @click="loadMoreContracts"
          class="font-ibm-bold text-lg text-primary-900 h-13.5 w-full md:w-auto md:px-22.5"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-center {
  text-align: -webkit-center;
}
</style>
