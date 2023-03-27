import { useWallet, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import dvcFactoryABI from "@/core/config/abi/dvc-factory";
import {
  BSC_TESTNET_VBNB_ADDRESS,
  BSC_TESTNET_DVC_FACTORY_CONTRACT_ADDRESS,
  BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
  BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS,
} from "../../../core/config/constant";

const { address } = useEthers();
const { wallet } = useWallet();

export const dvcFactoryContract = () => {
  if (!wallet.provider) return false;
  const web3 = new Web3(wallet.provider);

  return new web3.eth.Contract(
    dvcFactoryABI,
    web3.utils.toChecksumAddress(BSC_TESTNET_DVC_FACTORY_CONTRACT_ADDRESS)
  );
};

export const createDvc = (
  uuid,
  _isCloseEnded,
  _dueDate,
  _finalDate,
  buyArgs,
  sellArgs
) => {
  const contract = dvcFactoryContract();
  if (!contract) throw "Unable to get provider";

  return new Promise((resolve, reject) => {
    contract.methods
      .createDVC(
        uuid,
        BSC_TESTNET_VBNB_ADDRESS,
        BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
        BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS,
        _isCloseEnded,
        _dueDate,
        _finalDate,
        Web3.utils.toWei("0.025"),
        buyArgs,
        sellArgs
      )
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
