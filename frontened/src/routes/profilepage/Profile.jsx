import React, { useContext,Suspense} from 'react'
import './Profile.scss'
import List from '../../components/list/List'
import Chat from '../../components/chat/Chat'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import {AuthContext} from '../../context/AuthContext'
import { Link,useLoaderData, Await } from "react-router-dom";

function Profile() {

    const data=useLoaderData()

const {currentUser,updateUser}=useContext(AuthContext)


const navigate=useNavigate();




const handleLogout=async ()=>{
    try{
 await axios.post('http://localhost:8080/api/auth/logout');
 
 updateUser(null); 

 navigate('/');  

    }catch(err){
        console.log(err)
    }
}

if (!currentUser) {
    return <Navigate to='/login'/>; // or redirect to login
  }
  return (
    <div className='profilePage'>
   <div className="details">
    <div className="wrapper">
        <div className="title">
            <h1>user Information</h1>

            <Link to='/profile/update'className='create'>
            <button >Update profile</button></Link>
        </div> 
        <div className="info">
            <span>
                Avatar: <img src={currentUser.avatar ||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s"} alt="" /></span>

                <span>
                    username : <b>{currentUser.username}</b>
                </span>

                <span>
                    Email : <b>{currentUser.email}</b>
                </span>

                <button onClick={handleLogout}>LogOut </button>
        </div>
        <div className="title">
            <h1>My List</h1>

            <Link to='/addPost' className='create'>
            <button >Create New Post</button>
            </Link>
        </div>

        <Suspense fallback={<p>Loading posts...</p>}>
            <Await resolve={data.postResponse}>
              {(postResponse) => (
                 <List posts={postResponse.data.userPosts}/>
              )}
            </Await>
          </Suspense>

       <div className="title">
        <h1>Saved List</h1>
        </div>
        <Suspense fallback={<p>Loading posts...</p>}>
            <Await resolve={data.postResponse}>
              {(postResponse) => (
                 <List posts={postResponse.data.savedPosts}/>
              )}
            </Await>
          </Suspense>
       
       
    </div>
   </div>
   <div className="chatContainer">
   <div className="wrapper">
   <Suspense fallback={<p>Loading posts...</p>}>
            <Await resolve={data.chatResponse}>
              {(chatResponse) => (
                  <Chat chats={chatResponse.data}/>
              )}
            </Await>
          </Suspense>
   
   </div>
    </div>
    </div>
  )
}

export default Profile