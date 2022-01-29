import { Contract, Signer } from "ethers"
import NFTManagerABI from "../../contracts/NFTManager.json"

export const getNftManagerContract = (signer?: Signer, chainId = 137) => {
  console.log('chainId ====> ', chainId)
  if (!signer) {
    console.error("No signer provided")
  }
  let nftManagerAddress = process.env.NEXT_PUBLIC_NFT_MANAGER_137 as string
  if (chainId === 80001) {
    nftManagerAddress = process.env.NEXT_PUBLIC_NFT_MANAGER_80001 as string
  }
  console.log('nftManagerAddress: ', nftManagerAddress)
  if (!nftManagerAddress) {
    console.error(`No NFT Manager address found for chain ${chainId}`)
  }

  return new Contract(nftManagerAddress, NFTManagerABI, signer)
}
