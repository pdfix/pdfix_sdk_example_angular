/**
 * Interface for responses to PdfixService
 * @interface PvPdfixResponse
 */
export interface PvPdfixResponse {
  /** A type (name) of the response. */
  type: string;
  /** Response data. */
  data?: any;
}
