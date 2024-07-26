import React, { useState } from "react";
import "./Slider.scss";
function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  const changeslide = (direction) => {
    if (direction === "left") {
      imageIndex === 0
        ? setImageIndex(images.length - 1)
        : setImageIndex(imageIndex - 1);
    } else {
      imageIndex === images.length - 1
        ? setImageIndex(0)
        : setImageIndex(imageIndex + 1);
    }
  };

  return (
    <div className="slider">
      {imageIndex !== null && (
        <div className="fullslider">
          <div className="arrow">
            <i
              class="fa-solid fa-chevron-left"
              onClick={() => changeslide("left")}
            ></i>
          </div>
          <div className="imgcontainer">
            <img src={images[imageIndex]} alt="" />
          </div>
          <div className="arrow">
            <i
              class="fa-solid fa-chevron-right"
              onClick={() => changeslide("right")}
            ></i>
          </div>

          <div className="close" onClick={() => setImageIndex(null)}>
            X
          </div>
        </div>
      )}
      <div className="bgimages">
        <img src={images[0]} alt="" onClick={() => setImageIndex(0)} />
      </div>
      <div className="smallimages">
        {images.slice(1).map((image, index) => (
          <img
            src={image}
            key={index}
            onClick={() => setImageIndex(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
