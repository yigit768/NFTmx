import { useWallet, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import syndicationABI from "@/core/config/abi/syndication";

const { address } = useEthers();
const { wallet } = useWallet();

export const syndicationContract = (contractAddress) => {
  if (!wallet.provider) return false;
  const web3 = new Web3(wallet.provider);

  return new web3.eth.Contract(
    syndicationABI,
    web3.utils.toChecksumAddress(contractAddress)
  );
};

export const addLiquidity = (contractAddress, vaultAddress, value) => {
  const contract = syndicationContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .addLiquidity(address.value, vaultAddress, value)
      .send({ from: address.value, value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const withdraw = (contractAddress, lp) => {
  const contract = syndicationContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .withdraw(lp)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
