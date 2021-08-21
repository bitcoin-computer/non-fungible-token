// @flow
import * as React from "react";
import { Button, FormControl, Input, VStack, Text } from "@chakra-ui/react";
import RequiredField from "../../components/Form/RequiredField";
import PageRoutes from "../../constants/PageRoutes";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
type Props = {};

export const JoinRoom = (props: Props) => {
  const history = useHistory();
  const { register, handleSubmit } = useForm();
  const goToAuction = React.useCallback(
    ({ roomId }: { roomId: string }) => {
      history.push(`${PageRoutes.PLAYER}/${roomId}`);
    },
    [history]
  );
  return (
    <form onSubmit={handleSubmit(goToAuction)}>
      <VStack w={72} spacing={3}>
        <Text fontSize="2xl">Enter room key</Text>
        <FormControl>
          <RequiredField>Room Key</RequiredField>
          <Input type="string" {...register("roomId")} required></Input>
        </FormControl>
        <Button type="submit" colorScheme="teal">
          Go to room
        </Button>
      </VStack>
    </form>
  );
};

export default JoinRoom;
