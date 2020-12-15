/**
 * Interface for pdfDoc
 * @interface PvPdfDoc
 */
export interface PvPdfDoc {
  /** pdfDoc WASM Object pointer. */
  ptr: number;
  /** The file is already opened. */
  fileOpened: boolean;
}
