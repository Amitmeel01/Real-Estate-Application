import React from 'react'
import './Card.scss'
import { Link } from 'react-router-dom'

function Card({item}) {
  return (
    <div className='card'>
      <Link to={`/${item.id}`} className='imageContainer'>
      <img src={item.images[0]} alt="" />
      
      </Link>
 <div className="textContainer">
  <h2 className='title'>
    <Link to={`/${item.id}`}>{item.title}</Link>
  </h2>

  <p className='address'>
  <i class="fa-solid fa-location-dot"></i>
<span>{item.address}</span>
  </p>

  <p className='price'>
    ${item.price}
  </p>

<div className="bottom">
  <div className="features">
    <div className="feature">
    <i class="fa-solid fa-bed"></i>
      <span>{item.bedroom} bedroom</span>
    </div>

    <div className="feature">
    <i class="fa-solid fa-person-booth"></i>
      <span>{item.bathroom} bathroom</span>
    </div>
  </div>

  <div className="icons">
    <div className="icon">
    <i class="fa-regular fa-bookmark"></i>
    </div>
    <div className="icon">
    <i class="fa-regular fa-message"></i>
    </div>
  </div>
</div>
 </div>
    </div>
  )
}

export default Card