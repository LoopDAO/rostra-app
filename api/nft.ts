export type NFTType = {
  nft_id?: string,
  guild_id?: string,
  name: string,
  desc: string,
  ipfsAddr?: string,
  wallet_address?: string,
  creator?: string,
  signature?: string,
  members?: Array<string>,
  requirements?: {
    nfts: Array<{
      name: string,
      baseURI: string
    }>,
    guilds: Array<string>
  }
}

export type NFTAPIType = {
  result: string
  error: string
}
