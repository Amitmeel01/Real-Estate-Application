import { useContext, useState } from "react";
import axios from 'axios'
import { AuthContext } from "../../context/AuthContext";
import './ProfileUpdate.scss'
import {useNavigate } from "react-router-dom";
import UploadProfileImage from "../../components/uploadProfileImage/UploadProfileImage";


function ProfileUpdate() {

const {currentUser,updateUser}=useContext(AuthContext)
const [error,setError]=useState("");
const navigate=useNavigate();
const [avatar,setAvatar]=useState([])

const handlesubmit=async (e)=>{
e.preventDefault()
setError("")

const formData=new FormData(e.target);

const {username,email,password}=Object.fromEntries(formData)

try{
  const res= await axios.put(`${window.location.origin}/api/user/${currentUser.id}`,
    { username,
      password,
      email,
      avatar:avatar[0],

    },
     {
       withCredentials:true,
     
    })

    updateUser(res.data);
    // console.log(res.data)
    navigate('/profile')

}catch(err){
  console.log(err);
  setError(err.response.data.message)
}


}

  return (
    <div className="ProfileUpdate">
      <div className="formContainer">
        <form onSubmit={handlesubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button type="submit">Update</button>
          {error && <p>{error}</p>}
        </form>
      </div> 
      <div className="sideContainer">
        <img src={avatar[0] || currentUser.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s"} alt="" className="avatar" />

        <UploadProfileImage uwConfig={{
          cloudName:"du6misklc",
          uploadPreset:"AmitApp",
          multiple:false,
          maxImageFileSize:2000000,
          foldar:"avatars",

        }}
        setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdate;