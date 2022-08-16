# Non Fungible Token

A non-fungible token (NFT) is a digital representation of a physical asset. Below shown is a minimal application of an NFT, which can create and share tokens. For instance, you can create a new artwork token and send it to a friend. The screen automatically refreshes every few seconds to show the tokens owned by each user. This application is built using [Bitcoin Computer](https://bitcoin-computer.gitbook.io/docs/).

![app image](/public/screen-shot.png)


The application first creates a ```Computer``` object. You can configure the parameters to use <em>regtest</em> (local) or <em>testnet</em> network modes. You can use a set of [BIP39 words](https://iancoleman.io/bip39/) as seed.


```javascript
const [config] = useState({
    chain: 'LTC',
    network: 'testnet',
    url: 'https://node.bitcoincomputer.io',
    // to run locally, change network and url:
    // network: 'regtest',
    // url: 'http://127.0.0.1:3000',
  });
  const [computer, setComputer] = useState(
    new Computer({
      ...config,
      seed: 'travel upgrade inside soda birth essence junk merit never twenty system opinion'
    })
  );
```


## Start the application

Clone the repo and run the following in the terminal.

````
yarn install
yarn start
````

The application is then opened in your browser. You can now create tokens and send them to each other. Remember, to run locally, change the network to 'regtest' and the url to 'http://127.0.0.1:3000'.


## Add balance to wallet

After changing to run locally, you may notice that you have a balance of 0 in your wallet. To add balance, clone the repo of [bitcoin-computer-node](https://github.com/bitcoin-computer/bitcoin-computer-node) and run the following in your terminal.

````
yarn test-ltc
yarn fund-ltc
````

Next, open ```.env``` file and add your address to ```TEST_ADDRESS```. Put it in front of the existing address, separating them by a ```;``` but no space in between.

Now, refresh the page, and you will see some balance is added to your wallet.


You can find more information in the [docs](https://bitcoin-computer.gitbook.io/docs/). Also check out the corresponding [Youtube tutorial](https://www.youtube.com/watch?v=SnTwevzmRrs).

<a href="http://www.youtube.com/watch?feature=player_embedded&v=SnTwevzmRrs
" target="_blank"><img src="http://img.youtube.com/vi/SnTwevzmRrs/0.jpg"
alt="IMAGE ALT TEXT HERE" width="300" border="10" /></a>
