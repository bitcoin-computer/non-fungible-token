/* eslint-disable react-hooks/exhaustive-deps */
import {
  Text,
  Box,
  Button,
  Flex,
  Link,
  Input,
  Select,
  VStack,
  useToast,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { Computer } from "bitcoin-computer";
import PageRoutes from "../../constants/PageRoutes";
import { setAccountInfo } from "../../helpers/AuthHelpers";
import faker from "faker";

const sampleSeedPhrase = "that rough wire intact ice artefact parade youth account mass paddle airport";

const Login = () => {
  const toast = useToast();
  let history = useHistory();

  const suggestedName = faker.internet.userName();

  const login = useCallback((e: any) => {
    e.preventDefault();

    const role = e.target.role.value;
    const username = e.target.username.value;
    const password = e.target.password.value;
    const chain = e.target.chain.value;

    try {
      new Computer({
        network: "testnet",
        chain,
        seed: password,
      });
    } catch (e) {
      toast({
        title: e.message,
        status: "error",
        isClosable: true,
      });
      return;
    }
    setAccountInfo(username, password, chain, role);
    history.push(role === "player" ? PageRoutes.JOIN_ROOM : PageRoutes.HOST);
  }, []);

  return (
    <Flex
      h="inherit"
      flexDirection="column"
      justifyContent="center"
      align="center"
    >
      <Text fontSize="6xl"> Auction Demo App</Text>
      <form onSubmit={login}>
        <VStack w={96} spacing={4}>
          <RadioGroup name="role" defaultValue="player">
            <Stack direction="row" spacing={8}>
              <Radio value="player">Player</Radio>
              <Radio value="host">Host</Radio>
            </Stack>
          </RadioGroup>

          <Select
            isRequired
            mt={2}
            placeholder="Select Chain"
            defaultValue="BSV"
            type="text"
            name="chain"
          >
            <option value="BSV">BSV</option>
            <option value="BCH">BCH</option>
          </Select>
          <Input
            isRequired
            type="text"
            name="username"
            defaultValue={suggestedName}
            placeholder="User Name (anything)"
          />
          <Input
            isRequired
            type="text"
            name="password"
            placeholder="Password (BIP39 Generated Seed Phrase)"
            defaultValue={sampleSeedPhrase}
          />
          <Button w="inherit" type="submit" colorScheme="teal">
            Login
          </Button>
        </VStack>
      </form>
      <Box mt={3}>
        Need A Seed (Password?){" "}
        <Link
          as={RouterLink}
          color="teal.500"
          target="blank"
          to={{ pathname: "http://accounts.protoshi.com" }}
        >
          Click Here
        </Link>
      </Box>
    </Flex>
  );
};

export default Login;
