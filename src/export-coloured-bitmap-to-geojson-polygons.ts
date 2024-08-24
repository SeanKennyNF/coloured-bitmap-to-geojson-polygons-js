import { readFile } from "fs/promises";
import { BmpFileMetadata, extractColourMapFromHexBmpData, extractHeaderFromHexBmpData, extractInfoHeaderFromHexBmpData } from "./bmp-file-metadata.js";
import { OutputGeoJSON } from "./geojson-types.js";
import { hexStringtoAsciiString, hexStringToNumericValue } from "./hex-helpers.js";
import { extractImageDataFromHexBmpData } from "./image-data.js";
import { determineBitmapWidthAndHeight } from "./bitmap-width-and-height.js";
import { consolidateImageDataIntoPolygons } from "./image-data-to-polygons.js";

export interface ExportColouredBitmapToGeoJSONPolygonsInput {
  inputFilePath: string;
  bitmapWidthPx?: number | undefined;
  bitmapHeightPx?: number | undefined;
}
export interface ExportColouredBitmapToGeoJSONPolygonsOutput {
  outputGeoJSON: OutputGeoJSON
  bmpFileMetadata: BmpFileMetadata
}

export const exportColouredBitmapToGeoJSONPolygons = async(
  input: ExportColouredBitmapToGeoJSONPolygonsInput
): Promise<ExportColouredBitmapToGeoJSONPolygonsOutput> => {
  const bmpData = await readFile(input.inputFilePath);

  const hexBmpData = bmpData.toString('hex');
  const { header } = extractHeaderFromHexBmpData({ hexBmpData });
  const { infoHeader } = extractInfoHeaderFromHexBmpData({ hexBmpData });
  const { colourMap, bytesUsedForColourMap } = extractColourMapFromHexBmpData({ hexBmpData, infoHeader });
  const { bitmapWidthPx, bitmapHeightPx } = determineBitmapWidthAndHeight({
    infoHeader,
    bitmapWidthPxOverride: input.bitmapWidthPx,
    bitmapHeightPxOverride: input.bitmapHeightPx,
  })
  const { imageData, allColoursPresent } = extractImageDataFromHexBmpData({
    hexBmpData,
    colourMap,
    bitmapWidthPx,
    bitmapHeightPx,
    bytesUsedForColourMap
  });
  const { polygons } = consolidateImageDataIntoPolygons({
    imageData,
    allColoursPresent
  }) 

  return {
    bmpFileMetadata: {
      header,
      infoHeader,
      colourMap
    },
    outputGeoJSON: {
      type: "MultiPolygon",
      coordinates: polygons
    }
  };
}