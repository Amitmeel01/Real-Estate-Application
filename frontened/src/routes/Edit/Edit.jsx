import React, { useState } from "react";
import "./Edit.scss";
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import axios from 'axios';
import UploadProfileImage from '../../components/uploadProfileImage/UploadProfileImage';
import { useLoaderData, useNavigate } from "react-router-dom";

function Edit() {
  const post = useLoaderData();
  const navigate = useNavigate();

  const [value, setValue] = useState(post.postDetail.desc || ""); // Initialize with post's description if it exists
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData(e.target);
      const inputs = Object.fromEntries(formData);

      const res = await axios.put(`${window.location.origin}/api/posts/${post.id}`, {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          latitude: inputs.latitude,
          longtitude: inputs.longtitude,
          type: inputs.type,
          property: inputs.property,
          images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          income: inputs.income,
          size: parseInt(inputs.size),
          bus: parseInt(inputs.bus),
          school: parseInt(inputs.school),
        },
      }, {
        withCredentials: true,
      });

      navigate("/list");
    } catch (err) {
      console.error(err);
      setError(err.response.message || "An error occurred");
    }
  };

  const handleChange = (content, delta, source, editor) => {
    setValue(content);
  };

  return (
    <div className="EditPage">
      <div className="formContainer">
        <h1>Edit Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" defaultValue={post.title} required  />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" required defaultValue={post.price} />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required defaultValue={post.address} />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill
                theme="snow"
                onChange={handleChange}
                value={value}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required defaultValue={post.city} />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" required defaultValue={post.bedroom} />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" required defaultValue={post.bathroom} />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" required defaultValue={post.latitude} />
            </div>
            <div className="item">
              <label htmlFor="longtitude">longtitude</label>
              <input id="longtitude" name="longtitude" type="text" required defaultValue={post.longtitude} />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type" defaultValue={post.type}>
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select name="property" defaultValue={post.property}>
                <option value="Apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" defaultValue={post.utilities}>
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input id="income" name="income" type="text" placeholder="Income Policy" required defaultValue={post.postDetail.income} />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" required defaultValue={post.postDetail.size} />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" required defaultValue={post.postDetail.school} />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus</label>
              <input min={0} id="bus" name="bus" type="number" required defaultValue={post.postDetail.bus} />
            </div>
            <button className="sendButton">Update</button>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt={`Uploaded ${index}`} />
        ))}
        <UploadProfileImage
          uwConfig={{
            multiple: true,
            cloudName: "du6misklc",
            uploadPreset: "AmitApp",
            maxImageFileSize: 2000000,
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default Edit;
