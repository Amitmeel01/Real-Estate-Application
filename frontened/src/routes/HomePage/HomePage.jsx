import React, { useContext } from 'react'
import './HomePage.scss'
import SearchBar from '../../components/searchBar/SearchBar'
import { AuthContext } from '../../context/AuthContext'

function HomePage() {

    const {currentUser}=useContext(AuthContext); 

    console.log(currentUser)
  return (
    <div className='homepage'>
        <div className="textContainer">
            <div className="wrapper">
            <h1 className='title'>
            Luxury Homes from Manhattan to Monaco, Experience the World's Most Desired Real Estate</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque voluptate quod, voluptatem harum asperiores eos ipsum, aliquam nobis dolore, eum qui veniam cum perspiciatis dolorem repudiandae! Consectetur quisquam laudantium aspernatur!</p>

            <SearchBar/>

            <div className="boxes">
                <div className="box">
                    <h1>10+</h1>
                    <h2>Years Of Experince</h2>
                </div>
                <div className="box">
                    <h1>200+</h1>
                    <h2>Awards</h2>
                </div>
                <div className="box">
                    <h1>2000+</h1>
                    <h2>Property Ready</h2>
                </div>
            </div>
            </div>
        <div className="imgcontainer">
            <img src="/image/homesection.jpg" alt="" />
        </div>
    </div>
    </div>
  )
}

export default HomePage