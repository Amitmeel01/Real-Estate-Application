import { useState } from "react";
import "./NewPost.scss";
import ReactQuill from 'react-quill'
import "react-quill/dist/quill.snow.css"
import axios from 'axios'
import UploadProfileImage from '../../components/uploadProfileImage/UploadProfileImage'
import { useNavigate } from "react-router-dom";
function NewPost() {

  const [value,setValue]=useState("");
  const [error,setError]=useState("");
  const [images,setimages]=useState([]);

  const navigate=useNavigate()
  
const handlesubmit=async (e)=>{
  e.preventDefault();
  setError("");
  const formData=new FormData(e.target);

  const inputs=Object.fromEntries(formData)

  try{
    const res= await axios.post(`${window.location.origin}/api/posts`,
      {
        postData:{
          title:inputs.title, 
          price:parseInt(inputs.price),
          address:inputs.address,
          city:inputs.city,
          bedroom:parseInt(inputs.bedroom),
          bathroom:parseInt(inputs.bathroom),
           latitude:inputs.latitude,
          longtitude:inputs.longtitude,
          type :inputs.type,
          property:inputs.property,
          images,
          
        },
        postDetail:{
          desc :value,
          utilities:inputs.utilities,
          income:inputs.income,
          size:parseInt(inputs.size),
          bus:parseInt(inputs.bus),
          school:parseInt(inputs.school),
        },
      },
       {
         withCredentials:true,
       
      })

      navigate("/"+res.data.id);
  }catch(err){
    console.log(err);
    setError(err.response.message)

  }

  
}

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handlesubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required/>
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} required/>    
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" required/>
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text"required />
            </div>
            <div className="item">
              <label htmlFor="longtitude">Longtitude</label>
              <input id="longtitude" name="longtitude" type="text" required/>
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="Apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" required/>
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" required/>
            </div>
            
            <button className="sendButton">Add</button>
            {error && <p style={{color:"red", textAlign:"center"}}>error</p>}
          </form>
        </div>
      </div>
      <div className="sideContainer">

{images.map((image,index)=>(
  <img src={image} key={index}/>
))}

        <UploadProfileImage uwConfig={
         { multiple:true,
          cloudName:"du6misklc",
          uploadPreset:"AmitApp",
  
          maxImageFileSize:2000000,
          foldar:"posts",
         }
          
        }
        setState={setimages}
        />
      </div>
    </div>
  );
}

export default NewPost;