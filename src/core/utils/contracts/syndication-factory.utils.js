import { useWallet, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import syndicationFactoryABI from "@/core/config/abi/syndication-factory";
import { BSC_TESTNET_SYNDICATION_FACTORY_CONTRACT_ADDRESS } from "@/core/config/constant";

const { address } = useEthers();
const { wallet } = useWallet();

export const syndicationFactoryContract = () => {
  if (!wallet.provider) return "Unable to get provider";
  const web3 = new Web3(wallet.provider);

  return new web3.eth.Contract(
    syndicationFactoryABI,
    web3.utils.toChecksumAddress(
      BSC_TESTNET_SYNDICATION_FACTORY_CONTRACT_ADDRESS
    )
  );
};

export const createSyndication = async (data, vaultAddress, initAmount) => {
  const contract = syndicationFactoryContract();
  return new Promise((resolve, reject) => {
    contract.methods
      .createSyndication(data, vaultAddress, initAmount)
      .send({ from: address.value, value: initAmount })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log("err: ", err);
        reject(err);
      });
  });
};
