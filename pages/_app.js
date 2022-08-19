import "../styles/globals.css";
import { providers, utils } from "ethers";
import { WebBundlr } from "@bundlr-network/client";
import { useState, useRef } from "react";
import { MainContext } from "../context";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/chakra-petch";

function MyApp({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState();
  const [balance, setBalance] = useState();
  const bundlrRef = useRef();

  const theme = extendTheme({
    fonts: {
      heading: `'Chakra Petch', sans-serif`,
      body: `'Chakra Petch', sans-serif`,
    },
    colors: {
      brand: {
        900: "#000000",
        800: "#e0def0",
        700: "#c7e2e3",
      },
    },
  });

  async function initialize() {
    await window.ethereum.enable();
    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready();

    const bundlr = new WebBundlr(
      "https://node1.bundlr.network",
      "matic",
      provider
    );
    await bundlr.ready();
    setBundlrInstance(bundlr);
    bundlrRef.current = bundlr;
    fetchBalance();
  }
  async function fetchBalance() {
    const bal = await bundlrRef.current.getLoadedBalance();
    console.log("bal", utils.formatEther(bal.toString()));
    setBalance(utils.formatEther(bal.toString()));
  }

  return (
    <div>
      <ChakraProvider theme={theme}>
        <MainContext.Provider
          value={{ initialize, fetchBalance, balance, bundlrInstance }}
        >
          <Component {...pageProps} />
        </MainContext.Provider>
      </ChakraProvider>
    </div>
  );
}

export default MyApp;
