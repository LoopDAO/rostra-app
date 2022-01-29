import { Contract, Signer } from "ethers"
import NFTManagerABI from "../../contracts/NFTManager.json"

// testnet
// const nftManagerAddress = "0xC453c817633b4A215bc421D8EfAB3abdAE88787B"
// mainnet
const nftManagerAddress = "0xEdb210B003bdd4Ee75229Aea840ED0Ff3C5C314C"
// const erc1155ProxyAddress = "0x5C4614493344648259027C50FBB0aa27c3724D27"

export const getNftManagerContract = (signer?: Signer) => {
  if (!signer) {
    return
  }
  return new Contract(nftManagerAddress, NFTManagerABI, signer)
}

// export const getERC1155ProxyContract = (signer?: Signer) => {
//   if (!signer) {
//     return
//   }
//   return new Contract(nftManagerAddress, NFTManagerABI, signer)
// }
