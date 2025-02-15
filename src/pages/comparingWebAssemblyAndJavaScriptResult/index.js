import React from "react";
import "./index.css";

import Loading from "../../components/Loading";

const ComparingWebAssemblyAndJavaScriptResult = ({
  loading,
  adjustedWebAssemblyImage,
  adjustedJavaScriptImage,
  adjustedWebAssemblySize,
  adjustedJavaScriptSize,
  handleImageLoad,
  webAssemblyDuration,
  javaScriptDuration,
}) => (
  <>
    {
      loading && !adjustedWebAssemblyImage && !adjustedJavaScriptImage
        ? <Loading />
        : <>
          <h2>WebAssembly vs JavaScript</h2>
          <div className="comparing-webAssembly-and-javaScript-container">
            <div className="comparing-image-container">
              <h3>WebAssembly<small>({adjustedWebAssemblySize.width} x {adjustedWebAssemblySize.height})</small></h3>
              <p>Execution time: {webAssemblyDuration} ms</p>
              <img
                className="comparing-image"
                src={adjustedWebAssemblyImage}
                alt="adjustedWebAssemblyImage"
                onLoad={(e) => handleImageLoad('webAssembly', e)}
              />
            </div>
            <div className="comparing-image-container">
              <h3>JavaScript<small>({adjustedJavaScriptSize.width} x {adjustedJavaScriptSize.height})</small></h3>
              <p>Execution time: {javaScriptDuration} ms</p>
              <img
                className="comparing-image"
                src={adjustedJavaScriptImage}
                alt="adjustedJavaScriptImage"
                onLoad={(e) => handleImageLoad('javascript', e)}
              />
            </div>
          </div>
        </>
    }
  </>
);

export default ComparingWebAssemblyAndJavaScriptResult;
