import React from "react";
import "./index.css";

const InputField = ({ text, type, placeholder, onChange, value }) => (
  <>
    <label>{text}</label>
    <input type={type} placeholder={placeholder} onChange={onChange} value={value} />
  </>
);

export default InputField;