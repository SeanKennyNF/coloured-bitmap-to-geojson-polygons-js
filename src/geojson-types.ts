export type Coordinate = [number, number];

export interface Feature<TData extends Record<string, unknown>> {
  type: "Feature";
  geometry: {
    type: "Polygon"
    coordinates: Array<Array<Coordinate>>;
  },
  properties: {
    colourHexCode: string;
    data: TData | null;
  }
}

export interface OutputGeoJSON<TData extends Record<string, unknown>> {
  type: "FeatureCollection";
  features: Array<Feature<TData>>;
}
