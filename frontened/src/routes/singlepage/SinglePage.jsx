
import React, { useContext, useState } from "react";
import "./SinglePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { Link, redirect, useLoaderData, useNavigate } from "react-router-dom";
import domPurify from 'dompurify';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);

  const navigate=useNavigate();

  const handlesave = async () => {
    setSaved((prev) => !prev);

    if (!currentUser) {
      return redirect('/login');
    }

    if (!post.id) {
      console.error("Invalid post ID");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/user/save",
        { postId: post.id },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const editPost=async()=>{

    

    if (!currentUser) {
      return redirect('/login');
    }

    if (!post.id) {
      console.error("Invalid post ID");
      return;
    }

    
    try {
      await axios.put(
        `http://localhost:8080/api/posts/${post.id}`,
        { postId: post.id },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  }



  const deletePost = async () => {
    console.log(currentUser.id)
    if (!currentUser) {
      return navigate('/login');
    }

    if (!post.id) {
      console.error("Invalid post ID");
      return;
    }

    console.log(post.id);
    try {
      await axios.delete(
        `http://localhost:8080/api/posts/${post.id}`,
        { withCredentials: true }
      );
      navigate('/list');
    } catch (err) {
      console.log(err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      } else if (err.request) {
        console.error('Request:', err.request);
      } else {
        console.error('Error message:', err.message);
      }
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>{post.address}</span>
                </div>
                <div className="price">${post.price}</div>
              </div>

              {currentUser && currentUser.id === post.userId &&
               (<div className="btn">
                <Link to={`/edit/${post.id}`}>
                <button onClick={editPost} style={{ backgroundColor: "green" }}>Edit</button>
                </Link>
                <button style={{ backgroundColor: "red" }} onClick={deletePost}>Delete</button>
              </div>)}
              <div className="user">
                <img src={post.user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s"} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div className="bottom" dangerouslySetInnerHTML={{ __html: domPurify.sanitize(post.postDetail.desc) }}></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <i className="fa-solid fa-bolt"></i>
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? <p>Tenant is Responsible</p> : <p></p>}
              </div>
            </div>

            <div className="feature">
              <i className="fa-solid fa-money-bill"></i>
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <i className="fa-solid fa-bed"></i>
              <span>{post.bedroom} bed</span>
            </div>
            <div className="size">
              <i className="fa-solid fa-bath"></i>
              <span>{post.bathroom} bathroom</span>
            </div>
          </div> 
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <i className="fa-solid fa-school"></i>
              <div className="featureText">
                <span>School</span>
                <p>{post.postDetail.school > 999 ? post.postDetail.school / 1000 + "km" : post.postDetail.school + "m"} away</p>
              </div>
            </div>

            <div className="feature">
              <i className="fa-solid fa-bus"></i>
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus > 999 ? post.postDetail.bus / 1000 + "km" : post.postDetail.bus + "m"} away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>

          <div className="buttons">
            <button>
              <i className="fa-solid fa-message"></i>
              Send a Message
            </button>
            <button onClick={handlesave} style={{ backgroundColor: saved ? "orange" : "white" }}>
              <i className="fa-regular fa-bookmark"></i>
              {saved ? "Place saved" : "Save the place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
