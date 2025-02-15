import React from "react";

import "./index.css";

const SwitchField = ({ checked, onChange }) => (
  <label className="switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="slider"></span>
  </label>
);

export default SwitchField;