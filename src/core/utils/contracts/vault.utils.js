import { useWallet, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import vaultABI from "@/core/config/abi/vault";

const { address } = useEthers();
const { wallet } = useWallet();

export const vaultContract = (contractAddress) => {
  if (!wallet.provider) return false;
  const web3 = new Web3(wallet.provider);

  return new web3.eth.Contract(
    vaultABI,
    web3.utils.toChecksumAddress(contractAddress)
  );
};

export const deposit = (contractAddress, value) => {
  const contract = vaultContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .deposit()
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
  const contract = vaultContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .withdraw(address.value, lp)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
