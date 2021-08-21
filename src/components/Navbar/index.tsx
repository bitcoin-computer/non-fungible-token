/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useCallback, useState } from "react";
import {
  Button,
  Flex,
  HStack,
  Link,
  Text,
  useInterval,
} from "@chakra-ui/react";
import { Link as RouteLink, useHistory } from "react-router-dom";
import { getAccountInfo, removeAccountInfo } from "../../helpers/AuthHelpers";
import { Computer } from "bitcoin-computer";
import PageRoutes from "../../constants/PageRoutes";

interface Props {
  children: ReactNode;
}

interface LinkProps {
  url: string;
  children: ReactNode;
}

const NavLink = ({ url, children }: LinkProps) => (
  <Link
    px={2}
    py={1}
    fontWeight="semibold"
    rounded={"md"}
    color="#fff"
    _hover={{
      textDecoration: "none",
    }}
    as={RouteLink}
    to={url}
  >
    {children}
  </Link>
);

const NavBar = ({ children }: Props) => {
  const history = useHistory();

  // Update balance
  const [balance, setBalance] = useState(0);
  const [accountInfo] = useState(getAccountInfo());
  const [navUrls] = useState({
    Home: accountInfo.role === "player" ? PageRoutes.JOIN_ROOM : PageRoutes.HOST,
    "My Collections": PageRoutes.MY_COLLECTIONS,
  });

  const logOut = useCallback(() => {
    removeAccountInfo();
    history.push(PageRoutes.LOGIN);
  }, []);

  const [computer] = useState(
    new Computer({
      network: "testnet",
      seed: accountInfo.seed,
      chain: accountInfo.chain,
    })
  );

  useInterval(() => {
    const getBalance = async () => {
      if (computer) setBalance(await computer.db.wallet.getBalance());
    };
    getBalance();
  }, 3000);

  return (
    <>
      <Flex
        h={14}
        px={4}
        bg="gray.700"
        justifyContent="space-between"
        align="center"
      >
        <HStack as={"nav"} spacing={4}>
          {Object.entries(navUrls).map(([k, v]) => (
            <NavLink key={v} url={v}>
              {k}
            </NavLink>
          ))}
        </HStack>
        <HStack spacing={4}>
          <Text color="#fff">
            <b>Username:&nbsp;</b>
            {accountInfo.username}
          </Text>
          <Button h={8} colorScheme="teal" onClick={logOut}>
            Log Out
          </Button>
        </HStack>
      </Flex>
      <Flex
        h={10}
        px={6}
        color="#fff"
        bg="gray.800"
        justifyContent="space-between"
        align="center"
      >
        <Text>
          <b>Public Key:&nbsp;</b>
          {computer ? computer.db.wallet.getPublicKey().toString() : ""}
        </Text>
        <Text>
          <b>Balance:&nbsp;</b>
          {balance / 1e8} {accountInfo.chain}
        </Text>
        <Text>
          <b>Address:&nbsp;</b>
          {computer ? computer.db.wallet.getAddress().toString() : ""}
        </Text>
      </Flex>
      {children}
    </>
  );
};

export default NavBar;
