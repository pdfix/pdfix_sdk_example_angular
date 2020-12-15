/**
 * Interface for page properties
 * @interface PvPageProperties
 */
export interface PvPageProperties {
  [pageNumber: number]: {
    /** Right cropBox of the page. */
    width: number;
    /** Top cropBox of the page. */
    height: number;
    /** Rotation of the page. */
    rotation: number;
  }
}
