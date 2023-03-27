import { useWallet, useEthers } from "vue-dapp";
import Web3 from "web3/dist/web3.min.js";
import erc721ABI from "@/core/config/abi/erc721";

const { address } = useEthers();
const { wallet } = useWallet();

export const erc721Contract = (address) => {
  if (!wallet.provider) return "Unable to get provider";
  if (!address) throw new "Provide contract address"();
  const web3 = new Web3(wallet.provider);

  return new web3.eth.Contract(
    erc721ABI,
    web3.utils.toChecksumAddress(address)
  );
};

export const setApprovalForAll = (tokenAddress, operator, _approved) => {
  const contract = erc721Contract(tokenAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .setApprovalForAll(operator, _approved)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const isApprovedForAll = (tokenAddress, owner, operator) => {
  const contract = erc721Contract(tokenAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .isApprovedForAll(owner, operator)
      .call({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const safeTransferFrom = (tokenAddress, from, to, tokenId) => {
  const contract = erc721Contract(tokenAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .safeTransferFrom(from, to, tokenId)
      .send({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const owner = (tokenAddress) => {
  const contract = erc721Contract(tokenAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .owner()
      .call({ from: address.value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
