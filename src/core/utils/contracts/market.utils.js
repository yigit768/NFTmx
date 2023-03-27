import { useWallet, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import marketABI from "@/core/config/abi/market";
import mlrABI from "@/core/config/abi/mlr";
import { BSC_TESTNET_MARKET_CONTRACT_ADDRESS } from "@/core/config/constant";

const { address } = useEthers();
const { wallet } = useWallet();

export const marketContract = (contractAddress) => {
  if (!wallet.provider) throw "Unable to get provider";
  const web3 = new Web3(wallet.provider);

  return new web3.eth.Contract(
    contractAddress === BSC_TESTNET_MARKET_CONTRACT_ADDRESS
      ? marketABI
      : mlrABI,
    web3.utils.toChecksumAddress(contractAddress)
  );
};

export const createOrder = (data) => {
  const contract = marketContract(BSC_TESTNET_MARKET_CONTRACT_ADDRESS);
  return new Promise((resolve, reject) => {
    contract.methods
      .createOrder(data)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const cancelOrderBySeller = (contractAddress, orderIds) => {
  const contract = marketContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .cancelOrder(orderIds)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const buyFixedPayOrder = (
  contractAddress,
  orderIds,
  vaultAddress,
  price
) => {
  const contract = marketContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .buyFixedPayOrder(orderIds, vaultAddress)
      .send({ from: address.value, value: price })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createBid = (contractAddress, orderId, vaultAddress, price) => {
  const contract = marketContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .createBid(orderId, vaultAddress, price)
      .send({ from: address.value, value: price })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const claimDownsideProtectionAmount = (contractAddress, orderIds) => {
  const contract = marketContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .claimDownsideProtectionAmount(orderIds)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createOffer = (data) => {
  const contract = marketContract(BSC_TESTNET_MARKET_CONTRACT_ADDRESS);
  return new Promise((resolve, reject) => {
    contract.methods
      .createOffer(...data)
      .send({ from: address.value, value: data[3] })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const cancelOffer = (offerId) => {
  const contract = marketContract(BSC_TESTNET_MARKET_CONTRACT_ADDRESS);
  return new Promise((resolve, reject) => {
    contract.methods
      .cancelOffer(offerId)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const acceptOffer = (offerId) => {
  const contract = marketContract(BSC_TESTNET_MARKET_CONTRACT_ADDRESS);
  return new Promise((resolve, reject) => {
    contract.methods
      .acceptOffer(offerId)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
