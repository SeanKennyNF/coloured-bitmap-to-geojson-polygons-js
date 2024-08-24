import { BmpFileMetadataInfoHeader } from "./bmp-file-metadata";

interface DetermineBitmapWidthAndHeightInput {
  infoHeader: Pick<BmpFileMetadataInfoHeader, 'bmpWidthPx'|'bmpHeightPx'>;
  bitmapWidthPxOverride: number | undefined;
  bitmapHeightPxOverride: number | undefined;
}

interface DetermineBitmapWidthAndHeightOutput {
  bitmapWidthPx: number;
  bitmapHeightPx: number;
}

export const determineBitmapWidthAndHeight = (input: DetermineBitmapWidthAndHeightInput): DetermineBitmapWidthAndHeightOutput => {
  const bitmapWidthPx = input.bitmapWidthPxOverride ?? input.infoHeader.bmpWidthPx;
  const bitmapHeightPx = input.bitmapHeightPxOverride ?? input.infoHeader.bmpHeightPx;

  if(bitmapHeightPx === 0) {
    throw new Error('Unable to parse a bitmap whose height is not present in the file. Please specify bitmapHeightPx when calling exportColouredBitmapToGeoJSONPolygons to fix this problem.');
  }

  if(bitmapWidthPx === 0) {
    throw new Error('Unable to parse a bitmap whose width is not present in the file. Please specify bitmapWidthPx when calling exportColouredBitmapToGeoJSONPolygons to fix this problem.');
  }

  return {
    bitmapWidthPx,
    bitmapHeightPx
  }
}