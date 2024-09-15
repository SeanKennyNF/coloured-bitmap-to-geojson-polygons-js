import { DomainBounds } from "../domain-bounds.js";
import { Feature } from "../geojson-types.js";

interface ConvertCornerIndexPolygonIntoGeoJSONFeatureInput<TData extends Record<string, unknown>> {
  colourToPropertiesMap: Record<string, TData>;
  cornersForPolygon: [number, number][];
  red: number;
  green: number;
  blue: number;
  bitmapWidthPx: number;
  bitmapHeightPx: number;
  domainBounds: DomainBounds;
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
  const { cornersForPolygon, domainBounds, colourToPropertiesMap, red, blue, green, bitmapWidthPx, bitmapHeightPx } = input;
  const { latitudeLowerBound, latitudeUpperBound, longitudeLowerBound, longitudeUpperBound } = domainBounds;

  const colourHexString = rgbToHexString({ red, green, blue }).toLowerCase();

  return {
    feature: {
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          cornersForPolygon.map(([cornerColIndex, cornerRowIndex]) => [
            longitudeLowerBound + ((cornerColIndex / bitmapWidthPx ) * (longitudeUpperBound - longitudeLowerBound)),
            latitudeUpperBound - ((cornerRowIndex / bitmapHeightPx ) * (latitudeUpperBound - latitudeLowerBound)),
          ])
        ],
      },
      properties: {
        colourHexCode: colourHexString,
        data: colourToPropertiesMap[colourHexString] ?? null
      }
    }
  }
};