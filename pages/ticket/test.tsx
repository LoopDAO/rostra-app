import React, { useRef, ReactNode, useState } from "react"
import {
  Button,
} from "@chakra-ui/react"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { addressToScript, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import {
  Service,
  Collector,
  Aggregator,
  generateDefineCotaTx,
  generateIssuerInfoTx,
  generateMintCotaTx,
  generateClaimCotaTx,
  generateWithdrawCotaTx,
  generateTransferCotaTx,
  Claim,
  CotaInfo,
  IssuerInfo,
  MintCotaInfo,
  TransferWithdrawal,
} from '@nervina-labs/cota-sdk'
import CKB from '@nervosnetwork/ckb-sdk-core'

const TEST_PRIVATE_KEY = '0xc5bd09c9b954559c70a77d68bde95369e2ce910556ddc20f739080cde3b62ef2'
const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'
const RECEIVER_PRIVATE_KEY = '0xcf56c11ce3fbec627e5118acd215838d1f9c5048039792d42143f933cde76311'
const RECEIVER_ADDRESS = 'ckt1qyqdcu8n8h5xlhecrd8ut0cf9wer6qnhfqqsnz3lw9'
const OTHER_ADDRESS = 'ckt1qyqz8vxeyrv4nur4j27ktp34fmwnua9wuyqqggd748'

const secp256k1CellDep = async (ckb: CKB): Promise<CKBComponents.CellDep> => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  return { outPoint: secp256k1Dep?.outPoint || null, depType: 'depGroup' }
}

const service: Service = {
  collector: new Collector({
    ckbNodeUrl: 'https://ckb-testnet.rebase.network/rpc', ckbIndexerUrl: 'https://testnet.ckbapp.dev/indexer'
    // ckbNodeUrl: 'https://testnet.ckb.dev/rpc', ckbIndexerUrl: 'https://testnet.ckbapp.dev/indexer'
    // ckbNodeUrl: 'https://testnet.ckbapp.dev/rpc', ckbIndexerUrl: 'https://testnet.ckbapp.dev/indexer'
  }),
  aggregator: new Aggregator({ registryUrl: 'http://cota-registry-aggregator.rostra.xyz', cotaUrl: 'http://cota-aggregator.rostra.xyz' }),
}
const ckb = service.collector.getCkb()

let cotaId: string = '0x8b1d57106941ed7dcda9677e79a54946914d845e'

const defineNFT = async () => {
  const defineLock = addressToScript(TEST_ADDRESS)

  const cotaInfo: CotaInfo = {
    name: "Rostra launched",
    description: "Rostra launched, new age comes",
    image: "https://i.loli.net/2021/04/29/qyJNSE4iHAas7GL.png",
  }

  let { rawTx, cotaId: cId } = await generateDefineCotaTx(service, defineLock, 100, '0x00', cotaInfo)
  cotaId = cId
  console.log(` ======> cotaId: ${cotaId}`)
  let secp256k1Dep = await secp256k1CellDep(ckb)
  console.log(' ===================== secp256k1Dep ===================== ')
  rawTx.cellDeps.push(secp256k1Dep)
  try {
    const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
    console.log('signedTx: ', JSON.stringify(signedTx))
    let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
    console.info(`Define cota nft tx has been sent with tx hash ${txHash}`)
  } catch (error) {
    console.error('error happened:', error)
  }
}

