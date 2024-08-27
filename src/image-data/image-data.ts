import { BitsPerPixel } from "../bits-per-pixel.js";
import { hexStringToNumericValue } from "../hex-helpers.js";
import { parseThirtyTwoBitAlphaPlusRgbImageData } from "./thirty-two-bit-alpha-plus-rgb-image-data-parser.js";
import { parseTwentyFourBitRgbImageData } from "./twenty-four-bit-rgb-image-data-parser.js";

export interface ExtractImageDataFromHexBmpDataInput {
  hexBmpData: string,
  colourMap: Record<number, {
    red: number;
    green: number;
    blue: number;
  }>,
  bitmapWidthPx: number,
  bitmapHeightPx: number,
  headerSizeBytes: 14;
  infoHeaderSizeBytes: number;
  colourMapSizeBytes: number;
  bitsPerPixel: BitsPerPixel | 'UNKNOWN';
}

export interface ExtractImageDataFromHexBmpDataOutput {
  imageData: Array<Array<{
    red: number;
    green: number;
    blue: number;
  }>>
  allColoursPresent: Array<{
    red: number;
    green: number;
    blue: number;
  }>
}

export const extractImageDataFromHexBmpData = (input: ExtractImageDataFromHexBmpDataInput): ExtractImageDataFromHexBmpDataOutput => {
  if(input.bitsPerPixel === BitsPerPixel.TWENTY_FOUR_BIT_RGB) {
    return parseTwentyFourBitRgbImageData(input);
  }
  if(input.bitsPerPixel === BitsPerPixel.THIRTY_TWO_BIT_ALPHA_PLUS_RGB) {
    return parseThirtyTwoBitAlphaPlusRgbImageData(input);
  }

  throw new Error("The unbelivably lazy author of the library you're using to parse bmp files doesn't support the pixel format you're trying to use. Sorry!");
}