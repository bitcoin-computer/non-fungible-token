/* eslint-disable react-hooks/exhaustive-deps */
// @flow
import {
  Button,
  FormControl,
  Input,
  VStack,
  Text,
  Grid,
  Image,
  useToast,
} from "@chakra-ui/react";
import { Computer } from "bitcoin-computer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import RequiredField from "../../components/Form/RequiredField";
import CenterGridItem from "../../components/Grid/CenterGridItem";
import { getAccountInfo } from "../../helpers/AuthHelpers";
import { AuctionInputModel } from "../../models/AuctionInputModel";
import { AuctionRoomModel } from "../../models/AuctionRoomModel";
import { ProductModel } from "../../models/ProductModel";
import { getColorFromStr } from "../../helpers/ColorHelper";

type Props = {};

const sampleImgUrl =
  "https://cdn.pixabay.com/photo/2020/03/01/17/50/monalisa-4893660_640.jpg";

const Host = (props: Props) => {
  const accountInfo = getAccountInfo();
  const { register, handleSubmit } = useForm();
  const toast = useToast();

  const [auctionRoom, setAuctionRoom] = useState<AuctionRoomModel | null>(null);
  const [isAuctioning, setIsAuctioning] = useState(false);
  const [counter, setCounter] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const [computer] = useState(
    new Computer({
      network: "testnet",
      seed: accountInfo.seed,
      chain: accountInfo.chain,
    })
  );

  const startAuction = async (data: AuctionInputModel) => {
    const publicKey = computer.db.wallet.getPublicKey().toString();
    const address = computer.db.wallet.getAddress().toString();
    try {
      const auctionRoom = await computer.new(AuctionRoomModel, [
        new Date().toString(),
        data.duration,
        false,
        address,
        publicKey,
        data.productName,
        data.productImgUrl,
      ]);
      setIsAuctioning(true);
      setAuctionRoom(auctionRoom);
      setCounter(data.duration);
    } catch (e) {
      toast({
        title: e.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  const addPlayer = async (data: any) => {
    await auctionRoom?.addPlayer(data.playerKey);
  };

  // Counter
  useEffect(() => {
    if (auctionRoom == null) return;
    setTimeout(async () => {
      console.log(`Count ${counter}`);
      if (!auctionRoom?.isFinished && counter > 0) {
        setCounter((counter) => counter - 1);
        return;
      }
      await endAuction();
    }, 1000);
  }, [counter, setCounter]);

  // Sync data
  useEffect(() => {
    if (!auctionRoom) return;
    console.log("Updating auction");
    console.log(auctionRoom._owners);

    const refreshAuction = async () => {
      if (computer) {
        const rev = await computer.getLatestRev(auctionRoom?._id);
        setAuctionRoom(await computer.sync(rev));
      }
    };
    refreshAuction();
  }, [refresh]);

  useEffect(() => {
    setTimeout(() => setRefresh(refresh + 1), 3000);
  }, [refresh]);

  // End Auction
  const endAuction = async () => {
    console.log("Ending auction");
    if (auctionRoom?.currentPrice !== 0) {
      toast({
        title: `Winner is ${auctionRoom?.currentPlayerName}`,
        status: "success",
        isClosable: true,
      });
      await computer.new(ProductModel, [
        auctionRoom?.productName,
        auctionRoom?.productImgUrl,
        auctionRoom?.currentPlayerPublicKey,
      ]);
      console.log("Sent product to winner");
    }
    setCounter(0);
    setIsAuctioning(false);
    await auctionRoom?.finish();
    toast({
      title: "Auction ended!",
      status: "info",
      isClosable: true,
    });
  };

  return (
    <>
      <Grid
        h="85%"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
        p={4}
      >
        <CenterGridItem
          flexDirection="column"
          alignItems="center"
          rowSpan={2}
          colSpan={1}
        >
          <form onSubmit={handleSubmit(startAuction)}>
            <VStack w={72} spacing={4}>
              <Text fontSize="2xl">Create Auction</Text>
              <FormControl isDisabled={isAuctioning}>
                <RequiredField>Duration (second)</RequiredField>
                <Input
                  type="number"
                  defaultValue="30"
                  {...register("duration")}
                  isRequired
                ></Input>
              </FormControl>
              <Text fontSize="2xl">Product Info:</Text>
              <FormControl isDisabled={isAuctioning}>
                <RequiredField>Name</RequiredField>
                <Input
                  type="title"
                  {...register("productName")}
                  required
                ></Input>
              </FormControl>
              <FormControl isDisabled={isAuctioning}>
                <RequiredField>Image Url</RequiredField>
                <Input
                  type="string"
                  defaultValue={sampleImgUrl}
                  {...register("productImgUrl")}
                  required
                ></Input>
              </FormControl>
              <Button
                w={44}
                isDisabled={isAuctioning}
                type="submit"
                colorScheme="teal"
              >
                Start Auction Now
              </Button>
            </VStack>
          </form>
          <Button
            mt={4}
            w={44}
            isDisabled={!isAuctioning}
            colorScheme="red"
            onClick={endAuction}
          >
            End Auction Now
          </Button>
        </CenterGridItem>
        <CenterGridItem rowSpan={1} colSpan={1}>
          <VStack mt={10} w={72}>
            <Text fontSize="3rem">Counter:</Text>
            <Text fontSize="7rem">{counter}</Text>
          </VStack>
        </CenterGridItem>
        <CenterGridItem colSpan={1} alignItems="flex-start">
          <VStack mt={10} w={72} spacing={3}>
            <Text size="xl" fontWeight="semibold">
              Current Price:
            </Text>
            <Text fontSize="md">{auctionRoom?.currentPrice}</Text>
            <Text size="xl" fontWeight="semibold">
              Current Player:
            </Text>
            <Text fontSize="md">{auctionRoom?.currentPlayerName}</Text>
          </VStack>
        </CenterGridItem>
        <CenterGridItem flexDirection="column" colSpan={1}>
          {auctionRoom && (
            <>
              <Text fontSize="2xl">Product:</Text>
              <Image
                w="inherit"
                h="300"
                objectFit="contain"
                src={auctionRoom?.productImgUrl}
                alt="Collection Image"
              />
              <Text fontSize="xl">
                <b>Product Name:&nbsp;</b>
                {auctionRoom?.productName}
              </Text>
            </>
          )}
        </CenterGridItem>
        <CenterGridItem colSpan={1}>
          <form onSubmit={handleSubmit(addPlayer)}>
            <VStack w={72}>
              <Text mt={2} fontWeight="bold">
                Send player room id:&nbsp;
              </Text>
              <Text mt={0} w="20rem" fontSize="md">
                {auctionRoom && auctionRoom._id}
              </Text>
              <Text fontSize="2xl">Add Player</Text>
              <FormControl isDisabled={!isAuctioning}>
                <RequiredField>User Public Key</RequiredField>
                <Input
                  type="string"
                  {...register("playerKey")}
                  required
                ></Input>
              </FormControl>
              <Button
                isDisabled={!isAuctioning}
                type="submit"
                colorScheme="teal"
              >
                Add player
              </Button>
            </VStack>
          </form>
        </CenterGridItem>
        <CenterGridItem colSpan={2} alignItems="flex-start">
          <VStack mt={4} maxH={52} w={80} overflowY="scroll">
            <Text fontSize="2xl">Auction Update:</Text>
            {auctionRoom &&
              auctionRoom?.auctionHistories.map((_, index) => (
                <Text key={index} fontSize="md" color={getColorFromStr(_)}>
                  {_}
                </Text>
              ))}
          </VStack>
        </CenterGridItem>
      </Grid>
    </>
  );
};

export default Host;
