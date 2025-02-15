import React from 'react';
import './index.css';

const ButtonField = ({ onClick, text }) => (
  <button className="btn" onClick={onClick}>
    {text}
  </button>
);

export default ButtonField