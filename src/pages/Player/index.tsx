/* eslint-disable react-hooks/exhaustive-deps */
// @flow
import {
  VStack,
  FormControl,
  Input,
  Button,
  Text,
  Grid,
  Image,
  useToast,
  Link,
} from "@chakra-ui/react";
import { Computer } from "bitcoin-computer";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useHistory, useParams } from "react-router-dom";
import RequiredField from "../../components/Form/RequiredField";
import CenterGridItem from "../../components/Grid/CenterGridItem";
import PageRoutes from "../../constants/PageRoutes";
import { getAccountInfo } from "../../helpers/AuthHelpers";
import { AuctionRoomModel } from "../../models/AuctionRoomModel";
import { getColorFromStr } from "../../helpers/ColorHelper";
type Props = {};

export const Player = (props: Props) => {
  const { roomId }: { roomId: string } = useParams();
  const history = useHistory();
  const toast = useToast();
  const accountInfo = getAccountInfo();
  const { register, handleSubmit } = useForm();

  const [auctionRoom, setAuctionRoom] = useState<AuctionRoomModel | null>(null);

  const [counter, setCounter] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const [isCounting, setIsCounting] = useState<boolean>(false);

  const [computer] = useState(
    new Computer({
      network: "testnet",
      seed: accountInfo.seed,
      chain: accountInfo.chain,
    })
  );

  const outRoom = useCallback(() => {
    history.push(`${PageRoutes.JOIN_ROOM}`);
  }, [history]);

  const placeNewPrice = async ({ price }: { price: number }) => {
    if (price > (await computer.db.wallet.getBalance()) / 1e8) {
      toast({
        title: "Auction price exceed your balance",
        status: "error",
        isClosable: true,
      });
      return;
    }
    if (auctionRoom && price > auctionRoom.currentPrice) {
      await auctionRoom.placeNewPrice(
        price,
        accountInfo.username,
        computer.db.wallet.getPublicKey().toString()
      );
      toast({
        title: `Placed auction with amount ${price} ${accountInfo.chain}`,
        status: "success",
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Auction price must be larger than current price",
      status: "error",
      isClosable: true,
    });
  };

  useEffect(() => {
    if (!auctionRoom || isCounting) return;
    setIsCounting(true);
    let diffTime = Math.floor(
      (new Date().getTime() - new Date(auctionRoom.startAt).getTime()) / 1000
    );
    const timeLeft =
      auctionRoom.duration - (diffTime - Math.floor((auctionRoom.duration * 1) / 6));
    if (timeLeft <= 0) return;
    setCounter(timeLeft);
  }, [auctionRoom, setCounter, setIsCounting]);

  // Counter
  // const startCount = (duration: number) => {
  //   var interval = setInterval(() => {
  //     if (!auctionRoom?.isFinished && duration > 0) {
  //       setCounter(duration--);
  //       return;
  //     }
  //     console.log("Ending auction");
  //     setCounter(0);
  //     handleEndAuction();
  //     setAuctionRoom(null);
  //     setIsCounting(false);
  //     clearInterval(interval);
  //   }, 1000);
  // };
  // Counter
  useEffect(() => {
    if (auctionRoom == null) return;
    setTimeout(async () => {
      console.log(`Count ${counter}`);
      if (!auctionRoom?.isFinished && counter > 0) {
        setCounter((counter) => counter - 1);
        return;
      }
      console.log("Ending auction");
      setCounter(0);
      handleEndAuction();
      setAuctionRoom(null);
      setIsCounting(false);
    }, 1000);
  }, [counter, setCounter]);

  // Auction end
  const handleEndAuction = async () => {
    if (
      auctionRoom?.currentPlayerPublicKey !==
      computer.db.wallet.getPublicKey().toString()
    ) {
      toast({
        title: "Auction ended!",
        status: "info",
        isClosable: true,
      });
      return;
    }
    if (auctionRoom?.currentPrice == null) return;

    await computer.db.wallet.send(
      auctionRoom?.currentPrice * 1e8,
      auctionRoom?.hostAddress
    );
    toast({
      title: "You win the auction!!!!",
      status: "success",
      isClosable: true,
    });
  };

  // Sync data
  useEffect(() => {
    if (!roomId) return;
    const refreshAuction = async () => {
      console.log("Updating auction");
      if (computer) {
        try {
          const rev = await computer.getLatestRev(roomId);
          setAuctionRoom(await computer.sync(rev));
          console.log(auctionRoom);
        } catch (e) {
          toast({
            title: e.message,
            status: "error",
            isClosable: true,
          });
        }
      }
    };
    refreshAuction();
  }, [refresh]);
  useEffect(() => {
    setTimeout(() => setRefresh(refresh + 1), 5000);
  }, [refresh]);

  return (
    <>
      <Button m={3} type="submit" onClick={outRoom} colorScheme="teal">
        Out room
      </Button>
      <Grid
        h="70%"
        templateRows="repeat(1, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
        p={4}
      >
        <CenterGridItem colSpan={1}>
          <VStack mt={10} w={72}>
            <Text fontSize="3rem">Counter:</Text>
            <Text fontSize="7rem">{counter}</Text>
          </VStack>
        </CenterGridItem>
        <CenterGridItem colSpan={1}>
          <VStack mt={10} w={72} spacing={3}>
            <Text size="xl" fontWeight="semibold">
              Current Price:
            </Text>
            <Text fontSize="md">{auctionRoom?.currentPrice}</Text>
            <Text size="xl" fontWeight="semibold">
              Current Player:
            </Text>
            <Text fontSize="md">{auctionRoom?.currentPlayerName}</Text>
            <Text fontSize="md" fontWeight="semibold">
              Auction Update:
            </Text>
            <VStack maxH={52} w="inherit" overflowY="scroll">
              {auctionRoom &&
                auctionRoom?.auctionHistories.map((_, index) => (
                  <Text key={index} fontSize="md" color={getColorFromStr(_)}>
                    {_}
                  </Text>
                ))}
            </VStack>
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
          <form onSubmit={handleSubmit(placeNewPrice)}>
            <VStack w={72} spacing={3}>
              <Text fontSize="2xl">Place new price:</Text>
              <FormControl>
                <RequiredField>Price</RequiredField>
                <Input type="string" {...register("price")} required></Input>
              </FormControl>
              <Button type="submit" colorScheme="teal">
                Send
              </Button>
              <Text fontSize="xl">
                Fund your wallet here:
                <br />
                <Link
                  as={RouterLink}
                  mt={0}
                  color="teal.500"
                  target="blank"
                  to={{ pathname: "https://faucet.bitcoincloud.net/" }}
                >
                  https://faucet.bitcoincloud.net/
                </Link>
              </Text>
            </VStack>
          </form>
        </CenterGridItem>
      </Grid>
    </>
  );
};

export default Player;
