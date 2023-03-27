import { useWallet, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import derivativeFactoryABI from "@/core/config/abi/derivative-factory";
import { BSC_TESTNET_DERIVATIVE_FACTORY_CONTRACT_ADDRESS } from "../../../core/config/constant";

const { address } = useEthers();
const { wallet } = useWallet();

export const derivativeFactoryContract = () => {
  if (!wallet.provider) return false;
  const web3 = new Web3(wallet.provider);

  return new web3.eth.Contract(
    derivativeFactoryABI,
    web3.utils.toChecksumAddress(
      BSC_TESTNET_DERIVATIVE_FACTORY_CONTRACT_ADDRESS
    )
  );
};

export const createDerivative = (tokenAddress, tokenId, ownershipPrice) => {
  const contract = derivativeFactoryContract();
  if (!contract) throw "Unable to get provider";

  return new Promise((resolve, reject) => {
    contract.methods
      .createDerivative(tokenAddress, tokenId, ownershipPrice)
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
