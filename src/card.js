import './card.css';
import React from 'react';

export default ({ artwork }) => {
  const handleClick = () => {
    const publicKey = prompt("Please enter the public key of the new owner")
    if(publicKey) artwork.setOwner(publicKey)
  }

  return artwork
    ? (<li key={artwork._rev} className="card" onClick={handleClick}>
        <img src={artwork.url || artwork.imageUrl} alt={artwork.title} />
        <div className="container">
          <b>{artwork.title}</b><br />
          {artwork.artist}<br />
        </div>
      </li>)
    : <></>
}
