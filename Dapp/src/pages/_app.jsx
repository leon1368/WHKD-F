import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import { mainnet, optimism, polygon } from "wagmi/chains";
import "../styles.css";

const projectId = "7e04eceb69732fac5c852cc85b6c78e0";

// 2. Configure wagmi client
const chains = [
  sepolia,
  // mainnet,
  // , polygon, optimism
];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ version: 2, chains, projectId }),
  publicClient,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiConfig, chains);

// 4. Wrap your app with WagmiProvider and add <Web3Modal /> compoennt
export default function App({ Component, pageProps }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      <style global jsx>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #293147;
        }
      `}</style>
      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeVariables={
          {
            // "--w3m-overlay-background-color": "rgb(110, 139, 255)",
          }
        }
      />
    </>
  );
}
