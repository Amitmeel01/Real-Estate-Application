import React, { useContext, useState } from 'react'
import './LoginPage.scss'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext';

function LoginPage() {

  const [error,setError]=useState("");
  const [isLoading,setisLoading]=useState(false);

  const {updateUser}=useContext(AuthContext)
  const navigate= useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setisLoading(true);
    setError("")
         const formData=new FormData(e.target);

         const username=formData.get("username");
         const password=formData.get("password");

         try{
          const res= await axios.post("http://localhost:8080/api/auth/login",
           { username,password},
            {
              withCredentials:true,
            
           })

           updateUser(res.data)
          
           navigate('/')
         }catch(err){
          console.log(err)
          setError(err.response.data.message);
         }finally{
          setisLoading(false)
         }

         

  }

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" type="text" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
         <button disabled={isLoading}>Login</button>
          
          {error && <p className="error" style={{color:"red", textAlign:"center"}}>{error}</p>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  )
}

export default LoginPage