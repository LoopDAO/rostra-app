export type GuildListType = {
  guild_id: number,
  name: string,
  desc: string,
  creator: string,
  wallet_address: string,
  signature: string,
  members: Array<string>,
  requirements: {
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
