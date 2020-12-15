/**
 * @copyright 2020 Pdfix. All Rights Reserved.
 * 
 * @fileoverview
 * Sample App Component.
 * Uses pdfix.service to process requests on the PDFix SDK Wasm
 * and subscribes to the responses from the back-end.
 * Basically demonstrates page rendering of the sample PDF document
 * with the PDFix SDK Wasm.
 */

import { Component, OnInit } from '@angular/core';
import { PdfixService } from './service/pdfix.service';
import { PvPdfDoc } from './interfaces/pv-pdf-doc';
import { PvPageProperties } from './interfaces/pv-page-properties';
import { PvPageRenderParams } from './interfaces/pv-page-render-params';
import { PvPageRenderResponseData } from './interfaces/pv-page-render-response-data';
import { PvRenderedPageDivProps } from './interfaces/pv-rendered-page-div-props';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor( private pdfixService: PdfixService ) { }

  /**
   * The Angular app title.
   * @member {string} title
   */
  title = 'pdfix-sdk-example-angular';
  /**
   * Relative path to the sample PDF file.
   * @member {string} sampleFile
   */
  sampleFile: string = './../assets/pdf/test.pdf';
  /**
   * The component is ready to send render page requests to the pdfix.service.
   * @member {boolean} ready
   */
  ready: boolean = false;
  /**
   * A sample page is being currently rendered.
   * @member {boolean} isRendering
   */
  isRendering: boolean = false;
  /**
   * Document pages properties as width, height, rotation.
   * @member {PvPageProperties} pdfPageProperties
   */
  pdfPageProperties: PvPageProperties = null;
  /**
   * Sample rendered page div properties.
   * @member {PvRenderedPageDivProps} pdfRenderedPageDivProperties
   */
  pdfRenderedPageDivProperties: PvRenderedPageDivProps = {
    width: null,
    height: null,
    base64: null
  };

  /**
   * Sends a request to render a particular sample document page.
   * @method renderPage
   * @param {number} pageNumber
   * @returns {void}
   */
  renderPage(pageNumber: number): void {
    let renderParams: PvPageRenderParams = {
      segmentId: 0,
      page: pageNumber,
      zoom: 1,
      rotation: 0,
      quality: 80,
      format: 0,
      width: this.pdfPageProperties[pageNumber].width,
      height: this.pdfPageProperties[pageNumber].height,
      top: 0,
      left: 0
    };
    this.isRendering = true;
    this.pdfixService.request( 'pdfRenderPage', renderParams );
  }

  /**
   * Sends a request to get the page properties of the sample document.
   * @method pdfGetPageProperties
   * @returns {void}
   */
  pdfGetPageProperties(): void {
    this.pdfixService.request( 'pdfGetPageProperties' );
  }

  /**
   * Sends a request to open the sample document.
   * @method pdfOpenDocRequest
   * @returns {void}
   */
  pdfOpenDocRequest(): void {
    let filePath: string = this.sampleFile;
    let requestData: Object = {
      type: 'psMakeXhrRequest',
      file: filePath
    };
    this.pdfixService.request( 'pdfOpenDoc', requestData );
  }

  /**
   * Subscribes to if Wasm is ready to use in the pdfix.service.
   * @method subscribeToPdfixWasmReady
   * @returns {void}
   */
  subscribeToPdfixWasmReady(): void {
    this.pdfixService.ready.subscribe((ready: boolean) => {
      if ( ready ) {
        this.pdfOpenDocRequest();
      }
    });
  }

  /**
   * Subscribes to if the sample document is opened and used.
   * @method subscribeToPdfOpenDoc
   * @returns {void}
   */
  subscribeToPdfOpenDoc(): void {
    this.pdfixService.pdfDoc.subscribe((pdfDoc: PvPdfDoc) => {
      if ( pdfDoc != null ) {
        if ( pdfDoc['fileOpened'] ) {
          this.pdfGetPageProperties();
          this.ready = true;
        }
      }
    });
  }

  /**
   * Subscribes to the document page properties response update.
   * @method subscribeToPdfPageProperties
   * @returns {void}
   */
  subscribeToPdfPageProperties(): void {
    this.pdfixService.pdfDocPageProperties.subscribe((data: PvPageProperties) => {
      if ( data != null ) {
        this.pdfPageProperties = data;
        this.renderPage(1);
      }
    });
  }

  /**
   * Subscribes to the document rendered page data update.
   * @method subscribeToPdfRenderData
   * @returns {void}
   */
  subscribeToPdfRenderData(): void {
    this.pdfixService.pdfDocRenderPageData.subscribe((data: PvPageRenderResponseData) => {
      if ( data != null ) {
        if ( data.base64 != undefined ) {
          let renderedPageNumber: number = data.page;
          this.pdfRenderedPageDivProperties.width = this.pdfPageProperties[renderedPageNumber].width;
          this.pdfRenderedPageDivProperties.height = this.pdfPageProperties[renderedPageNumber].height;
          this.pdfRenderedPageDivProperties.base64 = 'data:image/png;base64,' + data.base64;
          this.isRendering = false;
        }
      }
    });
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound
   * properties of a directive
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.subscribeToPdfixWasmReady();
    this.subscribeToPdfOpenDoc();
    this.subscribeToPdfPageProperties();
    this.subscribeToPdfRenderData();
  }

}
