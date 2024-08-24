export type Coordinate = [number, number];
export type PolygonCoordinateSet = Array<Array<Coordinate>>;

export interface OutputGeoJSON {
  type: "MultiPolygon",
  coordinates: Array<PolygonCoordinateSet>;
}
