<script setup>
import { computed, onMounted, ref } from "vue";
import AuthenticModal from "./AuthenticModal.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Web3 from "web3/dist/web3.min.js";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { useStore } from "vuex";
import { themeConfig } from "@/core/config/constant";
import { useRoute } from "vue-router";
import CollectionReportModal from "@/core/components/modal/CollectionReportModal.vue";

const props = defineProps({
  collection: Object,
  contractAddress: String,
});

const store = useStore();
const userId = computed(() => store.getters["auth/userId"]);
const route = useRoute();
const chain = route.params.chain;
const windowWidth = computed(() => store.state.app.windowWidth);
const authenticModal = ref(false);
const reportModal = ref(false);
const items = computed(() =>
  props.collection.items
    ? props.collection.items.toLocaleString("en-US", {
        notation: "compact",
        compactDisplay: "short",
      })
    : 0
);
const subItems = computed(() =>
  props.collection.subItems
    ? props.collection.subItems.toLocaleString("en-US", {
        notation: "compact",
        compactDisplay: "short",
      })
    : 0
);
const owners = computed(() =>
  props.collection.owners
    ? props.collection.owners.toLocaleString("en-US", {
        notation: "compact",
        compactDisplay: "short",
      })
    : 0
);
const floorPrice = computed(() =>
  props.collection.floorPrice
    ? props.collection.floorPrice.toLocaleString("en-US", {
        notation: "compact",
        compactDisplay: "short",
      })
    : 0
);
const volume = computed(() =>
  props.collection.volumeTraded
    ? props.collection.volumeTraded.toLocaleString("en-US", {
        notation: "compact",
        compactDisplay: "short",
      })
    : 0
);
</script>

