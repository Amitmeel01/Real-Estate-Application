import React from 'react'
import { MapContainer,TileLayer } from 'react-leaflet'
import './Map.scss'
import 'leaflet/dist/leaflet.css'
import Pin from '../pin/Pin'


function Map({items}) {
  return (
    
        <MapContainer center={items.length===1?[items[0].latitude,items[0].longtitude]:[28.7041,77.1025]} zoom={6} scrollWheelZoom={false} className='map'>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  
 {items.map(item=>(
  <Pin key={item.id} item={item}/>
 )
  
 ) 
}

</MapContainer>
   
  )
}

export default Map