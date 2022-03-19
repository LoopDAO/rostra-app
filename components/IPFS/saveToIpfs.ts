import * as IPFS from 'ipfs-core'

export const saveToIpfs = async (data: any) => {
  const ipfs = await IPFS.create({ repo: 'rostra-' + Math.random() })
  const { cid } = await ipfs.add(JSON.stringify(data))

  return cid.toString();
}