import * as IPFS from 'ipfs-core'

export const saveToIpfs = async (data: any) => {
  const ipfs = await IPFS.create()
  const { cid } = await ipfs.add(JSON.stringify(data))

  console.log("IPFS address", cid.toString());
  return cid.toString();
}