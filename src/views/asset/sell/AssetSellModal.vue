<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useStore } from "vuex";
import {
  keyCodeNumberRange,
  formatAMPM,
  getChainKey,
} from "@/core/utils/common";
import NftmxHashtag from "@/core/components/basic/NftmxHashtag.vue";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import marketService from "@/core/services/market.service";
import { useToast } from "vue-toastification";
import { $vfm } from "vue-final-modal";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import {
  BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
  BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS,
  BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS,
  ChainIcons,
  MainToken,
  saleType,
} from "@/core/config/constant";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import CardCarousel from "@/core/components/carousel/CardCarousel.vue";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "@/core/utils/contracts/erc721.utils.js";
import { createMLR } from "@/core/utils/contracts/mlr-factory.utils.js";
import { createMlrOrder } from "@/core/utils/contracts/mlr.utils.js";
import { createOrder } from "@/core/utils/contracts/market.utils.js";
import DatePicker from "@/core/components/v-calendar/src/components/DatePicker/DatePicker.vue";
import { useEthers, useWallet } from "vue-dapp";
import BasicCheckbox from "@/core/components/basic/BasicCheckbox.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef.js";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";

const props = defineProps({
  asset: {
    type: Object,
    default: {},
  },
});

const emit = defineEmits(["update-asset"]);

const { chainId, address } = useEthers();
const { onChainChanged, onAccountsChanged, wallet } = useWallet();
const store = useStore();
const computedAsset = computed(() => props.asset);
const route = useRoute();
const chain = route.params.chain;
const chainKey = getChainKey(chain);
const tokenAddress = route.params.tokenAddress;
const tokenId = route.params.tokenId;
const askingPrice = ref();
const slippage = ref();
const sale = ref(saleType.FIX_SALE);
const openEndSaleTimePicker = ref(false);
const endTimePicker = ref();
const endTime = computed(() => {
  if (endTimePicker.value) {
    return (
      endTimePicker.value.toLocaleString("default", { month: "long" }) +
      " " +
      endTimePicker.value.getDate() +
      ", " +
      endTimePicker.value.getFullYear() +
      " " +
      formatAMPM(endTimePicker.value) +
      " UTC"
    );
  } else {
    return "Choose date and time";
  }
});
const toast = useToast();
const waiting = ref(false);
const warn = ref(false);
const period = ref();
const tokenImage = computed(() => {
  if (props.asset.nfts) {
    return props.asset.nfts.map((nft) => nft.image512);
  } else {
    return [];
  }
});
const royalty = ref(false);
const ownershipToKeep = ref();
const buyoutPrice = ref();
const maxRoyaltyOwners = ref(100);
const approvedStatusToMarket = ref(true);
const approvedStatusToMlr = ref(true);
const loading = ref(false);
const staking = ref(true);
const deploySyndication = ref(false);
const hashtag = useDebouncedRef("", 1000);
const hashtags = ref([]);
const selectedHashtags = ref([]);
const hashtagSection = ref(false);

