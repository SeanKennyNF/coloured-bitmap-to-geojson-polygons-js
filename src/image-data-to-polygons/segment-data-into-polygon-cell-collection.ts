interface SegmentDataIntoPolygonCellCollectionInput {
  imageData: Array<Array<{
    red: number;
    green: number;
    blue: number;
  }>>;
}

interface SegmentDataIntoPolygonCellCollectionOutput {
  polygonCellCollection: Array<Array<{
    red: number;
    green: number;
    blue: number;
    rowIndex: number;
    colIndex: number;
  }>>;
}

interface EnqueueCellIfAppropriateInput {
  imageDataWithProcessedFlag: Array<Array<{
    red: number;
    green: number;
    blue: number;
    processedFlag: boolean;
  }>>;
  currentCell: {
    red: number;
    green: number;
    blue: number;
    rowIndex: number;
    colIndex: number;
    processedFlag: boolean;
  };
  cellProcessingQueue: Array<{
    red: number;
    green: number;
    blue: number;
    rowIndex: number;
    colIndex: number;
    processedFlag: boolean;
  }>;
  totalRowCount: number;
  totalColCount: number;
}

export const enqueueCellToTheLeftIfAppropriateInput = (input: EnqueueCellIfAppropriateInput): void => {
  const { imageDataWithProcessedFlag, currentCell, cellProcessingQueue } = input;

  if(currentCell.colIndex === 0) {
    return;
  }

  const cellToTheLeft = imageDataWithProcessedFlag[currentCell.rowIndex][currentCell.colIndex - 1];

  if(
    cellToTheLeft.processedFlag
    || cellToTheLeft.red !== currentCell.red
    || cellToTheLeft.green !== currentCell.green
    || cellToTheLeft.blue !== currentCell.blue
  ) {
    return;
  }

  cellProcessingQueue.push({
    red: cellToTheLeft.red,
    green: cellToTheLeft.green,
    blue: cellToTheLeft.blue,
    rowIndex: currentCell.rowIndex,
    colIndex: currentCell.colIndex - 1,
    processedFlag: cellToTheLeft.processedFlag
  });
}

export const enqueueCellToTheRightIfAppropriateInput = (input: EnqueueCellIfAppropriateInput): void => {
  const { imageDataWithProcessedFlag, currentCell, cellProcessingQueue, totalColCount } = input;

  if(currentCell.colIndex === (totalColCount - 1)) {
    return;
  }

  const cellToTheRight = imageDataWithProcessedFlag[currentCell.rowIndex][currentCell.colIndex + 1];

  if(
    cellToTheRight.processedFlag
    || cellToTheRight.red !== currentCell.red
    || cellToTheRight.green !== currentCell.green
    || cellToTheRight.blue !== currentCell.blue
  ) {
    return;
  }

  cellProcessingQueue.push({
    red: cellToTheRight.red,
    green: cellToTheRight.green,
    blue: cellToTheRight.blue,
    rowIndex: currentCell.rowIndex,
    colIndex: currentCell.colIndex + 1,
    processedFlag: cellToTheRight.processedFlag
  });
}

export const enqueueCellAboveIfAppropriateInput = (input: EnqueueCellIfAppropriateInput): void => {
  const { imageDataWithProcessedFlag, currentCell, cellProcessingQueue } = input;

  if(currentCell.rowIndex === 0) {
    return;
  }

  const cellAbove = imageDataWithProcessedFlag[currentCell.rowIndex - 1][currentCell.colIndex];

  if(
    cellAbove.processedFlag
    || cellAbove.red !== currentCell.red
    || cellAbove.green !== currentCell.green
    || cellAbove.blue !== currentCell.blue
  ) {
    return;
  }

  cellProcessingQueue.push({
    red: cellAbove.red,
    green: cellAbove.green,
    blue: cellAbove.blue,
    rowIndex: currentCell.rowIndex - 1,
    colIndex: currentCell.colIndex,
    processedFlag: cellAbove.processedFlag
  });
}

