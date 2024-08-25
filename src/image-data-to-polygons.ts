import { Polygon } from "./geojson-types";

interface ConsolidateImageDataIntoPolygonsInput<TData extends Record<string, unknown>> {
  colourToPropertiesMap: Record<string, TData>;
  imageData: Array<Array<{
    red: number;
    green: number;
    blue: number;
  }>>;
  allColoursPresent: Array<{
    red: number;
    green: number;
    blue: number;
  }>
}

interface ConsolidateImageDataIntoPolygonsOutput<TData extends Record<string, unknown>> {
  polygons: Array<Polygon<TData>>;
}

export const consolidateImageDataIntoPolygons = <TData extends Record<string, unknown>>(
  input: ConsolidateImageDataIntoPolygonsInput<TData>
): ConsolidateImageDataIntoPolygonsOutput<TData> => {
  if(input.imageData.length === 0) {
    return { polygons: [] };
  }

  const imageDataWithProcessedFlag = input.imageData
    .map((row) => row
      .map((cell) => ({ red: cell.red, green: cell.green, blue: cell.blue, processedFlag: false }))
    )
  
  const totalRowCount = imageDataWithProcessedFlag.length;
  const totalColCount = imageDataWithProcessedFlag[0].length;
  
  let currentRowIndex = 0;
  let currentColIndex = 0;
  let polygons: Array<Polygon<TData>> = []

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
        const currentCell = cellProcessingQueue[0];
        console.log('currentCell.rowIndex', currentCell.rowIndex);
        console.log('currentCell.colIndex', currentCell.colIndex);
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

        if(currentCell.colIndex !== 0) {
          const cellToTheLeft = imageDataWithProcessedFlag[currentCell.rowIndex][currentCell.colIndex - 1];

          if(
            !cellToTheLeft.processedFlag
            && cellToTheLeft.red === currentCell.red
            && cellToTheLeft.green === currentCell.green
            && cellToTheLeft.blue === currentCell.blue
          ) {
            cellProcessingQueue.push({
              red: cellToTheLeft.red,
              green: cellToTheLeft.green,
              blue: cellToTheLeft.blue,
              rowIndex: currentCell.rowIndex,
              colIndex: currentCell.colIndex - 1,
              processedFlag: cellToTheLeft.processedFlag
            })
          }
        }
        if(currentCell.colIndex < (totalColCount - 1)) {
          const cellToTheRight = imageDataWithProcessedFlag[currentCell.rowIndex][currentCell.colIndex + 1];

          if(
            !cellToTheRight.processedFlag
            && cellToTheRight.red === currentCell.red
            && cellToTheRight.green === currentCell.green
            && cellToTheRight.blue === currentCell.blue
          ) {
            cellProcessingQueue.push({
              red: cellToTheRight.red,
              green: cellToTheRight.green,
              blue: cellToTheRight.blue,
              rowIndex: currentCell.rowIndex,
              colIndex: currentCell.colIndex + 1,
              processedFlag: cellToTheRight.processedFlag
            })
          }
        }
        if(currentCell.rowIndex !== 0) {
          const cellAbove = imageDataWithProcessedFlag[currentCell.rowIndex - 1][currentCell.colIndex];

          if(
            !cellAbove.processedFlag
            && cellAbove.red === currentCell.red
            && cellAbove.green === currentCell.green
            && cellAbove.blue === currentCell.blue
          ) {
            cellProcessingQueue.push({
              red: cellAbove.red,
              green: cellAbove.green,
              blue: cellAbove.blue,
              rowIndex: currentCell.rowIndex - 1,
              colIndex: currentCell.colIndex,
              processedFlag: cellAbove.processedFlag
            })
          }
        }
        if(currentCell.rowIndex < (totalRowCount - 1)) {
          const cellBelow = imageDataWithProcessedFlag[currentCell.rowIndex + 1][currentCell.colIndex];

          if(
            !cellBelow.processedFlag
            && cellBelow.red === currentCell.red
            && cellBelow.green === currentCell.green
            && cellBelow.blue === currentCell.blue
          ) {
            cellProcessingQueue.push({
              red: cellBelow.red,
              green: cellBelow.green,
              blue: cellBelow.blue,
              rowIndex: currentCell.rowIndex + 1,
              colIndex: currentCell.colIndex,
              processedFlag: cellBelow.processedFlag
            })
          }
        }
      }  

      currentColIndex++;
    }

    currentColIndex = 0;
    currentRowIndex++;
  }

  return {
    polygons
  }
}