const createNewMarketOrder = async () => {
  if (
    !askingPrice.value ||
    isNaN(slippage.value) ||
    isNaN(period.value) ||
    (sale.value === saleType.AUCTION && !endTimePicker.value)
  ) {
    warn.value = true;
    toast.error("Please fill out the fields");
    loading.value = false;
    return;
  }
  createHashTags();

  if (props.asset.mlrContract) {
    const data = [
      store.state.web3.utils.toWei("0", "ether"),
      1,
      store.state.web3.utils.toWei(askingPrice.value.toString()),
      (100 - slippage.value) * 100,
      false,
      period.value * 86400, // convert day into sec
      sale.value === saleType.AUCTION,
      endTimePicker.value
        ? (endTimePicker.value.getTime() / 1000).toFixed()
        : "0",
    ];
    createMlrOrder(props.asset.mlrContract.address, data)
      .then((res) => {
        toast.success("Your item has been listed!");
        emit("update-asset", deploySyndication.value);
        cancel();
      })
      .catch((err) => {
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong.");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    const data = [
      tokenAddress,
      tokenId,
      store.state.web3.utils.toWei(askingPrice.value.toString()),
      staking.value,
      (100 - slippage.value) * 100,
      false,
      period.value * 86400, // convert day into sec
      sale.value === saleType.AUCTION,
      endTimePicker.value
        ? (endTimePicker.value.getTime() / 1000).toFixed()
        : "0",
    ];
    createOrder([data])
      .then((res) => {
        toast.success("Your item has been listed!");
        emit("update-asset", deploySyndication.value);
        cancel();
      })
      .catch((err) => {
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong.");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
const createNewMlrOrder = async () => {
  if (
    !askingPrice.value ||
    isNaN(slippage.value) ||
    isNaN(period.value) ||
    !ownershipToKeep.value ||
    !buyoutPrice.value ||
    (sale.value === saleType.AUCTION && !endTimePicker.value)
  ) {
    warn.value = true;
    toast.error("Please fill out the fields");
    loading.value = false;
    return;
  }
  if (props.asset.mlrContract) {
    const data = [
      store.state.web3.utils.toWei(buyoutPrice.value.toString()),
      ownershipToKeep.value,
      store.state.web3.utils.toWei(askingPrice.value.toString()),
      (100 - slippage.value) * 100,
      false,
      period.value * 86400, // convert day into sec
      sale.value === saleType.AUCTION,
      endTimePicker.value
        ? (endTimePicker.value.getTime() / 1000).toFixed()
        : "0",
    ];
    createMlrOrder(props.asset.mlrContract.address, data)
      .then((res) => {
        toast.success("Your item has been listed!");
        emit("update-asset", deploySyndication.value);
        cancel();
      })
      .catch((err) => {
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong.");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    createMLR([
      [
        tokenAddress,
        tokenId,
        maxRoyaltyOwners.value,
        props.asset.contract.name,
        props.asset.name,
        props.asset.contract.symbol,
        store.state.web3.utils.toWei(buyoutPrice.value.toString()),
        ownershipToKeep.value,
        store.state.web3.utils.toWei(askingPrice.value.toString()),
        (100 - slippage.value) * 100,
        false,
        period.value * 86400, // convert day into sec
        sale.value === saleType.AUCTION,
        endTimePicker.value
          ? (endTimePicker.value.getTime() / 1000).toFixed()
          : "0",
      ],
    ])
      .then((res) => {
        toast.success("Your item has been listed!");
        emit("update-asset", deploySyndication.value);
        cancel();
      })
      .catch((err) => {
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong.");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
const createNewOrder = async () => {
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }
  try {
    loading.value = true;
    await wallet.connector.switchChain(97);
    if (royalty.value) {
      createNewMlrOrder();
    } else {
      createNewMarketOrder();
    }
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};
const createHashTags = () => {
  if (selectedHashtags.value.length > 0) {
    marketService.createHashTags(
      chain,
      selectedHashtags.value,
      tokenAddress,
      tokenId
    );
  }
};
const deselectHashtag = (value) => {
  selectedHashtags.value = selectedHashtags.value.filter(
    (name) => name !== value
  );
};
const cancel = () => {
  $vfm.hide("sellModal");
};
const clickOutsideEndTimePicker = () => {
  openEndSaleTimePicker.value = false;
};
const approve = async () => {
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }

  try {
    loading.value = true;
    await wallet.connector.switchChain(97);

    if (royalty.value) {
      setApprovalForAll(
        tokenAddress,
        BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS,
        true
      )
        .then((res) => {
          approvedStatusToMlr.value = true;
          toast.success("NFT is approved successfully.");
        })
        .catch((err) => {
          if (err.code === 4001) {
            toast.error("User denied transaction signature.");
          } else {
            toast.error("Something went wrong");
          }
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      setApprovalForAll(tokenAddress, BSC_TESTNET_MARKET_CONTRACT_ADDRESS, true)
        .then((res) => {
          approvedStatusToMarket.value = true;
          toast.success("NFT is approved successfully.");
        })
        .catch((err) => {
          if (err.code === 4001) {
            toast.error("User denied transaction signature.");
          } else {
            toast.error("Something went wrong");
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }
    getApprovedStatus();
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};
const getApprovedStatus = async () => {
  if (chainId.value !== 97) return;
  approvedStatusToMlr.value = await isApprovedForAll(
    tokenAddress,
    address.value,
    BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS
  );
  approvedStatusToMarket.value = await isApprovedForAll(
    tokenAddress,
    address.value,
    BSC_TESTNET_MARKET_CONTRACT_ADDRESS
  );
};
const getHashtags = () => {
  marketService.getHashtagNames(hashtag.value, 20).then((res) => {
    hashtags.value = res.data.filter(
      (item) => selectedHashtags.value.indexOf(item.name) === -1
    );
  });
};
const selectHashtag = (item) => {
  const index = hashtags.value.findIndex((i) => i.id === item.id);
  hashtags.value.splice(index, 1);
  selectedHashtags.value.push(item.name);
};

watch(hashtag, () => {
  getHashtags();
});
onMounted(() => {
  getHashtags();
  getApprovedStatus();
});
onChainChanged((id) => {
  getApprovedStatus();
});
onAccountsChanged(() => {
  getApprovedStatus();
});
watch(computedAsset, (data) => {
  selectedHashtags.value = data.hashtags || [];
  hashtags.value = hashtags.value.filter(
    (item) => selectedHashtags.value.indexOf(item.name) === -1
  );
});
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="sellModal"
    esc-to-close
    fit-parent
  >
    <div class="bg-tertiary-900 text-white xl:w-modal-md 3xl:w-modal-big">
      <div class="text-right text-xl p-5">
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="cursor-pointer hover:text-tertiary-400 transition"
          @click="cancel"
        />
      </div>
      <div class="text-center relative mt-1.75 pb-2.5">
        <div class="font-press text-2xl mx-6">List Item for Sale</div>
      </div>
      <div class="grid grid-cols-8 text-white py-9 px-4 lg:pl-17.5 lg:pr-17">
        <div class="col-span-full lg:col-span-3 lg:-mr-3.5 3xl:pr-2.25">
          <div
            v-if="asset.tokenAddress !== BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS"
            class="relative overflow-hidden p-6 border border-black w-full pt-70per"
          >
            <nftmx-img
              :src="asset.image512"
              class="w-full h-full absolute object-cover left-0 top-0 bg-black text-6xl"
            />
          </div>
          <div
            v-if="asset.tokenAddress === BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS"
            class="relative overflow-hidden border border-black w-full pt-70per"
          >
            <div class="absolute top-0 left-0 w-full h-full bg-black text-6xl">
              <card-carousel small :images="tokenImage" />
            </div>
          </div>
          <div class="flex w-full text-sm font-ibm-bold mt-7">
            <div class="pt-0.75">
              <div class="text-primary-900">
                {{ asset?.owner?.name || "No name" }}
              </div>
              <div class="text-2xl mt-1.5">
                {{ asset.name || "#" + asset.tokenId }}
              </div>
            </div>
            <div class="grow"></div>
            <div class="py-0.5">
              <div>Price</div>
              <div class="text-sm font-ibm-light flex items-center mt-3">
                <img v-lazy="ChainIcons[chainKey]" class="w-4 h-4 mr-2.5" />
                0
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-span-full lg:col-span-5 relative text-lg font-ibm-medium mr-0.5 lg:pl-10.25 3xl:pl-9 ml-px mt-5 lg:mt-0"
        >
          <div
            class="grid grid-cols-2 gap-4 items-center w-full justify-between font-ibm text-13"
          >
            <div
              @click="royalty = false"
              class="flex gap-3 items-center w-fit cursor-pointer"
            >
              <nftmx-radio :active="!royalty" />
              <div class="flex flex-1">
                <span>Sell 100% of your ownership</span>
                <nftmx-tooltip text="Sell 100% of your ownership">
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10"
                  />
                </nftmx-tooltip>
              </div>
            </div>
            <div
              @click="royalty = true"
              class="flex gap-3 items-center w-fit cursor-pointer"
            >
              <nftmx-radio :active="royalty" />
              <div class="flex flex-1">
                <span>Retain a percentage of ownership</span>
                <nftmx-tooltip text="Retain a percentage of ownership">
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10 cursor-pointer"
                  />
                </nftmx-tooltip>
              </div>
            </div>
          </div>
          <div class="border-t border-primary-900 mt-6 mb-6" />
          <div class="flex">
            Type of sale
            <nftmx-tooltip
              text="The NFT Protection marketplace supports fixed sale and auction capabilities. Both options have the ability to add Liquidity Protection and DAO syndication."
            >
              <font-awesome-icon
                :icon="['fas', 'question-circle']"
                class="ml-1 text-10 cursor-pointer"
              />
            </nftmx-tooltip>
          </div>
          <div class="flex my-3">
            <nftmx-button
              outline
              color="primary-900"
              label="FIXED SALE"
              :class="[
                sale === saleType.FIX_SALE ? 'bg-tertiary-700' : '',
                'font-ibm-medium text-sm pt-3.5 pb-4 border-2 border-black w-1/2 hover:bg-tertiary-700 text-primary-900 tracking-wide',
              ]"
              @click="sale = saleType.FIX_SALE"
            />
            <nftmx-button
              outline
              color="primary-900"
              label="AUCTION"
              :class="[
                sale === saleType.AUCTION ? 'bg-tertiary-700' : '',
                'font-ibm-medium text-sm pt-3.5 pb-4 border-2 border-black border-l-0 w-1/2 text-primary-900 hover:bg-tertiary-700 tracking-wide',
              ]"
              @click="sale = saleType.AUCTION"
            />
          </div>
          <div>
            <div class="grid sm:grid-cols-2 gap-6 mt-8 relative">
              <div>
                <div v-if="sale === saleType.FIX_SALE">Asking price</div>
                <div v-if="sale === saleType.AUCTION" class="flex">
                  Soft cap
                  <nftmx-tooltip
                    text="Soft cap is the minimum amount the Auction must reach in order for the sale to take place."
                  >
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </nftmx-tooltip>
                </div>
                <div
                  :class="[
                    warn && !askingPrice ? 'border-red-800' : 'border-black',
                    'flex mt-3.5 font-ibm text-sm border-2 bg-tertiary-700',
                  ]"
                >
                  <div
                    class="w-12.5 h-12.5 flex items-center justify-center text-lg gap-4 bg-black"
                  >
                    <div
                      v-if="chain === 'BSC-TESTNET'"
                      class="text-xs w-4 h-4 text-primary-900"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Binance</title>
                        <path
                          class="fill-white"
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    <font-awesome-icon
                      v-if="chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                    />
                  </div>
                  <nftmx-input
                    v-model="askingPrice"
                    number
                    border="none"
                    :min="0"
                    placeholder="Type Amount"
                    class="flex-1"
                  />
                </div>
              </div>
              <div v-if="sale === saleType.AUCTION" class="relative">
                <div>
                  <div>End auction in</div>
                  <div
                    @click="openEndSaleTimePicker = !openEndSaleTimePicker"
                    class="flex mt-3.5 font-ibm text-sm cursor-pointer"
                  >
                    <div
                      :class="[
                        warn && !endTimePicker
                          ? 'border-red-800'
                          : 'border-black',
                        'flex items-center gap-5 border-2 h-13.5 text-white bg-tertiary-700 w-full pl-5 font-ibm-light text-sm',
                      ]"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'calendar-alt']"
                        class="text-lg ml-0.75 mr-0.5"
                      />
                      {{ endTime }}
                    </div>
                  </div>
                </div>
                <div class="absolute w-full z-30">
                  <date-picker
                    v-if="openEndSaleTimePicker"
                    v-click-outside="clickOutsideEndTimePicker"
                    mode="dateTime"
                    v-model="endTimePicker"
                    :min-date="new Date()"
                    color="red"
                    is-dark
                    is-expanded
                  />
                </div>
              </div>
              <div v-if="sale === saleType.FIX_SALE" class="relative">
                <div>
                  <div>Payment method</div>
                  <div
                    class="flex items-center justify-center h-12.5 mt-3.5 font-ibm text-sm gap-5"
                  >
                    <div v-if="chain === 'BSC-TESTNET'" class="w-8 h-8">
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Binance</title>
                        <path
                          class="fill-tertiary-400"
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    <font-awesome-icon
                      v-if="chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                      class="text-4xl text-tertiary-400"
                    />
                    {{ MainToken[chainKey] }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="royalty" class="border-t border-primary-900 mt-6 mb-6" />
          <div v-if="royalty" class="grid 3xl:grid-cols-2 gap-5.75">
            <div>
              <div class="flex">
                My ownership to keep
                <nftmx-tooltip
                  text="Benefit from APY returns when utilizing Liquidity Protection to sell a NFT property. You earn APY on the amount of purchase price once the buyer purchases the NFT for the entire protection period."
                >
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10 cursor-pointer"
                  />
                </nftmx-tooltip>
              </div>
              <div
                :class="[
                  warn && !ownershipToKeep ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <nftmx-input
                  v-model="ownershipToKeep"
                  number
                  border="none"
                  :min="0"
                  :max="100"
                  placeholder="0"
                />
                <div
                  class="w-14 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  %
                </div>
              </div>
            </div>
            <div>
              <div class="flex">
                Buyout asking price
                <nftmx-tooltip
                  text="Selecting this option allows DAOs to join the syndication contract and purchase the NFT."
                >
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10 cursor-pointer"
                  />
                </nftmx-tooltip>
              </div>
              <div
                :class="[
                  warn && !buyoutPrice ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <div
                  class="w-14 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  <nftmx-img :src="ChainIcons[chainKey]" />
                </div>
                <nftmx-input
                  v-model="buyoutPrice"
                  number
                  border="none"
                  :min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div class="border-t border-primary-900 mt-6 mb-6" />
          <div class="grid 3xl:grid-cols-3 gap-5.75">
            <div>
              <div class="flex">
                Protection period
                <nftmx-tooltip
                  text="Benefit from APY returns when utilizing Liquidity Protection to sell a NFT property. You earn APY on the amount of purchase price once the buyer purchases the NFT for the entire protection period."
                >
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10 cursor-pointer"
                  />
                </nftmx-tooltip>
              </div>
              <div
                :class="[
                  warn && isNaN(period) ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <nftmx-input
                  v-model="period"
                  number
                  border="none"
                  :min="0"
                  placeholder="0"
                />
                <div
                  class="w-30 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  DAYS
                </div>
              </div>
            </div>
            <div>
              <div>Slippage fee</div>
              <div
                :class="[
                  warn && isNaN(slippage) ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <nftmx-input
                  v-model="slippage"
                  number
                  border="none"
                  :min="0"
                  :max="100"
                  placeholder="0"
                />
                <div
                  class="w-14 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  %
                </div>
              </div>
            </div>
            <div>
              <div class="flex">
                Leveraging staking
                <nftmx-tooltip
                  text="Selecting this option allows DAOs to join the syndication contract and purchase the NFT."
                >
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10 cursor-pointer"
                  />
                </nftmx-tooltip>
              </div>
              <div
                class="grid grid-cols-2 items-center h-12.5 mt-3.5 mb-4 font-ibm text-sm"
              >
                <div
                  @click="staking = true"
                  class="flex items-center gap-4 w-fit cursor-pointer"
                >
                  <nftmx-radio :active="staking" />
                  <span>Yes</span>
                </div>
                <div
                  @click="staking = false"
                  class="flex items-center gap-4 w-fit cursor-pointer"
                >
                  <nftmx-radio :active="!staking" />
                  <span>No</span>
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-primary-900 mt-3 mb-6" />
          <div class="flex">Add hashtags</div>
          <div class="relative h-12.5 mt-3.5 mb-4 z-20">
            <div
              v-click-outside="
                () => {
                  hashtagSection = false;
                }
              "
              class="font-ibm text-13 border-2 border-black absolute w-full"
            >
              <div class="flex">
                <div class="absolute p-4 text-tertiary-400">#</div>
                <input
                  v-model="hashtag"
                  class="focus:outline-none h-12.5 text-white placeholder-tertiary-500 bg-tertiary-700 w-full pl-8 pr-6 font-ibm text-sm"
                  @focus="hashtagSection = true"
                />
              </div>
              <div
                v-if="hashtagSection"
                class="bg-tertiary-700 px-4 max-h-40 overflow-auto"
              >
                <div
                  v-for="(item, index) in hashtags"
                  :key="index"
                  @click="selectHashtag(item)"
                  class="py-2 parent cursor-pointer"
                >
                  <span class="text-tertiary-400 child"> # </span>
                  <span class="child"> {{ item.name }} </span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <nftmx-hashtag
              v-for="(name, index) in selectedHashtags"
              :key="index"
              :value="name"
              @click="deselectHashtag(name)"
            />
          </div>
          <nftmx-divider class="mt-6 mb-6" />
          <div class="flex pt-0.75">Fees</div>
          <div class="mt-4">
            <div class="flex py-1 text-xs font-ibm-medium text-tertiary-500">
              <div>Service Fee</div>
              <div class="grow"></div>
              <div>2.5%</div>
            </div>
            <div class="text-11 font-ibm text-primary-900">
              * 100% gas and fee reinbursement with NFTPX tokens <br />
              ** Buyer will pay this fee if transaction canceled during the
              protection period
            </div>
          </div>
          <nftmx-divider class="mt-4 mb-6" />
          <div class="text-sm flex items-center">
            <basic-checkbox
              border="border-black border"
              small
              class="w-8.5 h-5"
              @check="deploySyndication = true"
            />
            <div class="flex pt-0.5 text-tertiary-400">
              <span class="flex text-11">
                Deploy syndication contract to boost your sale
                <nftmx-tooltip
                  text="Selecting this option allows DAOs to join the syndication contract and purchase the NFT."
                >
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10 cursor-pointer"
                  />
                </nftmx-tooltip>
              </span>
            </div>
          </div>
          <div class="w-full mt-9 pt-0.5 pb-2.5 mb-17">
            <nftmx-button
              v-if="
                (royalty && !approvedStatusToMlr) ||
                (!royalty && !approvedStatusToMarket)
              "
              color="black"
              label="APPROVE"
              outline
              :class="[
                waiting ? 'cursor-wait' : '',
                'w-full font-press text-base lg:text-lg',
              ]"
              h="xl2"
              @click="approve()"
              :loading="loading"
            />
            <nftmx-button
              v-else
              color="primary"
              outline
              label="COMPLETE LISTING"
              :class="[
                waiting ? 'cursor-wait' : '',
                'w-full font-press text-base lg:text-lg',
              ]"
              h="xl2"
              @click="createNewOrder()"
              :loading="loading"
            />
          </div>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<style scoped>
.parent:hover .child {
  color: #19cb58;
}
</style>
