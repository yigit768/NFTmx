import { useWallet, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import vaultFactoryABI from "@/core/config/abi/vault-factory";
import { BSC_TESTNET_VAULT_FACTORY_CONTRACT_ADDRESS } from "@/core/config/constant";

const { address } = useEthers();
const { wallet } = useWallet();

export const vaultFactoryContract = () => {
  if (!wallet.provider) return "Unable to get provider";
  const web3 = new Web3(wallet.provider);

  return new web3.eth.Contract(
    vaultFactoryABI,
    web3.utils.toChecksumAddress(BSC_TESTNET_VAULT_FACTORY_CONTRACT_ADDRESS)
  );
};

export const createVaultContract = async () => {
  const contract = vaultFactoryContract();
  return new Promise((resolve, reject) => {
    contract.methods
      .createVault()
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log("err: ", err);
        reject(err);
      });
  });
};
