import { GridItem } from "@chakra-ui/react";

const CenterGridItem = (props: any) => (
  <GridItem
    display="flex"
    justifyContent="center"
    alignItems="center"
    border="3px solid teal"
    {...props}
  >
    {props.children}
  </GridItem>
);
export default CenterGridItem;
