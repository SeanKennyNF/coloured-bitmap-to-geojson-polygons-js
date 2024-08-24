import { BitsPerPixel, hexValueToBitsPerPixel } from "./bits-per-pixel.js";
import { CompressionType, hexValueToCompressionType } from "./compression-type.js";
import { hexStringtoAsciiString, hexStringToNumericValue } from "./hex-helpers.js"

interface BmpFileMetadataHeader {
  signature: string,
  fileSizeBytes: number,
  reservedField: string,
  dataOffsetBytes: number,
}

export interface BmpFileMetadataInfoHeader {
  infoHeaderSizeBytes: number;
  bmpWidthPx: number;
  bmpHeightPx: number;
  numberOfPlanes: number;
  bitsPerPixel: BitsPerPixel | 'UNKNOWN';
  compressionType: CompressionType | 'UNKNOWN';
  imageCompressedSizeBytes: number;
  horizontalPixelsPerMetre: number;
  verticalPixelsPerMetre: number;
  numberOfColoursUsed: number;
  numberOfImportantColours: number;
}

export type BmpFileColourMap = Record<number, {
  red: number;
  green: number;
  blue: number;
}>

export interface BmpFileMetadata {
  header: BmpFileMetadataHeader;
  infoHeader: BmpFileMetadataInfoHeader;
  colourMap: BmpFileColourMap;
}

interface ExtractHeaderFromHexBmpDataInput {
  hexBmpData: string
}

interface ExtractHeaderFromHexBmpDataOutput {
  header: BmpFileMetadataHeader;
}

export const extractHeaderFromHexBmpData = (input: ExtractHeaderFromHexBmpDataInput): ExtractHeaderFromHexBmpDataOutput => ({
  header: {
    signature: hexStringtoAsciiString(input.hexBmpData.slice(0, 4)),
    fileSizeBytes: hexStringToNumericValue(input.hexBmpData.slice(4, 12)),
    reservedField: input.hexBmpData.slice(12, 20),
    dataOffsetBytes: hexStringToNumericValue(input.hexBmpData.slice(20, 28)),
  }
});

interface ExtractInfoHeaderFromHexBmpDataInput {
  hexBmpData: string
}

interface ExtractInfoHeaderFromHexBmpDataOutput {
  infoHeader: BmpFileMetadataInfoHeader;
}

export const extractInfoHeaderFromHexBmpData = (input: ExtractInfoHeaderFromHexBmpDataInput): ExtractInfoHeaderFromHexBmpDataOutput => ({
  infoHeader: {
    infoHeaderSizeBytes: hexStringToNumericValue(input.hexBmpData.slice(28, 36)),
    bmpWidthPx: hexStringToNumericValue(input.hexBmpData.slice(36, 44)),
    bmpHeightPx: hexStringToNumericValue(input.hexBmpData.slice(44, 52)),
    numberOfPlanes: hexStringToNumericValue(input.hexBmpData.slice(52, 56)),
    bitsPerPixel: hexValueToBitsPerPixel[hexStringToNumericValue(input.hexBmpData.slice(52, 56))] ?? 'UNKNOWN',
    compressionType: hexValueToCompressionType[hexStringToNumericValue(input.hexBmpData.slice(56, 64))] ?? 'UNKNOWN',
    imageCompressedSizeBytes: hexStringToNumericValue(input.hexBmpData.slice(64, 72)),
    horizontalPixelsPerMetre: hexStringToNumericValue(input.hexBmpData.slice(72, 80)),
    verticalPixelsPerMetre: hexStringToNumericValue(input.hexBmpData.slice(80, 88)),
    numberOfColoursUsed: hexStringToNumericValue(input.hexBmpData.slice(88, 96)),
    numberOfImportantColours: hexStringToNumericValue(input.hexBmpData.slice(96, 104)),
  }
})

interface ExtractColourMapFromHexBmpDataInput {
  infoHeader: Pick<BmpFileMetadataInfoHeader, 'bitsPerPixel'|'numberOfColoursUsed'>;
  hexBmpData: string
}

interface ExtractColourMapFromHexBmpDataOutput {
  colourMap: BmpFileColourMap;
  bytesUsedForColourMap: number;
}

export const extractColourMapFromHexBmpData = (input: ExtractColourMapFromHexBmpDataInput): ExtractColourMapFromHexBmpDataOutput => {
  const { bitsPerPixel, numberOfColoursUsed } = input.infoHeader;

  if(
    numberOfColoursUsed === 0 ||
    bitsPerPixel === 'UNKNOWN' ||
    bitsPerPixel === BitsPerPixel.ZERO ||
    bitsPerPixel === BitsPerPixel.EIGHT_BIT_PALLETIZED || 
    bitsPerPixel === BitsPerPixel.SIXTEEN_BIT_RGB ||
    bitsPerPixel === BitsPerPixel.TWENTY_FOUR_BIT_RGB
  ) {
    return {
      colourMap: {},
      bytesUsedForColourMap: 0
    }
  }

  const bytesUsedForColourMap = 4 * numberOfColoursUsed;
  const startIndexBytes = 104;
  const endIndexBytes = startIndexBytes + bytesUsedForColourMap;

  let currentIndex = 0;
  let currentIndexBytes = startIndexBytes;
  let colourMap: BmpFileColourMap = {}

  while(currentIndexBytes < endIndexBytes) {
    const red = hexStringToNumericValue(input.hexBmpData.slice(currentIndexBytes, currentIndexBytes + 1));
    const blue = hexStringToNumericValue(input.hexBmpData.slice(currentIndexBytes, currentIndexBytes + 2));
    const green = hexStringToNumericValue(input.hexBmpData.slice(currentIndexBytes, currentIndexBytes + 3));
    const reserved = hexStringToNumericValue(input.hexBmpData.slice(currentIndexBytes, currentIndexBytes + 4));

    colourMap = {
      ...colourMap,
      [currentIndex]: {
        red,
        blue,
        green
      }
    }

    currentIndex += 1;
    currentIndexBytes += 4;
  }

  return {
    colourMap,
    bytesUsedForColourMap
  }
}