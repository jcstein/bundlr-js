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
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

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
    <Container px="10" py="16" maxW="800px">
      <Heading pb="5">Bundlr Network image uploader (MATIC)</Heading>
      <Text pb="5">
        Bundlr is building the next generation of data storage by bringing the
        speed and ease of web2 to web3 technology. We're a decentralized storage
        scaling platform powered by Arweave. We make it easy for developers and
        businesses to store their data permanently, for a one-time fee.
      </Text>
      <Text pb="5">
        This dApp is built with the Bundlr JavaScript SDK and Arweave. The
        payment method for uploading to Arweave with Bundlr is set to MATIC on
        Polygon for this version.
      </Text>
      {!balance && (
        <Button
          onClick={initializeBundlr}
          backgroundColor="brand.900"
          color="brand.800"
        >
          Initialize Bundlr
        </Button>
      )}
      {balance && (
        <div>
          <Text fontSize="xl" fontStyle="bold" color="brand.700" pb="5">
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
            bg="brand.700"
            color="brand.900"
            mb="5"
            _hover={{ bg: "brand.900", color: "brand.700" }}
          >
            Fund Wallet
          </Button>
          <Input type="file" onChange={onFileChange} mb="3" padding="1" />
          {image && (
            <Image
              src={image}
              type="image/png"
              alt="your arweave upload"
              pb="3"
              maxW={["300px", "400px", "500px", "600px"]}
            />
          )}
          <Button
            onClick={uploadFile}
            backgroundColor="brand.800"
            color="brand.900"
            mb="3"
            _hover={{ bg: "brand.900", color: "brand.800" }}
          >
            Upload File
          </Button>
          <br />
          {URI && (
            <div>
              <Alert status="success" rounded="full" mb="3">
                <AlertIcon />
                File uploaded to Arweave. gm Permaweb!
              </Alert>
              <Link href={URI} isExternal color="brand.700">
                View upload on Arweave <ExternalLinkIcon mx="2px" />
              </Link>
              <br />
              <Text pt="3" color="brand.800">
                Arweave ID:{" "}
                <Code color="brand.800" bg="brand.900">
                  {transaction}
                </Code>
              </Text>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
