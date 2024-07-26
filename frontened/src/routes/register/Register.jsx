import { useState } from "react";
import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Register() {
  const [error, setError] = useState("");
  const [isLoading,setisLoading]=useState(false);
  const navigate=useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission behavior
    setisLoading(true)
    setError("")
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await axios.post(`${window.location.origin}/api/auth/register`, {
        username,
        email,
        password
      }, {
        withCredentials: true // Ensure cookies are sent
      });

      navigate('/login')
    } catch (err) {
      console.error(err);
      setError(err.response.data.message); // Update state to show the error message
    }finally{
      setisLoading(false)
     }
  }

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button type="submit" disabled={isLoading}>Register</button>
          {error && <p className="error" style={{color:"red", textAlign:"center"}}>{error}</p>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZoU7ZGbW6fTctBWoHOttVn2JdyRI2hcLVeQ&s" alt="" />
      </div>
    </div>
  );
}

export default Register;
