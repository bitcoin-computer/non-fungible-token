import './card.css';
import React from 'react';

export default ({ artwork }) => {
  const handleClick = async () => {
    const publicKey = prompt('Please enter the public key of the new user')
    await artwork.setOwner(publicKey)
    console.log(`updated owner ${artwork.title} of to ${artwork._owners[0]}`)
  }

  return artwork
    ? (<div className="card" onClick={handleClick}>
        <img src={artwork.url} alt={artwork.title} />
        <div className="container">
          <b>{artwork.title}</b><br />
          {artwork.artist}<br />
          {artwork.year}
        </div>
      </div>)
    : <div></div>
}
