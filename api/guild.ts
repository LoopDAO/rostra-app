import { get, post } from './http';

export type GuildListType = {
  guild_id: number,
  name: string,
  desc: string,
  creator: string,
  wallet_address: string,
  signature: string,
  members: {
    nfts: [
      {
        name: string,
        baseURI: string
      }
    ],
    guilds: []
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

export function addGuild(): Promise<GuildType> {
  return post('/rostra/guild/add', header);
}

export function getGuild(): Promise<GuildType> {
  return get('/rostra/guild/get', header);
}

export function getGuildByAddress(address: string): Promise<GuildType> {
  return get('http://localhost:5000/rostra/guild/get/' + address, header);
}

