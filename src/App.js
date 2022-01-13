import React, { useState, useEffect, useRef } from "react";
import { Computer } from "bitcoin-computer";
import "./App.css";
import Card from "./card";
import Artwork from "./artwork";

function App() {
  const [config] = useState({
    chain: "BCH",
    network: "testnet",
  });
  const [computer, setComputer] = useState(
    new Computer({
      ...config,
      seed: "title mercy exhibit wasp diesel tell state snow swamp benefit electric admit",
    })
  );

  const [balance, setBalance] = useState(0);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");

  const [revs, setRevs] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [refresh, setRefresh] = useState(0);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(async () => {
    if (computer) {
      const newBalance = await computer.db.wallet.getBalance();
      const newRevs = await computer.getRevs(computer.db.wallet.getPublicKey());
      const newArts = await Promise.all(
        newRevs.map(async (rev) => computer.sync(rev))
      );
      console.log("public key: ", computer.db.wallet.getPublicKey());
      console.log("revs", newRevs);
      console.log("artworks", newArts);
      setBalance(newBalance);
      setRevs(newRevs);
      setArtworks(newArts);
    }
  }, 5000);

  // useEffect(() => {
  //   const fetchRevs = async () => {
  //     setBalance(await computer.db.wallet.getBalance());
  //     setRevs(await computer.getRevs(computer.db.wallet.getPublicKey()));
  //     setTimeout(() => setRefresh(refresh + 1), 20000);
  //   };
  //   fetchRevs();
  // }, [computer, computer.db.wallet, refresh]);

  // useEffect(() => {
  //   const fetchArtworks = async () => {
  //     setArtworks(
  //       await Promise.all(revs.map(async (rev) => computer.sync(rev)))
  //     );
  //   };
  //   fetchArtworks();
  // }, [revs, computer]);

  // useEffect(() => console.log("revs", revs), [revs]);
  // useEffect(() => console.log("artworks", artworks), [artworks]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const artwork = await computer.new(Artwork, [title, artist, url]);
    console.log("created artwork", artwork);
  };

  return (
    <div className="App">
      <h2>Wallet</h2>
      <b>Address</b>&nbsp;{computer.db.wallet.getAddress().toString()}
      <br />
      <b>Public Key</b>&nbsp;{computer.db.wallet.getPublicKey().toString()}
      <br />
      <b>Balance</b>&nbsp;{balance / 1e8} {computer.db.wallet.restClient.chain}
      <br />
      <button type="submit" onClick={() => setComputer(new Computer(config))}>
        Generate New Wallet
      </button>
      <h2>Create new Artwork</h2>
      <form onSubmit={handleSubmit}>
        Title
        <br />
        <input
          type="string"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        Artist
        <br />
        <input
          type="string"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        Url
        <br />
        <input
          type="string"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" value="Send Bitcoin">
          Create Artwork
        </button>
      </form>
      <h2>Your Artworks</h2>
      <ul className="flex-container">
        {artworks.map((artwork) => (
          <Card artwork={artwork} />
        ))}
      </ul>
    </div>
  );
}

export default App;
