async function loadWasm(fileName) {
  const go = new window.Go()
  const wasmResponse = await fetch(`wasm/${fileName}.wasm`);
  const wasmBytes = await wasmResponse.arrayBuffer();
  const wasmModule = await WebAssembly.instantiate(wasmBytes, go.importObject);

  go.run(wasmModule.instance);

  return window;
}

export default loadWasm;
