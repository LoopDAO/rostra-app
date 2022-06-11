## Rostra app

This repo is the frontend code of Rostra.

Rostra is a web3 community building platform. Help build belonging into communities by providing a complete set of NFT and identity solutions.

Rostra is built on top of [Nervos Network](https://www.nervos.org/), which is an open source public blockchain ecosystem and collection of protocols creating the foundation for a universal internet-like public network.

## Tech stack
- React: Frontend library
- Nextjs: React framework
- [nft.storage](https://nft.storage/): IPFS service provider to store NFT images
- [Cota SDK](https://github.com/nervina-labs/cota-sdk-js): Use to issue, mint and management NFTs.
- [Flashsigner](https://github.com/nervina-labs/flashsigner-sdk-js): User can login with phone number and generate private key with browser's SubtleCrypto interface.
- [Nervos Network](https://www.nervos.org/): Blockchain

## Getting Started

1. Setup env

```bash
cp .env.example .env.development
```

Get api key from [nft.storage](https://nft.storage/) and change the variable value:
`NEXT_PUBLIC_NFT_STORAGE_API_KEY=xxx`, replace `xxx` with your api key.

2. Install packages

```bash
yarn
```

3. Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4. Run backend service

Refer to https://github.com/LoopDAO/rostra-backend

## What you can do with Rostra
As a community manager, you can:
- Create NFT as many as you want
- Reward your community members with NFTs
- See how many NFTs have been created

As a community user, you can:
- Login with phone number
- See what NFTs you held
- Use NFTs to unlock more benefits

## Why use rostra
- Create NFT with extreme low price
- Support to login with phone number without compromise the safety
- Free mint, you can create NFT as many as you want

## Roadmap(Simple yet powerful)
Get the status of these features from https://github.com/orgs/LoopDAO/projects/1/views/1

- Unipass support
- Support to update NFT info
	- name
	- description
	- total supply
- Support more media type
	- audio
	- video
- Support to custom NFT characteristics
- Support NFT templates
	- common
	- mystery box

## License

MIT