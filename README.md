# Web Image Resizer - WebAssembly + React

## Introduction

This is an image resizing tool written in Go, packaged as a WebAssembly (WASM) module, and integrated into the frontend using React. Users can upload images and adjust their size, with all processing logic executed on the client side in the browser.

One interesting aspect of this project is the performance comparison between WebAssembly (WASM) and JavaScript. Although WASM is generally expected to offer performance improvements for computationally intensive tasks, our testing has shown that JavaScript outperforms WASM in this specific case. This could be due to various factors, such as the overhead involved in compiling Go to WASM or the nature of the image resizing task itself. As a result, the JavaScript implementation provides faster processing times for image resizing in this project.


## Tech Stack

- **Go**: Handles the image resizing logic and is compiled into a WASM module.
- **React**: Used to build the frontend interface and call the WASM module for image processing.
- **WebAssembly(WASM)**: Compiles the Go code into a browser-executable format.
- **HTML5 Canvas**: Used to display and manipulate images.

## Demo

You can explore a live demo of the Web Image Resizer Clone at the following link:

- [Web Image Resizer Demo](https://web-image-resizer.vercel.app/)

Features:

- Choose desired image dimensions
- Real-time display of resized images
- All image processing operations are done client-side, no server support needed
- Compare the performance of JavaScript vs. WebAssembly

## Installation & Running

```bash
# Install dependencies
yarn install

# Start the development server
yarn run start
```
