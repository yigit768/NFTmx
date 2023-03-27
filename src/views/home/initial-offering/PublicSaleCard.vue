<script setup>
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import { ref } from "vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";

const open = ref(false);
const option = ref("Change");

const onClickOutside = () => {
  open.value = false;
};
const handleClick = () => {
  open.value = !open.value;
};
</script>

<template>
  <div
    class="relative bg-black text-white mt-10 hover:shadow-default hover:shadow-primary-900 h-141.5"
  >
    <div
      class="w-2 h-2 absolute -left-0.5 top-9.5 bg-primary-900 bg-opacity-60 rotate-45"
    />
    <img
      src="/images/landing/hero-image-background-1920.png"
      class="w-full h-full object-center object-cover absolute"
    />
    <div
      class="absolute top-0 -left-1 h-10.5 w-full flex gap-2 items-center text-sm text-white leading-4 justify-between"
    >
      <div
        class="px-6 bg-primary-900 bg-opacity-60 h-full flex items-center justify-center shadow-default shadow-primary-900"
      >
        <font-awesome-icon :icon="['fas', 'shield-alt']" />
        <span>
          100% Liquidity Protection | 365 Days | 10% Slippage | 20% Ownership
        </span>
      </div>
      <div class="flex items-center gap-4 text-tertiary-400 mr-10 mt-2">
        <font-awesome-icon :icon="['fas', 'tag']" class="text-xl" />
        <font-awesome-icon :icon="['fas', 'gavel']" class="text-xl" />
        <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-xl" />
        <img src="/images/components/opensea-icon.png" />
        <font-awesome-icon :icon="['fas', 'layer-group']" class="text-xl" />
        <font-awesome-icon :icon="['fab', 'ethereum']" class="text-2xl" />
      </div>
    </div>
    <div class="relative grid grid-cols-12 text-white pt-20">
      <div class="px-13 border-r border-r-black col-span-7">
        <p class="text-base font-ibm-bold">
          This variable NFT is backed by
          <span class="text-primary-900">100,000</span>-<span> 1,000,000 </span>
          NFTPX tokens with a variable value that changes randomly with each
          transaction
        </p>
        <div class="grid grid-cols-2">
          <div>
            <video controls class="w-full h-full object-cover">
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            </video>
          </div>
          <div class="relative text-sm bg-tertiary-700 px-6 pt-6 pb-21">
            <div class="flex justify-between">
              <span> NFTPX amount </span>
              <span class="text-primary-900"> 100,000 </span>
            </div>
            <div class="flex gap-2 items-center mt-4.5 mb-0.5">
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              />
              <div
                class="text-black font-ibm-bold text-11 whitespace-nowrap text-shadow-h1"
              >
                Multilevel Ownership
              </div>
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              />
            </div>
            <div class="text-11 text-white font-ibm">
              <div class="flex justify-between">
                <span class="font-ibm-medium">Owners</span>
                <span class="text-primary-900"> 1 </span>
              </div>
              <div class="flex justify-between">
                <span class="font-ibm-medium">Total Ownership</span>
                <span class="text-primary-900"> 20% </span>
              </div>
            </div>
            <div class="flex gap-2 items-center mt-1.75 mb-0.5">
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              />
              <div
                class="text-black font-ibm-bold text-11 whitespace-nowrap text-shadow-h1"
              >
                Liquidity Protection
              </div>
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              />
            </div>
            <div class="text-11 text-white font-ibm">
              <div class="flex justify-between">
                <span class="font-ibm-medium">Period</span>
                <span class="text-primary-900"> 365 Days </span>
              </div>
              <div class="flex justify-between">
                <span class="font-ibm-medium">Fees</span>
                <div class="flex items-center">
                  <span class="text-primary-900"> Slippage 10% </span>
                  <div class="h-2.5 mx-1.5 border-l border-tertiary-400" />
                  <span class="text-tertiary-400"> Staking </span>
                </div>
              </div>
            </div>
            <div class="relative bg-tertiary-800 h-6 mt-3.5">
              <div class="h-full bg-primary-900" :style="{ width: '10%' }" />
              <div
                class="absolute text-xs w-full h-full top-0 left-0 flex justify-center items-center"
              >
                <span> Available Supply </span>
              </div>
            </div>
            <div class="flex flex-col items-center mt-3.5 gap-2">
              <span class="text-11"> Current Offer ends in </span>
              <timer :time="999999" size="head" class="font-ibm-bold" />
            </div>
            <div
              class="absolute left-0 bottom-0 h-15 w-full bg-primary-900 font-press flex items-center justify-center shadow-default shadow-primary-900"
            >
              BUY NOW
            </div>
          </div>
        </div>
      </div>
      <div class="px-13 border-l border-l-tertiary-700 col-span-5">
        <p class="text-base font-ibm-bold">
          Provide prompt instructions to the AI to change the variable NFT's
          appearance
        </p>
        <div class="grid grid-cols-2 gap-7">
          <img src="/images/nfts/img1.png" class="h-32.5 w-full object-cover" />
          <img src="/images/nfts/img1.png" class="h-32.5 w-full object-cover" />
          <img src="/images/nfts/img1.png" class="h-32.5 w-full object-cover" />
          <img src="/images/nfts/img1.png" class="h-32.5 w-full object-cover" />
        </div>
        <div class="flex justify-between items-center w-full mt-12 text-sm">
          <div
            class="bg-tertiary-700 w-40 flex-1 shadow-default shadow-tertiary-700 flex"
          >
            <div
              v-click-outside="onClickOutside"
              class="bg-tertiary-800 h-11.5 relative z-10"
            >
              <accordion
                class="overflow-hidden px-4 bg-tertiary-800"
                :border="false"
                sidebar
                v-model="open"
                @handle-click="handleClick"
                handleEmit
              >
                <template v-slot:caption>
                  <div class="text-sm py-3.5 font-ibm-medium w-20">
                    {{ option }}
                  </div>
                </template>
                <div class="font-ibm-medium">
                  <div
                    @click="
                      option = 'Add';
                      open = false;
                    "
                    class="py-2 cursor-pointer hover:text-primary-900 transition"
                  >
                    Add
                  </div>
                  <div
                    @click="
                      option = 'Remove';
                      open = false;
                    "
                    class="py-2 cursor-pointer hover:text-primary-900 transition"
                  >
                    Remove
                  </div>
                  <div
                    @click="
                      option = 'Change';
                      open = false;
                    "
                    class="py-2 cursor-pointer hover:text-primary-900 transition"
                  >
                    Change
                  </div>
                </div>
              </accordion>
            </div>
            <nftmx-input
              class="h-11.5"
              number
              border="none"
              placeholder="Enter your prompt to change the NFT"
            />
          </div>
          <div
            class="cursor-pointer bg-tertiary-600 shadow-default shadow-tertiary-600 h-11.5 flex items-center justify-center w-24 text-primary-900 font-ibm-medium"
          >
            CREATE
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
figure {
  max-width: 64rem;
  width: 100%;
  max-height: 30.875rem;
  height: 100%;
  margin: 1.25rem auto;
  padding: 1.051%;
  background-color: #666;
}
</style>
