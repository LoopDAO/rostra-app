import React, { useRef, ReactNode, useState } from "react"
import {
  Button,
} from "@chakra-ui/react"
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { addressToScript, serializeScript, scriptToHash, rawTransactionToHash, serializeWitnessArgs } from '@nervosnetwork/ckb-sdk-utils'
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
  generateRegisterCotaTx,
  getAlwaysSuccessLock,
  Claim,
  CotaInfo,
  IssuerInfo,
  MintCotaInfo,
  TransferWithdrawal,
} from '@nervina-labs/cota-sdk'
import CKB from '@nervosnetwork/ckb-sdk-core'
import signWitnesses from '@nervosnetwork/ckb-sdk-core/lib/signWitnesses'
import { getSecp256k1CellDep, padStr, cotaService, ckb } from "@lib/utils/ckb"

const TEST_PRIVATE_KEY = '0xd4537602bd78139bfde0771f43f7c007ea1bbb858507055d2ef6225d4ebec23e'
const TEST_ADDRESS = 'ckt1qyqdtuf6kx8f7664atn9xkmwc9qcv4phs4xsackhmh'
const RECEIVER_PRIVATE_KEY = '0x305fbaead56bde6f675fe0294e2126377d7025f36bf4bc1c8f840cb0e22eafef'
const RECEIVER_ADDRESS = 'ckt1qyqrvzu5yw30td23fzw5259j0l0pymj2lc9shtynac'
const OTHER_ADDRESS = 'ckt1qyqz8vxeyrv4nur4j27ktp34fmwnua9wuyqqggd748'

const secp256k1Dep = getSecp256k1CellDep(false)
var url = ''

let cotaId: string = '0xd3b2bc022b52ce7282b354d97f9e5e5baf6698d7'

