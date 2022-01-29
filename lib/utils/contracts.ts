import { Contract, Signer } from "ethers"
import NFTManagerABI from "../../contracts/NFTManager.json"

const nftManagerAddress = "0xC453c817633b4A215bc421D8EfAB3abdAE88787B"
const erc1155ProxyAddress = "0x5C4614493344648259027C50FBB0aa27c3724D27"

export const getNftManagerContract = (signer?: Signer) => {
  if (!signer) {
    return
  }
  return new Contract(nftManagerAddress, NFTManagerABI, signer)
}

export const getERC1155ProxyContract = (signer?: Signer) => {
  if (!signer) {
    return
  }
  return new Contract(nftManagerAddress, NFTManagerABI, signer)
}
