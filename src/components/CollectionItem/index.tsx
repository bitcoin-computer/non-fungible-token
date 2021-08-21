// @flow
import { Text, Flex, Image } from "@chakra-ui/react";
import * as React from "react";
import { ProductModel } from "../../models/ProductModel";

type Props = {
  data: ProductModel;
};

const CollectionItem = ({ data }: Props) => {
  return (
    <Flex
      w="100%"
      h="360"
      p={4}
      boxShadow="lg"
      rounded="md"
      border="3px solid teal"
      flexDirection="column"
      align="center"
    >
      <Image
        w="inherit"
        h="300"
        objectFit="contain"
        src={data.imgUrl}
        alt="Collection Image"
      />
      <Text fontSize="2xl" fontWeight="semibold" color="#fff">
        {data.name}
      </Text>
    </Flex>
  );
};

export default CollectionItem;
