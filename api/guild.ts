import { get, post } from './http';

export type GuildListType = {
  guild_id: number,
  name: string,
  desc: string,
  creator: string,
  wallet_address: string,
  signature: string,
  members: {
    nfts: Array<{
      name: string,
      baseURI: string
    }>,
    guilds: Array<string>
  }
}

type GuildType = {
  result: string;
  error: string;
};

const header: {[key: string]: string} = {
  accept: 'application/json',
  'Content-Type': 'application/json'
};

export function addGuild(newGuild: GuildListType): Promise<string> {
  return post('/rostra/guild/add', newGuild, header);
}

export function getGuild(): Promise<GuildType[]> {
  return get('/rostra/guild/get', header);
}

export function getGuildByAddress(address: string): Promise<GuildType> {
  return get('/rostra/guild/get/' + address, header);
}
