/**
 * Interface for pdfRenderPage render parameters
 * @interface PvPageRenderParams
 */
export interface PvPageRenderParams {
  /** Id of the parcitular render segment of the page. */
  segmentId: number,
  /** Document page number - pages are zero-based. */
  page: number;
  /** Zoom factor to be used for rendering, with 1.0 meaning 100%. */
  zoom: number;
  /** Rotation of 0 | 90 | 180 | 270 to be used for rendering. */
  rotation: number;
  /** For JPEG format specifies compression level othervise ignored. */
  quality: number;
  /** Image format. 0 for PNG, 1 for JPG. */
  format: number;
  /** Width of the segment to be rendered. */
  width: number;
  /** Height of the segment to be rendered. */
  height: number;
  /** Top position of the segment to be rendered. */
  top: number;
  /** Left position of the segment to be rendered. */
  left: number;
}
