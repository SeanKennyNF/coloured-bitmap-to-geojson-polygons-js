import { readFile } from "fs/promises";
import { BmpFileMetadata, extractColourMapFromHexBmpData, extractHeaderFromHexBmpData, extractInfoHeaderFromHexBmpData } from "./bmp-file-metadata.js";
import { OutputGeoJSON } from "./geojson-types.js";
import { hexStringtoAsciiString, hexStringToNumericValue } from "./hex-helpers.js";
import { extractImageDataFromHexBmpData } from "./image-data.js";
import { consolidateImageDataIntoPolygons } from "./image-data-to-polygons/image-data-to-polygons.js";

export interface ExportColouredBitmapToGeoJSONPolygonsInput<TData extends Record<string, unknown>> {
  inputFilePath: string;
  colourToPropertiesMap: Record<string, TData>;
}
export interface ExportColouredBitmapToGeoJSONPolygonsOutput<TData extends Record<string, unknown>> {
  outputGeoJSON: OutputGeoJSON<TData>
  bmpFileMetadata: BmpFileMetadata
}

export const exportColouredBitmapToGeoJSONPolygons = async<TData extends Record<string, unknown>>(
  input: ExportColouredBitmapToGeoJSONPolygonsInput<TData>
): Promise<ExportColouredBitmapToGeoJSONPolygonsOutput<TData>> => {
  const bmpData = await readFile(input.inputFilePath);

  const hexBmpData = bmpData.toString('hex');
  const { header } = extractHeaderFromHexBmpData({ hexBmpData });
  const { infoHeader } = extractInfoHeaderFromHexBmpData({ hexBmpData });
  const { colourMap, bytesUsedForColourMap } = extractColourMapFromHexBmpData({ hexBmpData, infoHeader });
  const { imageData, allColoursPresent } = extractImageDataFromHexBmpData({
    hexBmpData,
    colourMap,
    bitmapWidthPx: infoHeader.bmpWidthPx,
    bitmapHeightPx: infoHeader.bmpHeightPx,
    bytesUsedForColourMap
  });
  const { polygons } = consolidateImageDataIntoPolygons({
    imageData,
    bitmapWidthPx: infoHeader.bmpWidthPx,
    bitmapHeightPx: infoHeader.bmpHeightPx,
    allColoursPresent,
    colourToPropertiesMap: input.colourToPropertiesMap
  }) 

  return {
    bmpFileMetadata: {
      header,
      infoHeader,
      colourMap
    },
    outputGeoJSON: {
      type: 'GeometryCollection',
      geometries: polygons
    }
  };
}