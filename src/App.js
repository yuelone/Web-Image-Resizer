import React, { useState } from "react";
import "./App.css";

import WebAssemblyResult from "./pages/webAssemblyResult";
import ComparingWebAssemblyAndJavaScriptResult from "./pages/comparingWebAssemblyAndJavaScriptResult";

import SwitchField from "./components/SwitchField";
import ButtonField from "./components/ButtonField";
import InputField from "./components/InputField";
import ImageField from "./components/ImageField";

import originalImage from "./assests/originalImage.png"

import loadWasmGz from "./utils/wasmGzLoader";

const App = () => {
  const [loading, setLoading] = useState(null);

  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 });
  const [adjustedWebAssemblySize, setAdjustedWebAssemblySize] = useState({ width: 0, height: 0 });
  const [adjustedJavaScriptSize, setAdjustedJavaScriptSize] = useState({ width: 0, height: 0 });

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [switchState, setSwitchState] = useState(false);

  const [adjustedWebAssemblyImage, setAdjustedWebAssemblyImage] = useState(null)
  const [adjustedJavaScriptImage, setAdjustedJavaScriptImage] = useState(null)

  const [webAssemblyDuration, setWebAssemblyDuration] = useState(null);
  const [javaScriptDuration, setJavaScriptDuration] = useState(null);

  const imageSizeSetters = {
    original: setOriginalImageSize,
    webAssembly: setAdjustedWebAssemblySize,
    javascript: setAdjustedJavaScriptSize,
  };

  function resetState() {
    setLoading(null);
    setAdjustedWebAssemblySize({ width: 0, height: 0 });
    setAdjustedJavaScriptSize({ width: 0, height: 0 });
    setWidth("");
    setHeight("");
    setAdjustedWebAssemblyImage(null);
    setAdjustedJavaScriptImage(null);
  }

  function handleSwitchChange(e) {
    resetState();
    setSwitchState(e.target.checked);
  }

  const handleImageLoad = (type, e) => {
    const size = { width: e.target.naturalWidth, height: e.target.naturalHeight };
    imageSizeSetters[type]?.(size);
  };

  async function handleJavaScriptResizer(srcImgBytes, targetWidth, targetHeight) {
    const blob = new Blob([srcImgBytes], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);

    const image = new Image();
    image.src = url;

    await new Promise((resolve, reject) => {
      image.onload = () => {
        resolve();
        URL.revokeObjectURL(url);
      };
      image.onerror = reject;
    });

    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        } else {
          reject(new Error("Canvas toBlob failed"));
        }
      }, "image/jpeg");
    });
  }

  async function handleWebAssemblyResizer(srcImgBytes) {
    try {
      const wasmModule = await loadWasmGz("main");
      const resizedImage = await wasmModule.Resize(Number(width), Number(height), srcImgBytes);
      if (!resizedImage || resizedImage.length === 0) {
        throw new Error("The image data returned by WASM is invalid");
      }

      const binaryString = Array.from(resizedImage)
        .map((byte) => String.fromCharCode(byte))
        .join("");
      const base64String = btoa(binaryString);

      return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      console.error("Image processing failed:", error);
      throw error;
    }
  }

  async function handleSubmit() {
    if (!width || !height || width <= 0 || height <= 0) {
      alert("Please enter valid width and height!");
      return;
    }

    try {
      setLoading(true);
      setAdjustedWebAssemblyImage(null);
      setAdjustedJavaScriptImage(null);

      const response = await fetch(originalImage);
      if (!response.ok) throw new Error("Image loading failed");
      const arrayBuffer = await response.arrayBuffer();
      const srcImgBytes = new Uint8Array(arrayBuffer);

      if (switchState) {
        const startWasm = performance.now();
        const resizedWebAssemblyImage = await handleWebAssemblyResizer(srcImgBytes);
        const endWasm = performance.now();
        const wasmDuration = endWasm - startWasm;
        setWebAssemblyDuration(wasmDuration.toFixed(2));
        setAdjustedWebAssemblyImage(resizedWebAssemblyImage);

        const startJs = performance.now();
        const resizedJavaScriptImage = await handleJavaScriptResizer(srcImgBytes, Number(width), Number(height));
        const endJs = performance.now();
        const jsDuration = endJs - startJs;
        setJavaScriptDuration(jsDuration.toFixed(2));
        setAdjustedJavaScriptImage(resizedJavaScriptImage);
      } else {
        const resizedWebAssemblyImage = await handleWebAssemblyResizer(srcImgBytes);
        setAdjustedWebAssemblyImage(resizedWebAssemblyImage);
      }
    } catch (error) {
      console.error("Image processing failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main-container">
      <div className="container" style={{ background: "#7d7580" }}>
        <div className="title-container">
          <h1>Image Resizer ({switchState ? "WebAssembly vs JavaScript" : "WebAssembly"})</h1>
          <SwitchField
            checked={switchState}
            onChange={(e) => handleSwitchChange(e)}
          />
        </div>

        <div className="form-container">
          <InputField
            text="Width"
            type="number"
            placeholder="please enter width..."
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
          <InputField
            text="Height"
            type="number"
            placeholder="please enter height..."
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <ButtonField
            text={switchState ? "Compare" : "Resize"}
            onClick={handleSubmit}
          />
        </div>
        <ImageField
          title="Original Image"
          imageWidth={originalImageSize.width}
          imgeHeight={originalImageSize.height}
          image={originalImage}
          imgeAlt="originalImage"
          onLoad={(e) => handleImageLoad('original', e)}
        />
      </div>
      {loading !== null && (
        <div className="container" style={{ background: "#ada1b2" }}>
          {switchState ? (
            <ComparingWebAssemblyAndJavaScriptResult
              loading={loading}
              adjustedWebAssemblyImage={adjustedWebAssemblyImage}
              adjustedJavaScriptImage={adjustedJavaScriptImage}
              adjustedWebAssemblySize={adjustedWebAssemblySize}
              adjustedJavaScriptSize={adjustedJavaScriptSize}
              handleImageLoad={handleImageLoad}
              webAssemblyDuration={webAssemblyDuration}
              javaScriptDuration={javaScriptDuration}
            />
          ) : (
            <WebAssemblyResult
              loading={loading}
              adjustedWebAssemblyImage={adjustedWebAssemblyImage}
              adjustedWebAssemblySize={adjustedWebAssemblySize}
              handleImageLoad={handleImageLoad}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
