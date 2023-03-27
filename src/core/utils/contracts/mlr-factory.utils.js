import { useWallet, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import mlrFactoryABI from "@/core/config/abi/mlr-factory";
import { BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS } from "@/core/config/constant";

const { address } = useEthers();
const { wallet } = useWallet();

export const mlrFactoryContract = () => {
  if (!wallet.provider) return "Unable to get provider";
  const web3 = new Web3(wallet.provider);

  return new web3.eth.Contract(
    mlrFactoryABI,
    web3.utils.toChecksumAddress(BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS)
  );
};

export const createMLR = async (data) => {
  const contract = mlrFactoryContract();
  return new Promise((resolve, reject) => {
    contract.methods
      .createMLR(data)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
