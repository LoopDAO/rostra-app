export type GuildListType = {
  name: string,
  desc: string,
  wallet_address: string,
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

export type GuildType = {
  result: string;
  error: string;
};
