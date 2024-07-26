import React from 'react'
import './Pin.scss'
import {Marker,Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'

function Pin({item}) {
  return (
    <Marker position={[item.latitude
      ,item.longtitude]}>
    <Popup>
      <div className="popupContainer">
        <img src={item.img} />

        <div className='textContainer'>
       <Link to={`/${item.id}`} className='data'>
        {item.title}
       
       <span className='bed'>{item.beds}</span>
       <b>${item.price}</b>
       </Link>
        </div>
      </div>
    </Popup>
  </Marker>
  )
}

export default Pin