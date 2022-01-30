export type GuildType = {
  guild_id?: string;
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

export type GuildAPIType = {
  result: string;
  error: string;
};