const setIssuer = async () => {
  console.log(` ======> cotaId: ${cotaId}`)
  const cotaLock = addressToScript(TEST_ADDRESS)

  const issuer: IssuerInfo = {
    name: "Rostra",
    description: "Community building protocol",
    avatar: "https://i.loli.net/2021/04/29/IigbpOWP8fw9qDn.png",
  }

  let rawTx = await generateIssuerInfoTx(service, cotaLock, issuer)

  const secp256k1Dep = await secp256k1CellDep(ckb)
  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  console.log('signedTx: ', JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Set issuer information tx has been sent with tx hash ${txHash}`)
}

const getNFTInfo = async () => {
  const aggregator = service.aggregator
  const holds = await aggregator.getHoldCotaNft({
    lockScript:
      '0x490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000dc70f33de86fdf381b4fc5bf092bb23d02774801',
    page: 0,
    pageSize: 10,
  })
  console.log('======= holds: ', JSON.stringify(holds))

  const senderLockHash = await aggregator.getCotaNftSender({
    lockScript:
      '0x490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000dc70f33de86fdf381b4fc5bf092bb23d02774801',
    cotaId,
    tokenIndex: '0x00000000',
  })
  console.log('======= senderLockHash: ', JSON.stringify(senderLockHash))
}


const mint = async () => {
  console.log(` ======> cotaId: ${cotaId}`)
  const mintLock = addressToScript(TEST_ADDRESS)

  const mintCotaInfo: MintCotaInfo = {
    cotaId,
    withdrawals: [
      {
        tokenIndex: '0x00000002', // can only increase from 0x00000000
        state: '0x00',
        characteristic: '0x0505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
      },
      {
        tokenIndex: '0x00000003',
        state: '0x00',
        characteristic: '0x0505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
      },
    ],
  }
  let rawTx = await generateMintCotaTx(service, mintLock, mintCotaInfo)

  const secp256k1Dep = await secp256k1CellDep(ckb)
  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  console.log('signedTx: ', JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Mint cota nft tx has been sent with tx hash ${txHash}`)
}

const claim = async () => {
  console.log(` ======> cotaId: ${cotaId}`)
  const claimLock = addressToScript(RECEIVER_ADDRESS)
  const withdrawLock = addressToScript(TEST_ADDRESS)

  const claims: Claim[] = [
    {
      cotaId,
      tokenIndex: '0x00000002',
    }
  ]
  let rawTx = await generateClaimCotaTx(service, claimLock, withdrawLock, claims)

  const secp256k1Dep = await secp256k1CellDep(ckb)
  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(RECEIVER_PRIVATE_KEY)(rawTx)
  console.log('signedTx: ', JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Claim cota nft tx has been sent with tx hash ${txHash}`)
}

const withdraw = async () => {
  console.log(` ======> cotaId: ${cotaId}`)
  const withdrawLock = addressToScript(RECEIVER_ADDRESS)
  const toLock = addressToScript(TEST_ADDRESS)

  const withdrawals: TransferWithdrawal[] = [
    {
      cotaId,
      tokenIndex: '0x00000000',
      toLockScript: serializeScript(toLock),
    },
  ]
  let rawTx = await generateWithdrawCotaTx(service, withdrawLock, withdrawals)

  const secp256k1Dep = await secp256k1CellDep(ckb)
  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(RECEIVER_PRIVATE_KEY)(rawTx)
  console.log('signedTx: ', JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Withdraw cota nft tx has been sent with tx hash ${txHash}`)
}

const transfer = async () => {
  console.log(` ======> cotaId: ${cotaId}`)
  const cotaLock = addressToScript(RECEIVER_ADDRESS)
  const withdrawLock = addressToScript(TEST_ADDRESS)

  const transfers: TransferWithdrawal[] = [
    {
      cotaId,
      tokenIndex: '0x00000001',
      toLockScript: serializeScript(addressToScript(OTHER_ADDRESS)),
    },
  ]
  let rawTx = await generateTransferCotaTx(service, cotaLock, withdrawLock, transfers)

  const secp256k1Dep = await secp256k1CellDep(ckb)
  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(RECEIVER_PRIVATE_KEY)(rawTx)
  console.log('signedTx: ', JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Transfer cota nft tx has been sent with tx hash ${txHash}`)
}

export default function CreateRedPacket() {
  return (
    <>
      <Button onClick={defineNFT}> defineNFT </Button>
      <Button onClick={setIssuer}> Set Issuer </Button>
      <Button onClick={getNFTInfo}> getNFTInfo </Button>
      <Button onClick={mint}> mint </Button>
      <Button onClick={claim}> claim </Button>
      <Button onClick={withdraw}> withdraw </Button>
      <Button onClick={transfer}> transfer </Button>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  }
}
