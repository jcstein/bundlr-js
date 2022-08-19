import { useContext, useState } from "react";
import { MainContext } from "../context";
import BigNumber from "bignumber.js";
import {
  Heading,
  Text,
  Input,
  Image,
  Button,
  Container,
  Code,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Topbuttons from "./Components/topbuttons";
import Head from "next/head";

export default function Home() {
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [URI, setURI] = useState();
  const [amount, setAmount] = useState();
  const [transaction, setTransaction] = useState();

  const { initialize, fetchBalance, balance, bundlrInstance } =
    useContext(MainContext);

  async function initializeBundlr() {
    initialize();
  }

  async function fundWallet() {
    if (!amount) return;
    const amountParsed = parseInput(amount);
    let response = await bundlrInstance.fund(amountParsed);
    console.log("Wallet funded:", response);
    fetchBalance();
  }

  function parseInput(input) {
    const conv = new BigNumber(input).multipliedBy(
      bundlrInstance.currencyConfig.base[1]
    );
    if (conv.isLessThan(1)) {
      console.log("error: value too small");
      return;
    } else {
      return conv;
    }
  }

  async function uploadFile() {
    let tx = await bundlrInstance.uploader.upload(file, [
      { name: "Content-Type", value: "image/png" },
    ]);
    console.log("upload tx:", tx);
    setURI(`http://arweave.net/${tx.data.id}`);
    setTransaction(`${tx.data.id}`);
  }

  function onFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const image = URL.createObjectURL(file);
      setImage(image);
      let reader = new FileReader();
      reader.onload = function () {
        if (reader.result) {
          setFile(Buffer.from(reader.result));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  return (
    <div>
      <Head>
        {/* META */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />

        {/* TITLES */}
        <title>Bundlr.js - Arweave Uploader</title>
        <meta name="apple-mobile-web-app-title" content="Bundlr.js Uploader" />
        <meta name="twitter:title" content="Bundlr.js - Arweave Uploader" />
        <meta property="og:title" content="Bundlr.js - Arweave Uploader" />
        <meta property="og:site_name" content="Bundlr.js - Arweave Uploader" />

        {/* FAVICONS */}
        <meta name="favicon" content="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />

        {/* LINKS */}
        <link rel="canonical" href="https://bundlrjs.xyz" />
        <meta name="twitter:url" content="https://bundlrjs.xyz" />
        <meta property="og:url" content="https://bundlrjs.xyz" />
        <meta name="twitter:site:domain" content="bundlrjs.xyz" />

        {/* THEME */}
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        {/* DESCRIPTION */}
        <meta
          property="og:description"
          content="Upload to Arweave using Bundlr.js and MATIC"
        />
        <meta
          name="twitter:description"
          content="Upload to Arweave using Bundlr.js and MATIC"
        />
        <meta
          name="description"
          content="Upload to Arweave using Bundlr.js and MATIC"
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@BundlrNetwork" />

        {/* IMAGE */}
        <meta
          property="og:image:url"
          content="https://raw.githubusercontent.com/jcstein/jpegs/main/bundlrjs.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://raw.githubusercontent.com/jcstein/jpegs/main/bundlrjs.png"
        />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/jcstein/jpegs/main/bundlrjs.png"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/jcstein/jpegs/main/bundlrjs.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Bundlr.js - Arweave Uploader" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <Topbuttons />
      <Container px="10" py="16" maxW="800px">
        <Heading pb="5">Bundlr Network image uploader (MATIC)</Heading>
        <Text pb="5">
          Bundlr is building the next generation of data storage by bringing the
          speed and ease of web2 to web3 technology. We&apos;re a decentralized
          storage scaling platform powered by Arweave. We make it easy for
          developers and businesses to store their data permanently, for a
          one-time fee.
        </Text>
        <Text pb="5">
          This dApp is built with the Bundlr JavaScript SDK and Arweave. The
          payment method for uploading to Arweave with Bundlr is set to MATIC on
          Polygon for this version.
        </Text>
        {!balance && (
          <Button
            onClick={initializeBundlr}
            // backgroundColor="brand.900"
            // color="brand.800"
            colorScheme="green"
          >
            Initialize Bundlr with Ethereum Wallet
          </Button>
        )}
        {balance && (
          <div>
            <Text fontSize="xl" fontStyle="bold" pb="5">
              MATIC Balance: {balance}
            </Text>
            <Input
              placeholder="Amount to fund wallet"
              onChange={(e) => setAmount(e.target.value)}
              mb="3"
              type="number"
            />
            <Button
              onClick={fundWallet}
              // bg="brand.700"
              // color="brand.900"
              colorScheme="green"
              mb="5"
              // _hover={{ bg: "brand.900", color: "brand.700" }}
            >
              Fund Wallet with MATIC
            </Button>
            <Input type="file" onChange={onFileChange} mb="3" padding="1" />
            {image && (
              <Image
                src={image}
                type="image/png"
                alt="your arweave upload"
                pb="3"
                maxW={["300px", "400px", "500px", "600px"]}
                rounded="3xl"
              />
            )}
            <Button
              onClick={uploadFile}
              // backgroundColor="brand.800"
              // color="brand.900"
              colorScheme="pink"
              mb="3"
              // _hover={{ bg: "brand.900", color: "brand.800" }}
            >
              Upload File to Bundlr & Arweave
            </Button>
            <br />
            {URI && (
              <div>
                <Alert status="success" rounded="full" mb="3">
                  <AlertIcon />
                  File uploaded to Arweave. gm Permaweb!
                </Alert>
                <Link href={URI} isExternal>
                  View upload on Arweave <ExternalLinkIcon mx="2px" />
                </Link>
                <br />
                <Text pt="3">
                  Arweave ID: <Code>{transaction}</Code>
                </Text>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
