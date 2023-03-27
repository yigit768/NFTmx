<script setup>
import { computed, ref } from "vue";
import { $vfm } from "vue-final-modal";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useToast } from "vue-toastification";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import VueSlider from "vue-3-slider-component";
import { shortenAddress, useEthers, useWallet } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import { useStore } from "vuex";
import ConnectWalletModal from "@/core/components/modal/ConnectWalletModal.vue";
import { createVaultContract } from "@/core/utils/contracts/vault-factory.utils.js";
import { roundTo } from "@/core/utils/common";
import { deposit, withdraw } from "@/core/utils/contracts/vault.utils.js";

const { balance } = useEthers();
const { wallet } = useWallet();
const balanceInEth = computed(() =>
  Web3.utils.fromWei(balance.value.toString())
);
const store = useStore();
const user = computed(() => store.getters["auth/user"]);
const walletAddress = computed(() =>
  user.value
    ? shortenAddress(Web3.utils.toChecksumAddress(user.value.walletAddress))
    : ""
);
const coinPrice = computed(() => store.state.market.coinPrice.BSC_TESTNET);
const toast = useToast();
const chain = ref("");
const open = ref(false);
const tab = ref("ADD");
const amount = ref(0);
const walletModalPop = ref(false);
const loading = ref(false);

