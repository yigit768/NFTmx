<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { shortenAddress, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import VaultModal from "@/core/components/modal/VaultModal.vue";
import { roundTo } from "@/core/utils/common";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import ConnectWalletModal from "@/core/components/modal/ConnectWalletModal.vue";
import { useRouter } from "vue-router";

defineProps({
  extend: {
    type: Boolean,
    default: false,
  },
  top: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["handle-footer"]);

const router = useRouter();
const disableStatusBar = computed(
  () => router.currentRoute.value.name !== "home"
);
const { balance } = useEthers();
const balanceInEth = computed(() =>
  Web3.utils.fromWei(balance.value.toString())
);
const store = useStore();
const footer = ref();
const windowWidth = computed(() => store.state.app.windowWidth);
const user = computed(() => store.getters["auth/user"]);
const walletAddress = computed(() =>
  user.value
    ? shortenAddress(Web3.utils.toChecksumAddress(user.value.walletAddress))
    : ""
);
const openVaultModal = ref(false);
const coinPrice = computed(() => store.state.market.coinPrice.BSC_TESTNET);
const walletModalPop = ref(false);

onMounted(() => {
  emit("handle-footer", footer.value.scrollHeight);
  const observer = new MutationObserver(setFooterHeight);
  observer.observe(footer.value, {
    childList: true,
    subtree: true,
    attributes: true,
  });
});
watch(windowWidth, (val) => {
  emit("handle-footer", footer.value.scrollHeight);
});
const setFooterHeight = () => {
  if (footer.value) emit("handle-footer", footer.value.scrollHeight);
};
</script>

<template>
  <div ref="footer" class="bottom-0 w-full font-ibm absolute">
    <div v-if="top" class="bg-black text-white pt-6 pb-7 px-8">
      <p
        class="text-center text-sm sm:text-19 text-primary-900 font-press leading-6 sm:leading-9"
      >
        NFT.protection is a fully decentralized protocol
      </p>
      <div class="text-sm pb-px flex justify-center">
        <span> Airdrops </span>
        <div class="border-r border-r-black" />
      </div>
    </div>
    <div v-if="extend" class="bg-tertiary-900 text-center pt-12">
      <div class="max-w-screen-3xl mx-auto pb-24.25">
        <div class="text-white font-press px-4 pt-8 pb-2 sm:pb-6 lg:pb-11">
          <div class="text-xl sm:text-2xl lg:text-3xl">
            For developers and marketers
          </div>
        </div>
        <div
          class="grid grid-cols-1 lg:grid-cols-4 px-5.5 sm:px-10 md:px-16 lg:px-22 sm:gap-4 lg:gap-10"
        >
          <div class="flex flex-col items-center">
            <img
              v-lazy="'/images/landing/free-whitelabel.png'"
              class="h-25 mb-5.25"
            />
            <div class="text-white font-ibm-medium text-lg py-3">
              Whitelabel
            </div>
            <div class="text-tertiary-400 font-ibm text-xm">
              Build your own NFT.protection under a new brand and enjoy fees
            </div>
          </div>
          <div class="flex flex-col items-center">
            <img v-lazy="'/images/landing/spinoff.png'" class="h-25 mb-5.25" />
            <div class="text-white font-ibm-medium text-lg py-3">
              Spinoff collection
            </div>
            <div class="text-tertiary-400 font-ibm text-xm">
              Brand your collection for free with your own domain and logo
            </div>
          </div>
          <div class="flex flex-col items-center">
            <img
              v-lazy="'/images/landing/display-us.png'"
              class="h-25 mb-5.25"
            />
            <div class="text-white font-ibm-medium text-lg py-3">
              Display us
            </div>
            <div class="text-tertiary-400 font-ibm text-xm">
              Use our API to display NFTs on your website and enjoy fees
            </div>
          </div>
          <div class="flex flex-col items-center">
            <img
              v-lazy="'/images/landing/become-an-affiliate.png'"
              class="h-25 mb-5.25"
            />
            <div class="text-white font-ibm-medium text-lg py-3">
              Become an affiliate
            </div>
            <div class="text-tertiary-400 font-ibm text-xm">
              Drive traffic to NFT.protection and enjoy sale fees
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!top" class="bg-black text-white pt-6 pb-7 px-8">
      <p
        class="text-center text-sm sm:text-19 text-primary-900 font-press leading-6 sm:leading-9"
      >
        NFT.protection is a fully decentralized protocol
      </p>
      <div class="text-sm pb-px flex justify-center items-center gap-4">
        <span> Airdrops </span>
        <div class="border-r border-r-tertiary-700 h-4" />
        <span> Reward Program </span>
        <div class="border-r border-r-tertiary-700 h-4" />
        <span>
          Gas cost and fees are 100% reimbursable with the NFTPX token
        </span>
      </div>
    </div>
    <div
      class="border-t border-tertiary-900 bg-black px-4 sm:px-8 py-2 text-xs font-ibm-bold"
    >
      <div class="max-w-screen-3xl mx-auto lg:flex">
        <div
          class="flex-1 flex text-tertiary-600 justify-center lg:justify-start"
        >
          <a
            href="https://qwantum.finance/"
            class="w-fit flex items-center"
            target="_blank"
          >
            <span>Powered by:</span>
            <img
              v-lazy="'/images/logo/atom-logo-footer.png'"
              class="h-12.5 ml-2.5"
            />
          </a>
        </div>
        <div class="flex justify-center items-center text-tertiary-600">
          <span> Supporting Blockchains: </span>
          <font-awesome-icon :icon="['fab', 'ethereum']" class="text-lg mx-2" />
          <span> 300+ EVM </span>
        </div>
      </div>
    </div>
    <div v-if="!disableStatusBar" class="3xl:h-17"></div>
    <div class="3xl:fixed bottom-0 w-full z-20">
      <div
        v-if="!disableStatusBar"
        class="max-w-screen-3xl mx-auto 3xl:flex flex-wrap justify-between bg-tertiary-800 font-ibm text-sm text-center"
      >
        <div
          class="bg-primary-900 text-white py-3 px-6 shadow-[5px_0_10px_5px_rgb(0_0_0)]"
        >
          <div class="text-13 tracking-tighter">Available rewards</div>
          <div
            class="flex mx-auto items-center justify-center mt-1 w-max text-black"
          >
            <span> P2P: 250% </span>
            <div class="border-l border-tertiary-600 h-3.5 mx-1" />
            <span> P2C: 7.81% </span>
            <div class="border-l border-tertiary-600 h-3.5 mx-1" />
            <span> C2C: 7.81% </span>
          </div>
        </div>
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="text-13 tracking-tighter">Your investments</div>
          <div v-if="user && user.walletAddress" class="mt-1 mx-auto w-max">
            <font-awesome-icon :icon="['fab', 'ethereum']" class="text-white" />
            <span class="text-white"> 1.12532</span>
            <span class="font-ibm">[$1.52K]</span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="my-4 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="text-13 tracking-tighter">Airdrop rewards</div>
          <div v-if="user && user.walletAddress" class="mt-1 mx-auto w-max">
            <font-awesome-icon
              :icon="['fab', 'ethereum']"
              class="text-primary-900"
            />
            <span class="text-primary-900"> 1.12532</span>
            <span class="font-ibm">[$1.52K]</span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="my-4 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="w-max text-13 tracking-tighter mx-auto">
            Market making reward
          </div>
          <div v-if="user && user.walletAddress" class="mt-1 mx-auto">
            <font-awesome-icon
              :icon="['fab', 'ethereum']"
              class="text-primary-900"
            />
            <span class="text-primary-900"> 1.12532</span>
            <span class="font-ibm">[$1.52K]</span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="my-4 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="w-max text-13 tracking-tighter mx-auto">
            Multilevel ownership reward
          </div>
          <div v-if="user && user.walletAddress" class="mt-1 mx-auto">
            <font-awesome-icon
              :icon="['fab', 'ethereum']"
              class="text-primary-900"
            />
            <span class="text-primary-900"> 1.12532</span>
            <span class="font-ibm">[$1.52K]</span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="my-4 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="w-max text-13 tracking-tighter mx-auto">ROI to date</div>
          <div v-if="user && user.walletAddress" class="mt-1 mx-auto">
            <span class="text-primary-900"> 24.56% </span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="my-4 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="w-max mx-auto">
            <font-awesome-icon
              @click="openVaultModal = true"
              :icon="['fas', 'minus-circle']"
              class="text-red-700 transition hover:text-red-900 cursor-pointer"
            />
            <span class="text-13 tracking-tighter"> Vault balance </span>
            <font-awesome-icon
              @click="openVaultModal = true"
              :icon="['fas', 'plus-circle']"
              class="text-primary-700 transition hover:text-primary-900 cursor-pointer"
            />
          </div>
          <div v-if="user && user.walletAddress" class="mt-1 mx-auto">
            <font-awesome-icon :icon="['fab', 'ethereum']" class="text-white" />
            <span class="text-white">
              {{
                roundTo(
                  user && user.bscTestnetVault ? user.bscTestnetVault.funds : 0
                )
              }}
            </span>
            <span class="font-ibm">
              [${{
                roundTo(
                  user && user.bscTestnetVault
                    ? user.bscTestnetVault.funds * coinPrice
                    : 0,
                  2
                ).toLocaleString("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              }}]
            </span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="flex gap-3 text-tertiary-400 font-ibm-medium py-3 justify-center"
        >
          <font-awesome-icon
            :icon="['fas', 'angle-double-left']"
            class="text-lg text-primary-900 my-auto"
          />
          <div class="w-max">
            <div
              @click="openVaultModal = true"
              class="text-primary-900 cursor-pointer"
            >
              Deposit to the vault
              <nftmx-tooltip
                text="Your self-custody vault serves as both a funding source and collateral, allowing you to make as many offers as you wish without paying any gas fees until they are accepted. Furthermore, you can earn APY rewards on the funds you have stored in the vault."
              >
                <font-awesome-icon
                  :icon="['fas', 'question-circle']"
                  class="text-10 cursor-pointer"
                />
              </nftmx-tooltip>
            </div>
            <div class="mt-1">
              <span> Gain 25.53% APY </span>
            </div>
          </div>
        </div>
        <div
          v-if="user && user.walletAddress"
          class="text-tertiary-400 font-ibm-medium py-3 pr-6"
        >
          <div>
            {{ walletAddress }}
          </div>
          <div class="mt-1">
            <font-awesome-icon :icon="['fab', 'ethereum']" class="text-white" />
            <span class="text-white"> {{ roundTo(balanceInEth) }}</span>
            <span class="font-ibm">
              [${{
                roundTo(balanceInEth * coinPrice, 2).toLocaleString("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              }}]
            </span>
          </div>
        </div>
        <div v-else class="flex items-center pr-6 font-ibm-bold justify-center">
          <nftmx-button
            color="gray"
            outline
            textColor="tertiary-400"
            label="Connect Wallet"
            h="sm"
            @click="walletModalPop = true"
          />
        </div>
      </div>
    </div>
    <vault-modal v-model="openVaultModal" />
    <connect-wallet-modal v-model="walletModalPop" />
  </div>
</template>

<style scoped>
.text-xm {
  font-size: 0.81rem;
  line-height: 1.5rem;
}
.text-19 {
  font-size: 19px;
  line-height: 28px;
}
</style>
