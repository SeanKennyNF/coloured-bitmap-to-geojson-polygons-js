import { hexStringToNumericValue } from "../hex-helpers.js";
import { ExtractImageDataFromHexBmpDataInput, ExtractImageDataFromHexBmpDataOutput } from "./image-data.js";

type ParseTwentyFourBitRgbImageDataInput = Omit<ExtractImageDataFromHexBmpDataInput, 'bitsPerPixel'>;
type ParseTwentyFourBitRgbImageDataOutput = ExtractImageDataFromHexBmpDataOutput;

export const parseTwentyFourBitRgbImageData = (input: ParseTwentyFourBitRgbImageDataInput): ParseTwentyFourBitRgbImageDataOutput => {
  const startIndexInHexBmpData = (input.headerSizeBytes + input.infoHeaderSizeBytes + input.colourMapSizeBytes) * 2;
  const endIndexInHexBmpData = input.hexBmpData.length;

  let imageData: ExtractImageDataFromHexBmpDataOutput['imageData']  = [];

  let currentIndexInHexBmpData = startIndexInHexBmpData;
  let currentRowIndex = 0;
  let currentColumnIndex = 0;

  while (currentRowIndex < input.bitmapHeightPx) {
    let currentRow: ExtractImageDataFromHexBmpDataOutput['imageData'][number] = [];
    let bytesReadInCurrentRow = 0;

    while(currentColumnIndex < input.bitmapWidthPx) {
      if(currentIndexInHexBmpData >= endIndexInHexBmpData) {
        currentRow.push({
          red: 0,
          green: 0,
          blue: 0,
        })
      } else {
        const currentCellBlue = hexStringToNumericValue(input.hexBmpData.slice(currentIndexInHexBmpData, currentIndexInHexBmpData + 2));
        const currentCellGreen = hexStringToNumericValue(input.hexBmpData.slice(currentIndexInHexBmpData + 2, currentIndexInHexBmpData + 4));
        const currentCellRed = hexStringToNumericValue(input.hexBmpData.slice(currentIndexInHexBmpData + 4, currentIndexInHexBmpData + 6));

        currentRow.push({
          red: currentCellRed,
          green: currentCellGreen,
          blue: currentCellBlue,
        })
        currentIndexInHexBmpData += 6;
        bytesReadInCurrentRow += 6;
      }
      
      currentColumnIndex++;
    }

    imageData.unshift(currentRow);

    if(bytesReadInCurrentRow % 4 !== 0) {
      currentIndexInHexBmpData += (4 - (bytesReadInCurrentRow % 4));
    }

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