const onClickOutside = () => {
  open.value = false;
};
const handleClick = () => {
  open.value = !open.value;
};
const cancel = () => {
  $vfm.hide("vaultModal");
};
const createVault = async () => {
  try {
    loading.value = true;
    await wallet.connector.switchChain(97);
    createVaultContract()
      .then((res) => {
        toast.success("Vault is created successfully");
        store.dispatch("auth/login", user.value.walletAddress).then(() => {
          loading.value = false;
        });
      })
      .catch((err) => {
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong.");
        }
        loading.value = false;
      });
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong.");
    }
    loading.value = false;
  }
};
const addToVault = () => {
  loading.value = true;
  deposit(
    user.value.bscTestnetVault.address,
    Web3.utils.toWei(amount.value.toString())
  )
    .then((res) => {
      toast.success("Funds is added to the vault successfully");
      store.dispatch("auth/login", user.value.walletAddress).then(() => {
        loading.value = false;
      });
    })
    .catch((err) => {
      if (err.code === 4001) {
        toast.error("User denied transaction signature.");
      } else {
        toast.error("Something went wrong.");
      }
      loading.value = false;
    });
};
const removeFromVault = () => {
  loading.value = true;
  withdraw(
    user.value.bscTestnetVault.address,
    Web3.utils.toWei(amount.value.toString())
  )
    .then((res) => {
      toast.success("Funds is removed from the vault successfully");
      store.dispatch("auth/login", user.value.walletAddress).then(() => {
        loading.value = false;
      });
    })
    .catch((err) => {
      if (err.code === 4001) {
        toast.error("User denied transaction signature.");
      } else {
        toast.error("Something went wrong.");
      }
      loading.value = false;
    });
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="vaultModal"
    esc-to-close
    fit-parent
  >
    <div class="bg-tertiary-900 text-white xl:w-home-lg 3xl:w-modal-md">
      <div class="text-right text-[22px] leading-none p-5">
        <span
          class="cursor-pointer hover:text-red-900 transition"
          @click="cancel"
        >
          &#10005;
        </span>
      </div>
      <div class="text-center relative mt-2 px-4 lg:px-17.25 pb-16">
        <div class="font-press text-xl sm:text-2xl">
          Add/Remove Vault Balance
        </div>
        <div
          class="grid grid-cols-2 text-tertiary-400 font-ibm-bold text-base mt-10.5"
        >
          <div
            @click="
              {
                amount = 0;
                tab = 'ADD';
              }
            "
            :class="[
              tab === 'ADD'
                ? 'border-primary-900 text-primary-900'
                : 'border-tertiary-700',
              'flex items-center justify-center border-b-3 h-16 cursor-pointer transition hover:border-primary-900 hover:text-primary-900',
            ]"
          >
            <span>Add</span>
          </div>
          <div
            @click="
              {
                amount = 0;
                tab = 'REMOVE';
              }
            "
            :class="[
              tab === 'REMOVE'
                ? 'border-red-600 text-red-600'
                : 'border-tertiary-700',
              'flex items-center justify-center border-b-3 h-16 cursor-pointer transition hover:border-red-600 hover:text-red-600',
            ]"
          >
            <span>Remove</span>
          </div>
        </div>
        <div class="mt-8 grid grid-cols-5 items-center text-start">
          <div class="col-span-2 font-ibm-bold text-lg">Chain</div>
          <div class="col-span-3 relative h-13.5">
            <div
              class="absolute w-full z-10 border-2 border-black px-5 overflow-hidden bg-tertiary-800"
              v-click-outside="onClickOutside"
            >
              <accordion
                mIcon
                :border="false"
                :sidebar="true"
                v-model="open"
                @handle-click="handleClick"
                handleEmit
                class="w-full"
              >
                <template v-slot:caption>
                  <div class="text-13 font-ibm-medium py-4 mr-4 h-12.5">
                    BSC
                  </div>
                </template>
                <div class="text-sm pt-2 pb-4">BSC</div>
              </accordion>
            </div>
          </div>
        </div>
        <div
          v-if="tab === 'ADD'"
          class="mt-15 grid grid-cols-5 items-center text-start"
        >
          <div class="col-span-2 font-ibm-bold text-lg bg-re">Amount</div>
          <div class="col-span-3 text-tertiary-400 text-sm">
            <vue-slider
              v-model="amount"
              :min="0"
              :max="
                roundTo(balanceInEth) >= 0.002
                  ? roundTo(balanceInEth - 0.001)
                  : 1
              "
              :disabled="roundTo(balanceInEth) >= 0.002 ? false : true"
              :interval="0.001"
              :dotSize="28"
              :dotOptions="[
                {
                  style: {
                    backgroundColor: tab === 'ADD' ? '#19cb58' : '#ff5e4f',
                  },
                },
              ]"
              :height="15"
              :processStyle="{ backgroundColor: 'rgb(83 83 83)' }"
              :railStyle="{ backgroundColor: 'rgb(52 52 52)' }"
              tooltip="always"
            >
              <template #tooltip="{ value }">
                <div class="w-max">
                  {{ value + " BNB" }}
                </div>
              </template>
            </vue-slider>
            <div class="flex justify-between">
              <span>0</span>
              <span>100%</span>
            </div>
            <div class="text-11 flex justify-between mt-4">
              <span>
                <span> Wallet: </span>
                <span class="text-white">{{ walletAddress }}</span>
              </span>
              <span>
                <span> Balance: </span>
                <span class="text-white">{{ roundTo(balanceInEth) }} BNB</span>
                <span>
                  [${{ roundTo(balanceInEth * coinPrice, 2).toLocaleString() }}]
                </span>
              </span>
            </div>
          </div>
        </div>
        <div v-else class="mt-15 grid grid-cols-5 items-center text-start">
          <div class="col-span-2 font-ibm-bold text-lg bg-re">Amount</div>
          <div class="col-span-3 text-tertiary-400 text-sm">
            <vue-slider
              v-model="amount"
              :min="0"
              :max="
                user &&
                user.bscTestnetVault &&
                roundTo(user.bscTestnetVault.funds) > 0
                  ? roundTo(user.bscTestnetVault.funds)
                  : 1
              "
              :disabled="
                user &&
                user.bscTestnetVault &&
                roundTo(user.bscTestnetVault.funds) >= 0.002
                  ? false
                  : true
              "
              :interval="0.001"
              :dotSize="28"
              :dotOptions="[
                {
                  style: {
                    backgroundColor: tab === 'ADD' ? '#19cb58' : '#ff5e4f',
                  },
                },
              ]"
              :height="15"
              :processStyle="{ backgroundColor: 'rgb(83 83 83)' }"
              :railStyle="{ backgroundColor: 'rgb(52 52 52)' }"
              tooltip="always"
            >
              <template #tooltip="{ value }">
                <div class="w-max">
                  {{ value + " BNB" }}
                </div>
              </template>
            </vue-slider>
            <div class="flex justify-between">
              <span>0</span>
              <span>100%</span>
            </div>
            <div class="text-11 flex justify-between mt-4">
              <span>
                <span> Vault: </span>
                <span class="text-white">
                  {{
                    user && user.bscTestnetVault
                      ? shortenAddress(
                          Web3.utils.toChecksumAddress(
                            user.bscTestnetVault.address
                          )
                        )
                      : ""
                  }}
                </span>
              </span>
              <span>
                <span> Balance: </span>
                <span class="text-white">
                  {{
                    roundTo(
                      user && user.bscTestnetVault
                        ? user.bscTestnetVault.funds
                        : 0
                    )
                  }}
                  BNB
                </span>
                <span>
                  [${{
                    roundTo(
                      user && user.bscTestnetVault
                        ? user.bscTestnetVault.funds * coinPrice
                        : 0,
                      2
                    ).toLocaleString()
                  }}]
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="mt-15">
          <nftmx-button
            v-if="!user || !user.walletAddress"
            color="black"
            textColor="white"
            outline
            label="CONNECT WALLET"
            class="font-press text-lg"
            w="full"
            h="xl"
            @click="walletModalPop = true"
          />
          <nftmx-button
            v-else-if="!user.bscTestnetVault"
            color="black"
            textColor="white"
            outline
            label="CREATE YOUR VAULT"
            class="font-press text-lg"
            w="full"
            h="xl"
            @click="createVault"
            :loading="loading"
          />
          <nftmx-button
            v-else-if="tab === 'ADD'"
            color="primary"
            textColor="white"
            outline
            label="ADD TO THE VAULT"
            class="font-press text-lg"
            w="full"
            h="xl"
            @click="addToVault"
            :loading="loading"
          />
          <nftmx-button
            v-else-if="tab === 'REMOVE'"
            color="red"
            textColor="white"
            outline
            label="REMOVE FROM THE VAULT"
            class="font-press text-lg"
            w="full"
            h="xl"
            @click="removeFromVault"
            :loading="loading"
          />
        </div>
      </div>
    </div>
    <connect-wallet-modal v-model="walletModalPop" />
  </vue-final-modal>
</template>
