import { InjectedConnector } from "@web3-react/injected-connector"
// Add it later
// import { WalletConnectConnector } from "@web3-react/walletconnect-connector"

export enum Chains {
  ETHEREUM = 1,
  POLYGON = 137,
}

export const RPC: { [key: string]: any } = {
  ETHEREUM: {
    chainId: 1,
    chainName: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000", // needed for proper form handling in the TokenFormCard component
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://etherscan.io"],
    iconUrls: ["/image/network/ethereum.svg"],
    rpcUrls: ["https://main-light.eth.linkpool.io"],
  },
  POLYGON: {
    chainId: "0x89",
    chainName: "Matic",
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
    iconUrls: ["/image/network/polygon.svg"],
  },
} as const

export const supportedChains = ["ETHEREUM"]
export const supportedChainIds = supportedChains.map((_: string) => Chains[_ as keyof typeof Chains])

export const injected = new InjectedConnector({ supportedChainIds })

// TODO: Add walletconnect
// export const walletConnect = new WalletConnectConnector({
//   supportedChainIds,
//   rpc: Object.keys(RPC).reduce(
//     (obj, chainName) => ({
//       ...obj,
//       [Chains[chainName as keyof typeof Chains]]: RPC[chainName].rpcUrls[0],
//     }),
//     {}
//   ),
//   qrcode: true,
// })
