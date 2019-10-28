import './card.css';
import React from 'react';

export default ({ artwork }) => {
  return artwork
    ? (<div className="card">
        <img src={artwork.url} alt={artwork.title} />
        <div className="container">
          <b>{artwork.title}</b><br />
          {artwork.artist}<br />
          {artwork.year}
        </div>
      </div>)
    : <div></div>
}
