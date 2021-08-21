import React from "react";
import { FormLabel, Text } from "@chakra-ui/react";

const RequiredField = ({ children }: { children: any }) => (
  <FormLabel>
    {children}{" "}
    <Text as="a" color="red.500">
      *
    </Text>
  </FormLabel>
);

export default React.memo(RequiredField);
