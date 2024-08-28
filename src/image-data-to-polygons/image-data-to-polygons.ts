import { Polygon } from "../geojson-types.js";
import { consolidatePolygonCellsIntoCornerIndexPolygonInput } from "./consolidate-polygon-cells-into-corner-index-polygon.js";
import { convertCornerIndexPolygonIntoGeoJSONPolygon } from "./convert-corner-index-polygon-into-geojson-polygon.js";
import { segmentDataIntoPolygonCellCollection } from "./segment-data-into-polygon-cell-collection.js";

interface ConsolidateImageDataIntoPolygonsInput<TData extends Record<string, unknown>> {
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
}

interface ConsolidateImageDataIntoPolygonsOutput<TData extends Record<string, unknown>> {
  polygons: Array<Polygon<TData>>;
}

export const consolidateImageDataIntoPolygons = <TData extends Record<string, unknown>>(
  input: ConsolidateImageDataIntoPolygonsInput<TData>
): ConsolidateImageDataIntoPolygonsOutput<TData> => {
  const { imageData, bitmapWidthPx, bitmapHeightPx, colourToPropertiesMap } = input;

  const { polygonCellCollection } = segmentDataIntoPolygonCellCollection({
    imageData
  })

  const polygons: Array<Polygon<TData>> = polygonCellCollection
    .map((polygonCells) => consolidatePolygonCellsIntoCornerIndexPolygonInput({ polygonCells }))
    .filter(({ cornersForPolygon }) => cornersForPolygon.length > 0)
    .map(({ cornersForPolygon, red, blue, green }) => convertCornerIndexPolygonIntoGeoJSONPolygon({
      colourToPropertiesMap,
      cornersForPolygon,
      red,
      green,
      blue,
      bitmapWidthPx,
      bitmapHeightPx
    }).polygon)
    .filter((element): element is NonNullable<typeof element> => !!element)

  return {
    polygons
  }
}