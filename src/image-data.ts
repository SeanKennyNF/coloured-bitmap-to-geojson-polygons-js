interface ExtractImageDataFromHexBmpDataInput {
  hexBmpData: string,
  colourMap: Record<number, {
    red: number;
    green: number;
    blue: number;
  }>,
  bitmapWidthPx: number,
  bitmapHeightPx: number,
  bytesUsedForColourMap: number
}

interface ExtractImageDataFromHexBmpDataOutput {
  imageData: Array<{
    red: number;
    green: number;
    blue: number;
  }>
  allColoursPresent: Array<{
    red: number;
    green: number;
    blue: number;
  }>
}

export const extractImageDataFromHexBmpData = (input: ExtractImageDataFromHexBmpDataInput): ExtractImageDataFromHexBmpDataOutput => {
  return {
    imageData: [],
    allColoursPresent: []
  }
}