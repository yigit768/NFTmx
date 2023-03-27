import { useWallet, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import mlrABI from "@/core/config/abi/mlr";

const { address } = useEthers();
const { wallet } = useWallet();

export const mlrContract = (address) => {
  if (!wallet.provider) throw "Unable to get provider";
  const web3 = new Web3(wallet.provider);

  return new web3.eth.Contract(mlrABI, web3.utils.toChecksumAddress(address));
};

export const createMlrOrder = async (mlrAddress, data) => {
  const contract = mlrContract(mlrAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .createOrder(...data)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const cancelMlrOrder = async (mlrAddress, orderIds) => {
  const contract = mlrContract(mlrAddress);
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

export const updateRoyaltyInfo = async (contractAddress, royalty, buyout) => {
  const contract = mlrContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .updateRoyaltyInfo(royalty, buyout)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const buyOut = async (contractAddress, owner, vaultAddress, buyout) => {
  const contract = mlrContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .buyOut(owner, vaultAddress)
      .send({ from: address.value, value: buyout })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const withdrawNFT = async (contractAddress) => {
  const contract = mlrContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .withdrawNFT()
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const buyFixedPayOrderInMLR = (contractAddress, orderId, price) => {
  const contract = mlrContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .buyFixedPayOrder(orderId)
      .send({ from: address.value, value: price })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createBidInMLR = (contractAddress, orderId, price) => {
  const contract = mlrContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .createBid(orderId)
      .send({ from: address.value, value: price })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createOfferInMLR = (
  contractAddress,
  price,
  rate,
  time,
  expiration
) => {
  const contract = mlrContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .createOffer(price, rate, time, expiration)
      .send({ from: address.value, value: price })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
