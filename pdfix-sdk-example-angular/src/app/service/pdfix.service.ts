/**
 * @copyright 2020 Pdfix. All Rights Reserved.
 * 
 * @fileoverview
 * Sample PDFix service.
 * Creates a Web Worker where PDFix SDK Wasm is loaded and communicates with this
 * Worker sending and handling the sample requests.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { PvPdfixResponse } from './../interfaces/pv-pdfix-response';
import { PvPdfDoc } from './../interfaces/pv-pdf-doc';
import { PvPageProperties } from './../interfaces/pv-page-properties';
import { PvPageRenderResponseData } from './../interfaces/pv-page-render-response-data';

@Injectable({
  providedIn: 'root'
})
export class PdfixService {

  constructor(
    private httpClient: HttpClient
  ) {
    this.initService();
  }

  /**
   * The PDFix source type. Either 'wasmLocal' created in this service or
   * 'server' in case of the server back-end. This can be for example Node.js,
   * PHP or other environment based server built with the PDFix SDK.
   * @member {string} pdfixSourceType 'server' | 'wasmLocal'
   */
  pdfixSourceType: string = 'wasmLocal';
  /**
   * The PDFix server URL in case the pdfixSourceType is set to 'server'.
   * @member {string} pdfixServerUrl
   */
  pdfixServerUrl?: string = 'localhost:3000';
  /**
   * An instance of a Web Worker.
   * Web Workers are a simple means for web content to run scripts in background threads.
   * The worker thread can perform tasks without interfering with the user interface.
   * @member {Worker} worker
   */
  worker: Worker;
  /**
   * A rxjs subject which emits current value/status of this service class.
   * If true, the PDFix Service is ready to use.
   * @member {BehaviorSubject<boolean>} ready
   */
  ready = new BehaviorSubject<boolean>(false);
  /**
   * A rxjs subject which emits current fileOpened status and it´s WASM instance pointer.
   * @member {BehaviorSubject<PvPdfDoc>} pdfDoc
   */
  pdfDoc = new BehaviorSubject<PvPdfDoc>(null);
  /**
   * Document pages properties as width, height, rotation.
   * @member {BehaviorSubject<PvPageProperties>} pdfDocPageProperties
   */
  pdfDocPageProperties = new BehaviorSubject<PvPageProperties>(null);
  /**
   * Sample data of the page that was rendered.
   * @member {BehaviorSubject<PvPageRenderResponseData>} pdfDocRenderPageData
   */
  pdfDocRenderPageData = new BehaviorSubject<PvPageRenderResponseData>(null);
  /**
   * An instance of setInterval() method used to check the local PDFix Wasm status.
   * @member {any} wasmCheckInterval
   */
  wasmCheckInterval: any;

  /**
   * Initializes the service and the communication type with the PDFix SDK back-end.
   * @method initService
   * @returns {void}
   */
  initService(): void {
    if ( this.pdfixSourceType == 'server' ) {
      this.ready.next(true);
    }
    if ( this.pdfixSourceType == 'wasmLocal' ) {
      this.initWasmWebWorker();
      this.isWasmWorkerReady('start');
    }
  }

  /**
   * Uses setInterval() method to send request to check if local PDFix Wasm
   * is ready in the Worker.
   * @method isWasmWorkerReady
   * @param {string} q query type: 'start' | 'stop'
   * @returns {void}
   */
  isWasmWorkerReady(q: string): void {
    if ( q == 'start' ) {
      this.wasmCheckInterval = setInterval(() => {
        this.request( 'isWasmReady' ); 
      }, 500);
    }
    else if ( q == 'stop' )
      clearInterval(this.wasmCheckInterval);
  }

  /**
   * Initializes the Web Worker.
   * @method initWasmWebWorker
   * @returns {void} 
   */
  initWasmWebWorker(): void {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        'src/app/worker/pdfix-wasm-worker.worker',
        { name: 'pdfixWasm', type: 'module' }
      );
      this.worker.onmessage = ({ data }) => {
        this.handleResponse(data);
      };
    }
    else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      console.warn('Web Workers are not supported in this environment.');
    }
  }

  /**
   * Sends a request to the Worker or server back-end.
   * @method request
   * @param {PvPdfixRequest['type']} requestType
   * @param {PvPdfixRequest['data']} requestData
   * @returns {void}
   */
  request( requestType: any, requestData?: any ): void {
    let request: Object = {
      type: requestType,
      data: requestData
    };
    if ( this.pdfixSourceType == 'wasmLocal' ) {
      this.worker.postMessage(request);
    }
    else if ( this.pdfixSourceType == 'server' ) {
      this.httpClient.post<any>(this.pdfixServerUrl, request).subscribe(response => {
        this.handleResponse(response);
      });
    }
  }

  /**
   * Handles responses from the Worker or server.
   * @method handleResponse
   * @param {PvPdfixResponse} response the response data
   * @returns {void}
   */
  handleResponse( response: PvPdfixResponse ): void {
    let responseType: string = response.type;
    switch(responseType) {
      case 'isWasmReady': {
        let responseData: any = response.data;
        let result: boolean = responseData.ready;
        if ( result == true ) {
          this.isWasmWorkerReady('stop');
          if ( this.ready.getValue() != true ) {
            this.ready.next(result);
          }
        }
        break;
      }
      case 'pdfOpenDoc': {
        let responseData: PvPdfDoc = response.data;
        this.pdfDoc.next({
          ptr: responseData.ptr,
          fileOpened: responseData.fileOpened
        });
        break;
      }
      case 'pdfGetPageProperties': {
        let responseData: PvPageProperties = response.data;
        this.pdfDocPageProperties.next(responseData);
      }
      case 'pdfRenderPage': {
        let responseData: PvPageRenderResponseData = response.data;
        this.pdfDocRenderPageData.next(responseData);
        break;
      }
    }
  }

}