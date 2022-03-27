import React, { useState, useEffect, useRef } from "react";
import { Computer } from "bitcoin-computer-lib";
import "./App.css";
import Card from "./card";
import Artwork from "./artwork";
import { areEqual } from "./util";

function App() {
  const [config] = useState({
    chain: "LTC",
    network: "testnet",
    url: "http://node.bitcoincomputer.io",

    // Uncomment to run on regtest with a local Bitcoin Computer Node.
    // network: "regtest",
    // url: "http://127.0.0.1:3000",
  });
  const [computer, setComputer] = useState(
    new Computer({
      ...config,
      seed: 'travel upgrade inside soda birth essence junk merit never twenty system opinion'
    })
  );

  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isComputerLoading, setIsComputerLoading] = useState(true);
  const [isSendingArt, setIsSendingArt] = useState(false);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");

  const [revs, setRevs] = useState([]);
  const [artworks, setArtworks] = useState([]);

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

  useEffect(() => {
    console.log("new address generated");
    setIsComputerLoading(true);
  }, [computer]);

  useInterval(async () => {
    try {
      if (computer) {
        const newBalance = await computer.db.wallet.getBalance();
        const newRevs = await computer.getRevs(
          computer.db.wallet.getPublicKey()
        );
        console.log("public key: ", computer.db.wallet.getPublicKey());
        console.log("revs", newRevs);
        // sync art work when revs are not same
        if (!areEqual(revs, newRevs)) {
          const newArts = await Promise.all(
            newRevs.map(async (rev) => computer.sync(rev))
          );
          console.log("artworks", newArts);
          setArtworks(newArts);
        } else {
          console.log("no new art added");
        }
        setBalance(newBalance);
        setRevs(newRevs);
      }
    } catch (err) {
      console.log("error occurred while fetching wallet details: ", err);
    } finally {
      setIsComputerLoading(false);
    }
  }, 3000);

  const artSendingInProgress = (flag) => {
    console.log('called from child')
    setIsSendingArt(flag);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      if (!title) {
        alert("Provide valid title.");
        return;
      }
      if (!artist) {
        alert("Provide valid artist.");
        return;
      }
      if (!url) {
        alert("Provide valid url.");
        return;
      }
      setIsLoading(true);
      const artwork = await computer.new(Artwork, [title, artist, url]);
      console.log("created artwork", artwork);
    } catch (err) {
      console.log("error occurred while creating art: ", err);
    } finally {
      setTitle("")
      setArtist("")
      setUrl("")
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      {
        <div>
          <h2>Wallet</h2>
          <b>Address</b>&nbsp;{computer.db.wallet.getAddress().toString()}
          <br />
          <b>Public Key</b>&nbsp;{computer.db.wallet.getPublicKey().toString()}
          <br />
          <b>Balance</b>&nbsp;{balance / 1e8}{" LTC"}
          <br />
          <button
            type="submit"
            onClick={() => setComputer(new Computer(config))}
          >
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
              <Card artwork={artwork} setArtSending={artSendingInProgress} key={artwork.url}/>
            ))}
          </ul>{" "}
        </div>
      }
    </div>
  );
}

export default App;
