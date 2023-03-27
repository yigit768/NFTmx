<script setup>
import BasicDropdown from "@/core/components/dropdown/BasicDropdown.vue";
import BasicDropdownItem from "@/core/components/dropdown/BasicDropdownItem.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxWalletAddress from "@/core/components/blockchain-address/NftmxWalletAddress.vue";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
</script>

<template>
  <div class="pb-10 mt-0 xl:mt-13">
    <div>
      <div class="pt-10.5 pb-4 font-ibm-medium text-white">
        <div
          class="border border-black divide-y divide-black bg-tertiary-800 text-left"
        >
          <div class="pt-4 pb-3.5 px-5.5 text-lg font-ibm-bold">
            Trading History
          </div>
          <div class="max-h-screen overflow-y-auto overflow-x-hidden text-xs">
            <nftmx-table>
              <nftmx-thead>
                <nftmx-tr>
                  <nftmx-th first>Event</nftmx-th>
                  <nftmx-th>Item</nftmx-th>
                  <nftmx-th class="cursor-pointer">
                    <div class="flex justify-between items-center gap-4">
                      <div>Last Value</div>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </nftmx-th>
                  <nftmx-th>From</nftmx-th>
                  <nftmx-th>To</nftmx-th>
                  <nftmx-th>Date</nftmx-th>
                </nftmx-tr>
              </nftmx-thead>
              <nftmx-tbody>
                <nftmx-tr
                  v-for="index in 5"
                  :key="index"
                  class="hover:bg-tertiary-300 transition cursor-pointer"
                >
                  <nftmx-td first>Sale</nftmx-td>
                  <nftmx-td>
                    <div class="flex gap-4.5 items-center">
                      <div
                        class="w-11 h-11"
                        :style="{
                          background: 'url(' + '/images/nfts/img2.png' + ')',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }"
                      />
                      <div>World #1</div>
                    </div>
                  </nftmx-td>
                  <nftmx-td>0.881</nftmx-td>
                  <nftmx-td>
                    <nftmx-wallet-address-pop
                      class="text-primary-900"
                      address="0xB29265736dcc20867F6b3c0f5aa8E5A64942b816"
                    ></nftmx-wallet-address-pop>
                  </nftmx-td>
                  <nftmx-td>
                    <nftmx-wallet-address-pop
                      class="text-primary-900"
                      address="0xB29265736dcc20867F6b3c0f5aa8E5A64942b816"
                    ></nftmx-wallet-address-pop>
                  </nftmx-td>
                  <nftmx-td class="text-primary-900">17 hours ago</nftmx-td>
                </nftmx-tr>
              </nftmx-tbody>
            </nftmx-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