<template>
  <div class="lg:flex gap-8 mt-8.75">
    <div class="flex gap-6 lg:block">
      <div>
        <div
          class="w-23 h-23 md:w-30 md:h-30 lg:w-50 lg:h-50 shadow-default shadow-primary-900 text-6xl"
        >
          <nftmx-img
            :src="collection.imageUrl"
            class="w-full h-full object-cover object-center"
          />
        </div>
        <div
          class="flex gap-2 mt-3 justify-center cursor-pointer text-primary-900 transition hover:text-primary-200"
          @click="authenticModal = true"
        >
          <div class="w-4 h-4 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647z"
              />
            </svg>
          </div>
          <span class="text-11">Check NFT Authenticity</span>
        </div>
      </div>
      <div v-if="windowWidth < themeConfig.lg">
        <div class="font-press text-white text-xl md:text-2xl">
          <nftmx-trim-string :line="windowWidth > themeConfig.xl2 ? 1 : 2">
            {{ collection.name }}
          </nftmx-trim-string>
        </div>
        <div class="flex justify-between">
          <div class="font-ibm text-xs mt-2.25">
            <span class="text-tertiary-400"> Created by </span>
            <span class="text-primary-900">{{ collection.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 py-3.5">
      <div class="2xl:flex gap-6 items-start justify-between">
        <div v-if="windowWidth >= themeConfig.lg">
          <div class="font-press text-white text-2xl xl:text-3xl">
            <nftmx-trim-string :line="windowWidth > themeConfig.xl2 ? 1 : 2">
              {{ collection.name }}
            </nftmx-trim-string>
          </div>
          <div class="flex justify-between">
            <div class="flex gap-2 font-ibm text-xs mt-2.25">
              <div class="text-tertiary-400">Created by</div>
              <div class="text-primary-900">{{ collection.name }}</div>
            </div>
          </div>
        </div>
        <div
          class="flex justify-center sm:justify-start text-white text-sm mt-2"
        >
          <div
            class="flex justify-center sm:justify-start border border-black divide-x divide-black cursor-pointer"
          >
            <a
              :href="collection.website"
              target="_blank"
              class="transition w-8 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fas', 'globe']" />
            </a>
            <a
              :href="collection.twitter"
              target="_blank"
              class="transition w-7.75 h-8 px-2.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </a>
            <a
              :href="collection.instagram"
              target="_blank"
              class="transition w-7.75 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'medium-m']" />
            </a>
            <a
              :href="collection.instagram"
              target="_blank"
              class="transition w-7.75 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'telegram-plane']" />
            </a>
            <a
              :href="collection.instagram"
              target="_blank"
              class="transition w-7.75 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'discord']" />
            </a>
            <a
              :href="collection.instagram"
              target="_blank"
              class="transition w-7.5 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'instagram']" />
            </a>
            <router-link
              v-if="
                userId && collection.owner && collection.owner.id === userId
              "
              :to="{
                name: 'collection_setting',
                params: { chain: chain, contractAddress: contractAddress },
              }"
              class="w-8 transition h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fas', 'edit']" />
            </router-link>
            <div
              v-else
              class="w-8 transition h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
              @click="reportModal = true"
            >
              <font-awesome-icon :icon="['fas', 'flag']" />
            </div>
          </div>
        </div>
        <div
          v-if="windowWidth < themeConfig.lg"
          class="text-primary-900 flex justify-center sm:justify-start gap-2 text-11 mt-2.75"
        >
          <svg style="width: 18px; height: 18px" viewBox="0 0 24 24">
            <path
              fill="white"
              d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"
            />
            <path
              fill="currentColor"
              d="M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9Z"
            />
          </svg>
          <span>Check NFT Authenticity</span>
        </div>
      </div>
      <div class="flex justify-between items-end mt-4.25 xl:mt-6.25 flex-wrap">
        <div>
          <div
            class="flex flex-wrap xl:grid xl:grid-cols-7 gap-8 xl:gap-0 w-full font-ibm-medium"
          >
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-r border-r-black pr-4.75'
                  : '',
                ' my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">Collection</div>
              <div class="text-base sm:text-lg text-white -mt-px">
                {{ items }}
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">
                Subcollection
              </div>
              <div class="text-base sm:text-lg text-white -mt-px">
                {{ subItems }}
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">Owners</div>
              <div class="text-base sm:text-lg text-white -mt-px">
                {{ owners }}
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">
                Unique Owners
              </div>
              <div class="text-base sm:text-lg text-white -mt-px">
                {{ owners }}
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">1H Change</div>
              <div class="text-base sm:text-lg text-red-900 -mt-px">
                {{ -0.35 }}%
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">24H Change</div>
              <div class="text-base sm:text-lg text-primary-900 -mt-px">
                {{ +1.45 }}%
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800  px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">7D Change</div>
              <div class="text-base sm:text-lg text-primary-900 -mt-px">
                {{ +32.53 }}%
              </div>
            </div>
          </div>
          <div
            class="flex flex-wrap xl:grid xl:grid-cols-7 gap-8 xl:gap-0 w-full font-ibm-medium"
          >
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-r border-r-black pr-4.75'
                  : '',
                ' my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">Top Bid</div>
              <div class="text-base sm:text-lg text-white -mt-px">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                {{ 1.2334 }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">[$2.63k]</div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">Bottom Bid</div>
              <div class="text-base sm:text-lg text-white -mt-px">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                {{ 0.1253 }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">[$0.33k]</div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">
                Offers Pending
              </div>
              <div class="text-base sm:text-lg text-white -mt-px">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                {{ 0.1253 }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">[$0.33k]</div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">
                Floor Price
              </div>
              <div class="text-base sm:text-lg text-white -mt-px">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                {{ 2.2365 }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">[$3.6k]</div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">ATH Price</div>
              <div class="text-base sm:text-lg text-white -mt-px">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                {{ 0.1253 }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">[$0.33k]</div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">24H Volume</div>
              <div class="text-base sm:text-lg text-white -mt-px">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                {{ 0.1253 }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">[$0.33k]</div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800  px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">7D Volume</div>
              <div class="text-base sm:text-lg text-white -mt-px">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                {{ 0.1253 }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">[$0.33k]</div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-row 3xl:flex-col gap-10.5 text-xs text-primary-900 mb-1 order-2 2xl:order-1 mt-4 3xl:mt-0"
        >
          <button
            class="font-press border-2 text-tertiary-700 border-tertiary-700 flex justify-center items-center gap-3 h-13.5 pl-6 pr-5 shadow-default shadow-tertiary-700 transition cursor-not-allowed"
          >
            <span>Initial Offering</span>
          </button>
          <button
            class="font-press border-2 text-tertiary-700 border-tertiary-700 flex justify-center items-center gap-3 h-13.5 pl-6 pr-5 shadow-default shadow-tertiary-700 transition cursor-not-allowed"
          >
            <span>Derivatives Offering</span>
          </button>
          <!-- <button
            class="font-press border-2 border-primary-900 flex justify-center items-center gap-3 h-13.5 pl-6 pr-5 shadow-default shadow-primary-900 transition hover:bg-black"
          >
            <span>Initial Offering</span>
          </button>
          <button
            class="font-press border-2 text-secondary-900 border-secondary-900 flex justify-center items-center gap-3 h-13.5 pl-6 pr-5 shadow-default shadow-secondary-900 transition hover:bg-black"
          >
            <span>Derivatives Offering</span>
          </button> -->
        </div>
        <div
          class="text-white text-sm leading-6 my-5.5 xl:mt-6.5 xl:mb-9 w-full order-1"
        >
          {{ collection.description }}
        </div>
      </div>
    </div>
    <authentic-modal v-model="authenticModal" />
    <collection-report-modal v-model="reportModal" />
  </div>
</template>
