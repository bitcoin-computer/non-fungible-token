/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@chakra-ui/react";
import CollectionItem from "../../components/CollectionItem";
import { Computer } from "bitcoin-computer";
import { useEffect, useState } from "react";
import { getAccountInfo } from "../../helpers/AuthHelpers";

type Props = {};

export const MyCollections = (props: Props) => {
  const accountInfo = getAccountInfo();
  const [refresh, setRefresh] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [computer] = useState(
    new Computer({
      network: "testnet",
      seed: accountInfo.seed,
      chain: accountInfo.chain,
    })
  );

  useEffect(() => {
    const refreshAuction = async () => {
      if (computer) {
        const revs = await computer.getRevs(
          computer.db.wallet.getPublicKey().toString()
        );
        let results = await Promise.all(
          revs.map(async (rev: any) => computer.sync(rev))
        );
        setProducts(results.filter((_: any) => _.type === 2));
      }
    };
    refreshAuction();
  }, [refresh]);

  useEffect(() => {
    setTimeout(() => setRefresh(refresh + 1), 5000);
  }, [refresh]);

  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(3, 1fr)",
        xl: "repeat(5, 1fr)",
      }}
      p={22}
      gap={10}
    >
      {products.map((_, index) => (
        <CollectionItem key={index} data={_} />
      ))}
    </Grid>
  );
};

export default MyCollections;