const registerCota = async (address = TEST_ADDRESS, privateKey = TEST_PRIVATE_KEY) => {
  const provideCKBLock = addressToScript(address)
  const unregisteredCotaLock = addressToScript(address)
  let rawTx = await generateRegisterCotaTx(cotaService, [unregisteredCotaLock], provideCKBLock)
  rawTx.cellDeps.push(secp256k1Dep)

  const registryLock = getAlwaysSuccessLock(false)

  let keyMap = new Map<string, string>()
  keyMap.set(scriptToHash(registryLock), '')
  keyMap.set(scriptToHash(provideCKBLock), privateKey)

  const cells = rawTx.inputs.map((input, index) => ({
    outPoint: input.previousOutput,
    lock: index === 0 ? registryLock : provideCKBLock,
  }))

  const transactionHash = rawTransactionToHash(rawTx)

  const signedWitnesses = signWitnesses(keyMap)({
    transactionHash,
    witnesses: rawTx.witnesses,
    inputCells: cells,
    skipMissingKeys: true,
  })
  const signedTx = {
    ...rawTx,
    witnesses: signedWitnesses.map(witness => (typeof witness === 'string' ? witness : serializeWitnessArgs(witness))),
  }
  console.log('signedTx: ', JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.log(`Register cota cell tx has been sent with tx hash ${txHash}`)
}

const defineNFT = async () => {
  const defineLock = addressToScript(TEST_ADDRESS)

  const cotaInfo: CotaInfo = {
    name: "Rostra launched",
    description: "Rostra launched, new age comes",
    image: "https://i.loli.net/2021/04/29/qyJNSE4iHAas7GL.png",
  }

  let { rawTx, cotaId: cId } = await generateDefineCotaTx(cotaService, defineLock, 100, '0x00', cotaInfo)
  cotaId = cId
  console.log(` ======> cotaId: ${cotaId}`)
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

  let rawTx = await generateIssuerInfoTx(cotaService, cotaLock, issuer)

  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  console.log('signedTx: ', JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Set issuer information tx has been sent with tx hash ${txHash}`)
}

const getNFTInfo = async () => {
  const aggregator = cotaService.aggregator
  // 0x490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000d5f13ab18e9f6b55eae6535b6ec141865437854d
  // 0x490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000360b9423a2f5b551489d4550b27fde126e4afe0b
  // 0x490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8011400000023b0d920d959f07592bd6586354edd3e74aee100
  const lockScript = serializeScript(addressToScript(RECEIVER_ADDRESS))
  console.log('lockScript: ', lockScript)
  const holds = await aggregator.getHoldCotaNft({
    lockScript,
    page: 0,
    pageSize: 10,
  })
  console.log('======= holds: ', JSON.stringify(holds))

  const senderLockHash = await aggregator.getCotaNftSender({
    lockScript,
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
        tokenIndex: '0x00000000', // can only increase from 0x00000000
        state: '0x00',
        characteristic: '0x0505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
      },
      {
        tokenIndex: '0x00000001',
        state: '0x00',
        characteristic: '0x0505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
      },
    ],
  }
  let rawTx = await generateMintCotaTx(cotaService, mintLock, mintCotaInfo)

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
      tokenIndex: '0x00000000',
    }
  ]
  let rawTx = await generateClaimCotaTx(cotaService, claimLock, withdrawLock, claims)

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
  let rawTx = await generateWithdrawCotaTx(cotaService, withdrawLock, withdrawals)

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
  let rawTx = await generateTransferCotaTx(cotaService, cotaLock, withdrawLock, transfers)

  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(RECEIVER_PRIVATE_KEY)(rawTx)
  console.log('signedTx: ', JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Transfer cota nft tx has been sent with tx hash ${txHash}`)
}

const verify = async () => {
  console.log(` ======> cotaId: ${cotaId}`)
  const mintLock = addressToScript(TEST_ADDRESS)
  var code = generateCode()
  console.log("digital code: " + code)
  var hexStr = decimalToHex(code, 40)
  console.log("hexStr: " + hexStr)
  const mintCotaInfo: MintCotaInfo = {
    cotaId,
    withdrawals: [
      {
        tokenIndex: '0x00000001', // can only increase from 0x00000000
        state: '0x00',
        // characteristic must be hex str starts with '0x' and size = 20
        characteristic: hexStr,
        toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
      },
      // {
      //   tokenIndex: '0x00000003',
      //   state: '0x00',
      //   characteristic: generateCode(),
      //   toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
      // },
    ],
  }
  let rawTx = await generateMintCotaTx(cotaService, mintLock, mintCotaInfo)

  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  console.log('signedTx: ', JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Mint cota nft tx has been sent with tx hash ${txHash}`)
}

function decimalToHex(d: string, padding: any) {
  var hex = Number(d).toString(16);
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
  console.log(hex)
  while (hex.length < padding) {
    hex = "0" + hex;
  }
  hex = hex?.startsWith('0x') ? hex : `0x${hex}`

  return hex;
}

function generateCode(): string {
  const crypto = require('crypto');
  let code: string = "";


  do {
    code += crypto.randomBytes(3).readUIntBE(0, 3);
  } while (code.length <= 6);
  return code.slice(0, 6);
}


const showQRCode = async () => {
  const testCode = '0x0000000000000000000000000000000000020e4a'
  const qr = require('qrcode')
  qr.toDataURL(testCode, (err: any, src: string) => {
    url = src
  });
  console.log(url)
  return url
}

export default function CreateRedPacket() {
  return (
    <>
      <Button onClick={() => registerCota(TEST_ADDRESS, TEST_PRIVATE_KEY)}> registerCota(Owner) </Button>
      <Button onClick={() => registerCota(RECEIVER_ADDRESS, RECEIVER_PRIVATE_KEY)}> registerCota(Receiver) </Button>
      <Button onClick={defineNFT}> defineNFT </Button>
      <Button onClick={setIssuer}> setIssuer </Button>
      <Button onClick={getNFTInfo}> getNFTInfo </Button>
      <Button onClick={mint}> mint </Button>
      <Button onClick={claim}> claim </Button>
      <Button onClick={withdraw}> withdraw </Button>
      <Button onClick={transfer}> transfer </Button>
      <Button onClick={transfer}> transfer </Button>
      <Button onClick={verify}> verify </Button>
      <Button onClick={showQRCode}> showQRCode </Button>
      {/* <Box boxSize='sm'>
        <Image src={url} alt='Dan Abramov' />
      </Box> */}
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