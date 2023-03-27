import Web3 from "web3/dist/web3.min.js";
import marketABI from "@/core/config/abi/market";
import {
  BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
  MainToken,
} from "@/core/config/constant";
import marketService from "@/core/services/market.service";
import ordersService from "@/core/services/market/orders.service";

export const market = {
  namespaced: true,
  state: {
    ethPrice: 0,
    coinPrice: {
      // Need to be matched with chain config
      ETHEREUM: 0,
      BSC_TESTNET: 0,
    },
  },
  actions: {
    setWeb3({ commit, dispatch, rootState }, provider, walletAddress) {
      const web3 = new Web3(provider);
      rootState.web3 = web3;
      rootState.marketContract = new web3.eth.Contract(
        marketABI,
        web3.utils.toChecksumAddress(BSC_TESTNET_MARKET_CONTRACT_ADDRESS),
        {
          from: walletAddress,
        }
      );
    },
  },
  getters: {
    etherFromWei: (state, getters, rootState) => (wei) => {
      if (typeof wei === "number") {
        wei = wei.toFixed();
      }
      return parseFloat(rootState.web3.utils.fromWei(wei));
    },
    getEthPrice: (state, getters, rootState) => {
      return state.ethPrice;
    },
    getCoinPrice: (state, getters, rootState) => (chainKey) => {
      return state.coinPrice[chainKey];
    },
  },
  mutations: {
    async setCoinPrice(state) {
      ordersService.getCoinPrice().then((res) => {
        state.coinPrice = res.data;
      });
    },
  },
};
