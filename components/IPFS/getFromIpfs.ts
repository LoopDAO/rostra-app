import * as IPFS from 'ipfs-core'

export const getFromIpfs = async (ipfsAddr: string) => {
    const ipfs = await IPFS.create()

    const stream = ipfs.cat(ipfsAddr)
    let data = ''

    for await (const chunk of stream) {
        data += chunk.toString()
    }

    return data;
}