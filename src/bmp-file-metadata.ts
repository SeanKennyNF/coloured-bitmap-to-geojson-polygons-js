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
  headerSizeBytes: 14;
}

export const extractHeaderFromHexBmpData = (input: ExtractHeaderFromHexBmpDataInput): ExtractHeaderFromHexBmpDataOutput => ({
  header: {
    signature: hexStringtoAsciiString(input.hexBmpData.slice(0, 4)),
    fileSizeBytes: hexStringToNumericValue(input.hexBmpData.slice(4, 12)),
    reservedField: input.hexBmpData.slice(12, 20),
    dataOffsetBytes: hexStringToNumericValue(input.hexBmpData.slice(20, 28)),
  },
  headerSizeBytes: 14
});

interface ExtractInfoHeaderFromHexBmpDataInput {
  hexBmpData: string;
  headerSizeBytes: 14;
}

interface ExtractInfoHeaderFromHexBmpDataOutput {
  infoHeader: BmpFileMetadataInfoHeader;
  infoHeaderSizeBytes: number;
}

export const extractInfoHeaderFromHexBmpData = (input: ExtractInfoHeaderFromHexBmpDataInput): ExtractInfoHeaderFromHexBmpDataOutput => {
  const startIndex = input.headerSizeBytes * 2;
  const infoHeaderSizeBytes = hexStringToNumericValue(input.hexBmpData.slice(startIndex, startIndex + 8));

  return {
    infoHeader: {
      infoHeaderSizeBytes,
      bmpWidthPx: hexStringToNumericValue(input.hexBmpData.slice(startIndex + 8, startIndex + 16)),
      bmpHeightPx: hexStringToNumericValue(input.hexBmpData.slice(startIndex + 16, startIndex + 24)),
      numberOfPlanes: hexStringToNumericValue(input.hexBmpData.slice(startIndex + 24, startIndex + 28)),
      bitsPerPixel: hexValueToBitsPerPixel[hexStringToNumericValue(input.hexBmpData.slice(startIndex + 28, startIndex + 32))] ?? 'UNKNOWN',
      compressionType: hexValueToCompressionType[hexStringToNumericValue(input.hexBmpData.slice(startIndex + 32, startIndex + 40))] ?? 'UNKNOWN',
      imageCompressedSizeBytes: hexStringToNumericValue(input.hexBmpData.slice(startIndex + 40, startIndex + 48)),
      horizontalPixelsPerMetre: hexStringToNumericValue(input.hexBmpData.slice(startIndex + 48, startIndex + 56)),
      verticalPixelsPerMetre: hexStringToNumericValue(input.hexBmpData.slice(startIndex + 56, startIndex + 64)),
      numberOfColoursUsed: hexStringToNumericValue(input.hexBmpData.slice(startIndex + 64, startIndex + 72)),
      numberOfImportantColours: hexStringToNumericValue(input.hexBmpData.slice(startIndex + 72, startIndex + 80)),
    },
    infoHeaderSizeBytes
  }
}

interface ExtractColourMapFromHexBmpDataInput {
  infoHeader: Pick<BmpFileMetadataInfoHeader, 'bitsPerPixel'|'numberOfColoursUsed'>;
  infoHeaderSizeBytes: number;
  headerSizeBytes: 14;
  hexBmpData: string
}

interface ExtractColourMapFromHexBmpDataOutput {
  colourMap: BmpFileColourMap;
  colourMapSizeBytes: number;
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
      colourMapSizeBytes: 0
    }
  }

  const colourMapSizeBytes = 4 * numberOfColoursUsed;
  const startIndexInHexBmpData = (input.infoHeaderSizeBytes + input.headerSizeBytes) * 2;
  const endIndexInHexBmpData = startIndexInHexBmpData + colourMapSizeBytes;

  let currentIndex = 0;
  let currentIndexInHexBmpData = startIndexInHexBmpData;
  let colourMap: BmpFileColourMap = {}

  while(currentIndexInHexBmpData < endIndexInHexBmpData) {
    const red = hexStringToNumericValue(input.hexBmpData.slice(currentIndexInHexBmpData, currentIndexInHexBmpData + 1));
    const blue = hexStringToNumericValue(input.hexBmpData.slice(currentIndexInHexBmpData, currentIndexInHexBmpData + 2));
    const green = hexStringToNumericValue(input.hexBmpData.slice(currentIndexInHexBmpData, currentIndexInHexBmpData + 3));
    const reserved = hexStringToNumericValue(input.hexBmpData.slice(currentIndexInHexBmpData, currentIndexInHexBmpData + 4));

    colourMap = {
      ...colourMap,
      [currentIndex]: {
        red,
        blue,
        green
      }
    }

    currentIndex += 1;
    currentIndexInHexBmpData += 4;
  }

  return {
    colourMap,
    colourMapSizeBytes
  }
}