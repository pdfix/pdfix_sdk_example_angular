/**
 * Interface for rendered page data response
 * @interface PvPageRenderResponseData
 */
export interface PvPageRenderResponseData {
  /** Document page number. */
  page: number;
  /** ID of the particular render segment. */
  segmentId: number;
  /** Zoom factor or the rendered segment. */
  zoomFactor: number;
  /** Rotation the rendered segment. */
  rotation: number;
  /** Image format. 0 for PNG, 1 for JPG. */
  format: number;
  /** Base64 encoded image data of the segment. */
  base64: string;
}
