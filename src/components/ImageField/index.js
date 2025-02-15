import React from "react";
import "./index.css";

const ImageField = ({ title, imageWidth, imgeHeight, image, imgeAlt, onLoad }) => (
  <>
    <h2>{title} <small>({imageWidth} x {imgeHeight})</small></h2>
    <div className="image-container">
      <img src={image} alt={imgeAlt} onLoad={onLoad} />
    </div>
  </>
);

export default ImageField;