export const enqueueCellBelowIfAppropriateInput = (input: EnqueueCellIfAppropriateInput): void => {
  const { imageDataWithProcessedFlag, currentCell, cellProcessingQueue, totalRowCount } = input;

  if(currentCell.rowIndex === (totalRowCount - 1)) {
    return;
  }

  const cellBelow = imageDataWithProcessedFlag[currentCell.rowIndex + 1][currentCell.colIndex];

  if(
    cellBelow.processedFlag
    || cellBelow.red !== currentCell.red
    || cellBelow.green !== currentCell.green
    || cellBelow.blue !== currentCell.blue
  ) {
    return;
  }

  cellProcessingQueue.push({
    red: cellBelow.red,
    green: cellBelow.green,
    blue: cellBelow.blue,
    rowIndex: currentCell.rowIndex + 1,
    colIndex: currentCell.colIndex,
    processedFlag: cellBelow.processedFlag
  });
}

export const segmentDataIntoPolygonCellCollection = (
  input: SegmentDataIntoPolygonCellCollectionInput
): SegmentDataIntoPolygonCellCollectionOutput => {
  const imageDataWithProcessedFlag = input.imageData
    .map((row) => row
      .map((cell) => ({ red: cell.red, green: cell.green, blue: cell.blue, processedFlag: false }))
    )

  if(imageDataWithProcessedFlag.length === 0) {
    return { polygonCellCollection: [] };
  }

  const totalRowCount = imageDataWithProcessedFlag.length;
  const totalColCount = imageDataWithProcessedFlag[0].length;
  
  let currentRowIndex = 0;
  let currentColIndex = 0;
  let polygonCellCollection: Array<Array<{
    red: number;
    green: number;
    blue: number;
    rowIndex: number;
    colIndex: number;
  }>> = []

  while(currentRowIndex < totalRowCount) {
    while(currentColIndex < totalColCount) {
      const starterCellForPolygon = imageDataWithProcessedFlag[currentRowIndex][currentColIndex];

      let cellProcessingQueue = [{
        red: starterCellForPolygon.red,
        green: starterCellForPolygon.green,
        blue: starterCellForPolygon.blue,
        rowIndex: currentRowIndex,
        colIndex: currentColIndex,
        processedFlag: starterCellForPolygon.processedFlag
      }];
      cellProcessingQueue = cellProcessingQueue.filter((element) => !element.processedFlag);
      const cellsForPolygon: Array<{
        red: number;
        green: number;
        blue: number;
        rowIndex: number;
        colIndex: number;
      }> = []

      while( cellProcessingQueue.length > 0) {
        const { rowIndex, colIndex } = cellProcessingQueue[0];
        const currentCell = {
          rowIndex,
          colIndex,
          red: imageDataWithProcessedFlag[rowIndex][colIndex].red,
          green: imageDataWithProcessedFlag[rowIndex][colIndex].green,
          blue: imageDataWithProcessedFlag[rowIndex][colIndex].blue,
          processedFlag: imageDataWithProcessedFlag[rowIndex][colIndex].processedFlag,
        }
        cellProcessingQueue.shift();
        
        if(currentCell.processedFlag === true) {
          continue;
        }

        cellsForPolygon.push({
          red: currentCell.red,
          green: currentCell.green,
          blue: currentCell.blue,
          rowIndex: currentCell.rowIndex,
          colIndex: currentCell.colIndex,
        });

        imageDataWithProcessedFlag[currentCell.rowIndex][currentCell.colIndex] = {
          red: currentCell.red,
          green: currentCell.green,
          blue: currentCell.blue,
          processedFlag: true
        }

        const enqueuingFunctionInput = {
          imageDataWithProcessedFlag,
          currentCell,
          cellProcessingQueue,
          totalColCount,
          totalRowCount
        }
        
        enqueueCellToTheLeftIfAppropriateInput(enqueuingFunctionInput);
        enqueueCellToTheRightIfAppropriateInput(enqueuingFunctionInput);
        enqueueCellAboveIfAppropriateInput(enqueuingFunctionInput);
        enqueueCellBelowIfAppropriateInput(enqueuingFunctionInput);
      }
      
      if(cellsForPolygon.length > 0) {
        polygonCellCollection.push(cellsForPolygon);
      }

      currentColIndex++;
    }

    currentColIndex = 0;
    currentRowIndex++;
  }

  return {
    polygonCellCollection
  }
}