import { hexStringToNumericValue } from "../hex-helpers.js";
import { ExtractImageDataFromHexBmpDataInput, ExtractImageDataFromHexBmpDataOutput } from "./image-data";

type ParseThirtyTwoBitAlphaPlusRgbImageDataInput = Omit<ExtractImageDataFromHexBmpDataInput, 'bitsPerPixel'>;
type ParseThirtyTwoBitAlphaPlusRgbImageDataOutput = ExtractImageDataFromHexBmpDataOutput;

export const parseThirtyTwoBitAlphaPlusRgbImageData = (input: ParseThirtyTwoBitAlphaPlusRgbImageDataInput): ParseThirtyTwoBitAlphaPlusRgbImageDataOutput => {
  const startIndexInHexBmpData = (input.headerSizeBytes + input.infoHeaderSizeBytes + input.colourMapSizeBytes) * 2;
  const endIndexInHexBmpData = input.hexBmpData.length;

  let imageData: ExtractImageDataFromHexBmpDataOutput['imageData']  = [];

  let currentIndexInHexBmpData = startIndexInHexBmpData;
  let currentRowIndex = 0;
  let currentColumnIndex = 0;

  while (currentRowIndex < input.bitmapHeightPx) {
    let currentRow: ExtractImageDataFromHexBmpDataOutput['imageData'][number] = [];

    while(currentColumnIndex < input.bitmapWidthPx) {
      if(currentIndexInHexBmpData >= endIndexInHexBmpData) {
        currentRow.push({
          red: 0,
          green: 0,
          blue: 0,
        })
      } else {
        const currentCellAlpha = hexStringToNumericValue(input.hexBmpData.slice(currentIndexInHexBmpData, currentIndexInHexBmpData + 2));
        const currentCellBlue = hexStringToNumericValue(input.hexBmpData.slice(currentIndexInHexBmpData + 2, currentIndexInHexBmpData + 4));
        const currentCellGreen = hexStringToNumericValue(input.hexBmpData.slice(currentIndexInHexBmpData + 4, currentIndexInHexBmpData + 6));
        const currentCellRed = hexStringToNumericValue(input.hexBmpData.slice(currentIndexInHexBmpData + 6, currentIndexInHexBmpData + 8));

        currentRow.push({
          red: currentCellRed,
          green: currentCellGreen,
          blue: currentCellBlue,
        })
        currentIndexInHexBmpData += 8;
      }
      
      currentColumnIndex++;
    }

    imageData.unshift(currentRow);

    currentColumnIndex = 0;
    currentRowIndex++;
  }

  return {
    imageData,
    allColoursPresent: imageData
      .flatMap((imageDataRow) => imageDataRow)
      .sort((colourA, colourB) => {
        if(colourA.red !== colourB.red) { return colourA.red - colourB.red };
        if(colourA.blue !== colourB.blue) { return colourA.blue - colourB.blue };
        if(colourA.green !== colourB.green) { return colourA.green - colourB.green };
        return 0;
      })
      .filter((currentElement, indexOfCurrentElement, originalArray) => {
        if(indexOfCurrentElement === 0) {
          return true;
        }
        const previousElement = originalArray[indexOfCurrentElement - 1];

        if(
          previousElement.red === currentElement.red
          && previousElement.blue === currentElement.blue
          && previousElement.green === currentElement.green
        ) {
          return false;
        }

        return true;
      })
  }
}