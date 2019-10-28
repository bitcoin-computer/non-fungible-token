import React, { useState, useEffect } from 'react';
import Computer from 'bitcoin-computer'
import logo from './logo.svg';
import './App.css';

function App() {
  const [computer] = useState(new Computer({ seed: 'emotion drill fun purpose visit voyage office ancient inform chunk tuition hope'}))
  const [balance, setBalance] = useState(0)

  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [year, setYear] = useState('')
  const [url, setUrl] = useState('')

  useEffect(async () => {
    setBalance(await computer.db.wallet.getBalance())
  }, [computer.db.wallet])

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    const response = await fetch(process.env.PUBLIC_URL + '/artwork.js')
    const Artwork = await response.text()
    const artwork = await computer.new(Artwork, [title, artist, year, url])
    console.log('created artwork', artwork)
  }

  return (
    <div className="App">
      <h2>Wallet</h2>
      <b>Address</b>&nbsp;{computer.db.wallet.getAddress().toString()}<br />
      <b>Balance</b>&nbsp;{balance}

      <h2>Create new Artwork</h2>
      <form onSubmit={handleSubmit}>
        Title<br />
        <input type="string" value={title} onChange={e => setTitle(e.target.value)} />

        Artist<br />
        <input type="string" value={artist} onChange={e => setArtist(e.target.value)} />

        Year<br />
        <input type="string" value={year} onChange={e => setYear(e.target.value)} />

        Url<br />
        <input type="string" value={url} onChange={e => setUrl(e.target.value)} />

        <button type="submit" value="Send Bitcoin">Create Artwork</button>
      </form>
    </div>
  );
}

export default App;
