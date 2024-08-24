export type Coordinate = [number, number];

export interface Polygon<TData extends Record<string, unknown>> {
  type: "Polygon";
  coordinates: Array<Array<Coordinate>>;
  properties: {
    colourHexCode: string;
    data: TData | null;
  }
}

export interface OutputGeoJSON<TData extends Record<string, unknown>> {
  type: "GeometryCollection";
  geometries: Array<Polygon<TData>>;
}
