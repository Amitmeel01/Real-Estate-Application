import React, { useContext } from 'react'
import HomePage from '../HomePage/HomePage'
import Navbar from '../../components/navbar/Navbar'
import { Navigate, Outlet } from 'react-router-dom'
import './Layout.scss'
import { AuthContext } from '../../context/AuthContext'

export function Layout() {
  return (
     <div className="layout">
        <div className="navbar">
          <Navbar/>
          </div>
          <div className="content">
          <Outlet/>
          </div>
      </div>
  )
}


 export function RequireAuth() {

  const {currentUser}=useContext(AuthContext);

    if(!currentUser){
      return <Navigate to='/login'/>
    }

  return (

    currentUser && (
     <div className="layout">
        <div className="navbar">
          <Navbar/>
          </div>
          <div className="content">
          <Outlet/>
          </div>
      </div>
    )
  )
}

// export  {Layout,RequireAuth}