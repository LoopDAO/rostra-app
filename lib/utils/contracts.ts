import { Contract, Signer } from "ethers"
import NFTManagerABI from "../../contracts/NFTManager.json"

const nftManagerAddress = "0xf00CFE0B4b6cCBADc345b0229235D8104e7E5464"

export const getNftManagerContract = (signer?: Signer) => {
  if (!signer) {
    return
  }
  return new Contract(nftManagerAddress, NFTManagerABI, signer)
}
