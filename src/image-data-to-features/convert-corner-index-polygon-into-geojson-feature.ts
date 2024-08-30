import { Feature } from "../geojson-types.js";

interface ConvertCornerIndexPolygonIntoGeoJSONFeatureInput<TData extends Record<string, unknown>> {
  colourToPropertiesMap: Record<string, TData>;
  cornersForPolygon: [number, number][];
  red: number;
  green: number;
  blue: number;
  bitmapWidthPx: number;
  bitmapHeightPx: number;
}

interface ConvertCornerIndexPolygonIntoGeoJSONFeatureOutput<TData extends Record<string, unknown>> {
  feature: Feature<TData>
}

const rgbToHexString = (input: { red: number, green: number, blue: number }): string => `#${
  input.red.toString(16).padStart(2, '0')
}${
  input.green.toString(16).padStart(2, '0')
}${
  input.blue.toString(16).padStart(2, '0')
}`


export const convertCornerIndexPolygonIntoGeoJSONFeature = <TData extends Record<string, unknown>>(
  input: ConvertCornerIndexPolygonIntoGeoJSONFeatureInput<TData>
): ConvertCornerIndexPolygonIntoGeoJSONFeatureOutput<TData> => {
  const colourHexString = rgbToHexString({
    red: input.red,
    green: input.green,
    blue: input.blue
  }).toLowerCase();

  return {
    feature: {
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          input.cornersForPolygon.map(([cornerColIndex, cornerRowIndex]) => [
            -180 + ((cornerColIndex / input.bitmapWidthPx ) * 360),
            90 - ((cornerRowIndex / input.bitmapHeightPx ) * 180),
          ])
        ],
      },
      properties: {
        colourHexCode: colourHexString,
        data: input.colourToPropertiesMap[colourHexString] ?? null
      }
    }
  }
};