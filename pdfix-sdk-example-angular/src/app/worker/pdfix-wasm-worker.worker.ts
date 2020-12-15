/**
 * @copyright 2020 Pdfix. All Rights Reserved.
 * 
 * @fileoverview
 * A Web Worker file that loads PDFix SDK Wasm instance. Listens and
 * processes the PDFix requests.
 */

/// <reference lib="webworker" />

// PDFIX_SDK & config import
import { PDFIX_SDK_INIT, PDFIX_SDK } from './../../assets/pdfix/pdfix.js';

// Pdfix samples imports
import { pdfOpenDoc } from './import/pdfOpenDoc';
import { pdfGetPageProperties } from './import/pdfGetPageProperties';
import { pdfRenderPage } from './import/pdfRenderPage';

// Set relative path to the WASM file for Angular
PDFIX_SDK_INIT({wasmBinaryDir: 'assets/pdfix/'});

// Interfaces
import { PvPdfixRequest } from './../interfaces/pv-pdfix-request';
import { PvPdfixResponse } from './../interfaces/pv-pdfix-response';
import { PvPageRenderParams } from './../interfaces/pv-page-render-params';

/**
 * Wasm instance of opened pdf document.
 * @var {Object} pdfDoc
 */
var pdfDoc = null;

/**
 * Initializes the worker event listener and handles the requests.
 * @function addEventListener
 * @returns {void}
 */
addEventListener('message', ({ data }) => {
  let request: PvPdfixRequest = data;
  handleRequest(request);
});

/**
 * Checks if PDFix WASM is ready to use.
 * Posts current WASM status.
 * @function isWasmReady
 * @returns {void}
 */
function isWasmReady(): void {
  let wasmReady: boolean;
  if ( PDFIX_SDK !== null ) {
    wasmReady = true;
  }
  else {
    wasmReady = false;
  }
  let responseData: PvPdfixResponse = {
    type: 'isWasmReady',
    data: {
      ready: wasmReady
    }
  };
  postResponse(<PvPdfixResponse>responseData);
}

/**
 * Handles the worker requests.
 * @async @function handleRequest
 * @param {PvPdfixRequest} request
 * @returns {void}
 */
async function handleRequest(request: PvPdfixRequest) {
  let requestType: PvPdfixRequest['type'] = request.type;
  switch(requestType) {
    case 'isWasmReady': {
      isWasmReady();
      break;
    }
    case 'pdfOpenDoc': {
      let requestData: Object = request.data;
      pdfOpenDocRequest(requestData);
      break;
    }
    case 'pdfGetPageProperties': {
      pdfGetPagePropertiesRequest();
      break;
    }
    case 'pdfRenderPage': {
      let requestData: PvPageRenderParams = request.data;
      pdfRenderPageRequest(requestData);
      break;
    }
  }
}

/**
 * Opens a document using imported pdfOpenDoc.
 * Posts pdfDoc object and fileOpened status.
 * @async @function pdfOpenDoc
 * @param {Object} requestData request data
 * @returns {void}
 */
async function pdfOpenDocRequest(requestData: Object): Promise<void> {
  let pdfDocWasm = await pdfOpenDoc(PDFIX_SDK, requestData);
  pdfDoc = pdfDocWasm;
  let responseData: PvPdfixResponse = {
    type: 'pdfOpenDoc',
    data: {
      ptr: pdfDoc,
      fileOpened: true
    }
  };
  postResponse(responseData);
}

/**
 * Gets the number of pages in a document, iterates over each PdfPage from a document getting
 * pdfPage CropBox which determines the PageProperties.
 * @async @function pdfGetPagePropertiesRequest
 * @returns {void}
 */
async function pdfGetPagePropertiesRequest(): Promise<void> {
  let pageProperties = await pdfGetPageProperties(PDFIX_SDK, pdfDoc);
  let responseData: PvPdfixResponse = {
    type: 'pdfGetPageProperties',
    data: pageProperties
  };
  postResponse(responseData);
}

/**
 * Renders requested segment of the page based of renderParams.
 * @async @function pdfRenderPageRequest
 * @param {PvPageRenderParams} renderParams
 * @returns {void}
 */
async function pdfRenderPageRequest(renderParams: PvPageRenderParams): Promise<void> {
  let renderData = await pdfRenderPage(PDFIX_SDK, pdfDoc, renderParams);
  let responseData: PvPdfixResponse = {
    type: 'pdfRenderPage',
    data: renderData
  };
  postResponse(responseData);
}

/**
 * Sends "message" from this worker to master.
 * The data may be any value or JavaScript object handled by the structured clone algorithm,
 * which includes cyclical references.
 * @method postResponse
 * @param {PvPdfixResponse} responseData response data
 * @returns {void}
 */
function postResponse(responseData: PvPdfixResponse): void {
  postMessage(responseData);
}