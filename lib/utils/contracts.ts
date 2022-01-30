import { Contract, Signer } from "ethers"
import NFTManagerABI from "../../contracts/NFTManager.json"

const contracts: any = {
  80001: process.env.NEXT_PUBLIC_NFT_MANAGER_80001,
  137: process.env.NEXT_PUBLIC_NFT_MANAGER_137,
}

export const getNftManagerContract = (signer?: Signer, chainId = 80001) => {
  if (!signer) {
    console.error("No signer provided")
  }
  const nftManagerAddress = contracts[chainId]
  console.log(`chainId: ${chainId}`, typeof chainId)
  console.log(`NFTManager address: ${nftManagerAddress}`)
  if (!nftManagerAddress) {
    console.error(`No NFT Manager address found for chain ${chainId}`)
  }

  return new Contract(nftManagerAddress, NFTManagerABI, signer)
}
