<template>
  <div class="pb-10 text-tertiary-400 text-11 font-ibm">
    <img
      v-lazy="'/images/logo/nftmx-logo-small.png'"
      alt="NFT mx"
      class="h-9 mt-4"
    />
    <div class="leading-5">
      <font-awesome-icon :icon="['far', 'copyright']" />2021 NFT.protection All
      rights reserved
    </div>
    <div class="flex items-center font-ibm-bold my-0.5">
      Powered by
      <img v-lazy="'/images/logo/atom-logo-footer.png'" alt="logo" />
    </div>
    <div class="leading-4.5 pr-1">
      Qonetum Finance is a DeFi ecosystem powered by brilliant decentralized
      protocols designed to create an efficient financial system based on
      quantum finance methods. Qonetum's methods reduce investment risk and
      increase liquidity to illiquid and risky assets.
    </div>
  </div>
</template>
