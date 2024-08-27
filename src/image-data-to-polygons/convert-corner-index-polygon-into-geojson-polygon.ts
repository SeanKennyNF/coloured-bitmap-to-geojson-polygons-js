import { Polygon } from "../geojson-types";

interface ConvertCornerIndexPolygonIntoGeoJSONPolygonInput<TData extends Record<string, unknown>> {
  colourToPropertiesMap: Record<string, TData>;
  cornersForPolygon: [number, number][];
  red: number;
  green: number;
  blue: number;
  bitmapWidthPx: number;
  bitmapHeightPx: number;
}

interface ConvertCornerIndexPolygonIntoGeoJSONPolygonOutput<TData extends Record<string, unknown>> {
  polygon: Polygon<TData>
}

const rgbToHexString = (input: { red: number, green: number, blue: number }): string => `#${
  input.red.toString(16).padStart(2, '0')
}${
  input.green.toString(16).padStart(2, '0')
}${
  input.blue.toString(16).padStart(2, '0')
}`


export const convertCornerIndexPolygonIntoGeoJSONPolygon = <TData extends Record<string, unknown>>(
  input: ConvertCornerIndexPolygonIntoGeoJSONPolygonInput<TData>
): ConvertCornerIndexPolygonIntoGeoJSONPolygonOutput<TData> => {
  const colourHexString = rgbToHexString({
    red: input.red,
    green: input.green,
    blue: input.blue
  }).toLowerCase();

  return {
    polygon: {
      type: "Polygon" as const,
      coordinates: [
        input.cornersForPolygon.map(([cornerColIndex, cornerRowIndex]) => [
          -180 + ((cornerColIndex / input.bitmapWidthPx ) * 360),
          90 - ((cornerRowIndex / input.bitmapHeightPx ) * 180),
        ])
      ],
      properties: {
        colourHexCode: colourHexString,
        data: input.colourToPropertiesMap[colourHexString] ?? null
      }
    }
  }
};