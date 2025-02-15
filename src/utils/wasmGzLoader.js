import pako from "pako";
async function loadWasmGz(fileName) {
  const go = new window.Go()
  const wasmResponse = await fetch(`wasm/${fileName}.wasm.gz`);
  const wasmBytes = await wasmResponse.arrayBuffer();
  const decompressedData = await pako.inflate(new Uint8Array(wasmBytes)).buffer;

  const wasmModule = await WebAssembly.instantiate( decompressedData, go.importObject);

  go.run(wasmModule.instance);

  return window;
}

export default loadWasmGz;
