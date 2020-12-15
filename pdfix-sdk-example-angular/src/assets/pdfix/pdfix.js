import PDFIX_WASM from './pdfix_wasm.js';

export async function PDFIX_SDK_INIT( config ) {

  PDFIX_WASM({
    locateFile: path => {
      if (config.wasmBinaryDir){
        return config.wasmBinaryDir + path;
      }
      return path;
    }
  }).then(function (wasm) {

    PDFIX_SDK = wasm;
    PDFIX_SDK.GetPdfix = function() {
      return wasm.wrapPointer(wasm._GetPdfix(), wasm.Pdfix);
    }
    PDFIX_SDK.GetPdfToHtml = function() {
      return wasm.wrapPointer(wasm._GetPdfToHtml(), wasm.PdfToHtml);
    }
    //var f = instance.Pdfix.prototype.GetPdfix();

    PDFIX_SDK.allocArray = function (typedArray) {
      var numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
      var ptr = wasm._malloc(numBytes);
      var heapBytes = new Uint8Array(wasm.HEAPU8.buffer, ptr, numBytes);
      heapBytes.set(new Uint8Array(typedArray.buffer));
      return [heapBytes.byteOffset, typedArray.length];
    };

    PDFIX_SDK.allocString = function(string){
      const bufSize = wasm.lengthBytesUTF32(string);
      var buffer = wasm._malloc(bufSize + 4);
      wasm.stringToUTF32(string, buffer, bufSize + 4);
      return [buffer, string.length];
    }

    console.log("PDFix WASM loaded...");
  });
}

export var PDFIX_SDK = null;
