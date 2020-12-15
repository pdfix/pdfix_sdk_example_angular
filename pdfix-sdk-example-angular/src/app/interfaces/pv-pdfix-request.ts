/**
 * Interface for requests on PdfixService and PdfixWasmWebWorker
 * @interface PvPdfixRequest
 */
export interface PvPdfixRequest {
  /** A type (name) of the request. */
  type: string;
  /** Request data to be processed. */
  data?: any;
}
