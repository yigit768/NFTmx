import { useWallet, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import dvcABI from "@/core/config/abi/dvc";

const { address } = useEthers();
const { wallet } = useWallet();

export const dvcContract = (contractAddress) => {
  if (!wallet.provider) return "Unable to get provider";
  const web3 = new Web3(wallet.provider);

  return new web3.eth.Contract(
    dvcABI,
    web3.utils.toChecksumAddress(contractAddress)
  );
};

export const addLiquidity = (contractAddress, value) => {
  const contract = dvcContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .addLiquidity()
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
  const contract = dvcContract(contractAddress);
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
