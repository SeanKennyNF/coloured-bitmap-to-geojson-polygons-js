import { readFile } from "fs/promises";
import { BmpFileMetadata, extractColourMapFromHexBmpData, extractHeaderFromHexBmpData, extractInfoHeaderFromHexBmpData } from "./bmp-file-metadata.js";
import { OutputGeoJSON } from "./geojson-types.js";
import { extractImageDataFromHexBmpData } from "./image-data/image-data.js";
import { consolidateImageDataIntoFeatures } from "./image-data-to-features/image-data-to-features.js";
import { DomainBounds } from "./domain-bounds.js";

export interface ExportColouredBitmapToGeoJSONPolygonsInput<TData extends Record<string, unknown>> {
  inputFilePath: string;
  colourToPropertiesMap: Record<string, TData>;
  domainBounds?: DomainBounds | undefined;
}
export interface ExportColouredBitmapToGeoJSONPolygonsOutput<TData extends Record<string, unknown>> {
  outputGeoJSON: OutputGeoJSON<TData>
  bmpFileMetadata: BmpFileMetadata
}

export const exportColouredBitmapToGeoJSONPolygons = async<TData extends Record<string, unknown>>(
  input: ExportColouredBitmapToGeoJSONPolygonsInput<TData>
): Promise<ExportColouredBitmapToGeoJSONPolygonsOutput<TData>> => {
  const bmpData = await readFile(input.inputFilePath);

  const domainBounds: DomainBounds = input.domainBounds ?? {
    latitudeLowerBound: -90,
    latitudeUpperBound: 90,
    longitudeLowerBound: -180,
    longitudeUpperBound: 180
  }

  const hexBmpData = bmpData.toString('hex');
  const { header, headerSizeBytes } = extractHeaderFromHexBmpData({ hexBmpData });
  const { infoHeader, infoHeaderSizeBytes } = extractInfoHeaderFromHexBmpData({ hexBmpData, headerSizeBytes });
  const { colourMap, colourMapSizeBytes } = extractColourMapFromHexBmpData({
    hexBmpData,
    infoHeader,
    headerSizeBytes,
    infoHeaderSizeBytes
  });
  const { imageData, allColoursPresent } = extractImageDataFromHexBmpData({
    hexBmpData,
    colourMap,
    bitmapWidthPx: infoHeader.bmpWidthPx,
    bitmapHeightPx: infoHeader.bmpHeightPx,
    bitsPerPixel: infoHeader.bitsPerPixel,
    headerSizeBytes,
    infoHeaderSizeBytes,
    colourMapSizeBytes
  });
  const { features } = consolidateImageDataIntoFeatures({
    imageData,
    bitmapWidthPx: infoHeader.bmpWidthPx,
    bitmapHeightPx: infoHeader.bmpHeightPx,
    allColoursPresent,
    colourToPropertiesMap: input.colourToPropertiesMap,
    domainBounds
  }) 

  return {
    bmpFileMetadata: {
      header,
      infoHeader,
      colourMap
    },
    outputGeoJSON: {
      type: 'FeatureCollection',
      features
    }
  };
}