import { DomainBounds } from "../domain-bounds.js";
import { Feature } from "../geojson-types.js";
import { consolidatePolygonCellsIntoCornerIndexPolygonInput } from "./consolidate-polygon-cells-into-corner-index-polygon.js";
import { convertCornerIndexPolygonIntoGeoJSONFeature } from "./convert-corner-index-polygon-into-geojson-feature.js";
import { segmentDataIntoPolygonCellCollection } from "./segment-data-into-polygon-cell-collection.js";

interface ConsolidateImageDataIntoFeaturesInput<TData extends Record<string, unknown>> {
  colourToPropertiesMap: Record<string, TData>;
  imageData: Array<Array<{
    red: number;
    green: number;
    blue: number;
  }>>;
  allColoursPresent: Array<{
    red: number;
    green: number;
    blue: number;
  }>;
  bitmapWidthPx: number;
  bitmapHeightPx: number;
  domainBounds: DomainBounds;
}

interface ConsolidateImageDataIntoFeaturesOutput<TData extends Record<string, unknown>> {
  features: Array<Feature<TData>>;
}

export const consolidateImageDataIntoFeatures = <TData extends Record<string, unknown>>(
  input: ConsolidateImageDataIntoFeaturesInput<TData>
): ConsolidateImageDataIntoFeaturesOutput<TData> => {
  const { imageData, bitmapWidthPx, bitmapHeightPx, colourToPropertiesMap, domainBounds } = input;

  const { polygonCellCollection } = segmentDataIntoPolygonCellCollection({
    imageData
  })

  const features: Array<Feature<TData>> = polygonCellCollection
    .map((polygonCells) => consolidatePolygonCellsIntoCornerIndexPolygonInput({ polygonCells }))
    .filter(({ cornersForPolygon }) => cornersForPolygon.length > 0)
    .map(({ cornersForPolygon, red, blue, green }) => convertCornerIndexPolygonIntoGeoJSONFeature({
      colourToPropertiesMap,
      cornersForPolygon,
      red,
      green,
      blue,
      bitmapWidthPx,
      bitmapHeightPx,
      domainBounds
    }).feature)
    .filter((element): element is NonNullable<typeof element> => !!element)

  return {
    features
  }
}