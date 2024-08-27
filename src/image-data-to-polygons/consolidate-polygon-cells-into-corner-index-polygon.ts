import { Coordinate } from "../geojson-types";

enum LastMove {
  DOWNWARDS = 'DOWNWARDS',
  UPWARDS = 'UPWARDS',
  TO_THE_RIGHT = 'TO_THE_RIGHT',
  TO_THE_LEFT = 'TO_THE_LEFT',
}

interface ConsolidatePolygonCellsIntoCornerIndexPolygonInput {
  polygonCells: Array<{
    red: number;
    green: number;
    blue: number;
    rowIndex: number;
    colIndex: number;
  }>
}

interface ConsolidatePolygonCellsIntoCornerIndexPolygonOutput {
  cornersForPolygon: Coordinate[];
  red: number;
  blue: number;
  green: number;
}

export const consolidatePolygonCellsIntoCornerIndexPolygonInput = (
  input: ConsolidatePolygonCellsIntoCornerIndexPolygonInput
): ConsolidatePolygonCellsIntoCornerIndexPolygonOutput => {
  const { polygonCells } = input;

  if(polygonCells.length === 0) {
    return  {
      cornersForPolygon: [],
      red: 0,
      blue: 0,
      green: 0,
    }
  }

  const { red, green, blue } = polygonCells[0];

  const leftmostColIndex = polygonCells.reduce((accumulator, cell) => Math.min(accumulator, cell.colIndex), polygonCells[0].colIndex);
  const leftmostAndThenTopmostPoint = polygonCells
    .filter((cell) => cell.colIndex === leftmostColIndex)
    .sort((cellA, cellB) => cellA.rowIndex - cellB.rowIndex)[0];
  
  const initialCornerCornerGridColIndex = leftmostAndThenTopmostPoint.colIndex;
  const initialCornerCornerGridRowIndex = leftmostAndThenTopmostPoint.rowIndex;

  const cornersForPolygon: Array<[number, number]>  = [];
  let currentCornerGridColIndex = initialCornerCornerGridColIndex;
  let currentCornerGridRowIndex = initialCornerCornerGridRowIndex;
  let justStarted = true;
  let lastMove: LastMove | undefined = undefined;

  while(true) {
    if(
      justStarted === false &&
      currentCornerGridColIndex === initialCornerCornerGridColIndex &&
      currentCornerGridRowIndex === initialCornerCornerGridRowIndex
    ) {
      if(cornersForPolygon.length > 0) {
        cornersForPolygon.push(cornersForPolygon[0]);
      }
      
      break;
    }

    justStarted = false;

    const cellToTheTopLeftOfCorner = polygonCells
      .find((cell) => cell.colIndex === (currentCornerGridColIndex - 1) && cell.rowIndex === (currentCornerGridRowIndex - 1));
    const cellToTheTopRightOfCorner = polygonCells
      .find((cell) => cell.colIndex === currentCornerGridColIndex && cell.rowIndex === (currentCornerGridRowIndex - 1));
    const cellToTheBottomLeftOfCorner = polygonCells
      .find((cell) => cell.colIndex === (currentCornerGridColIndex - 1) && cell.rowIndex === currentCornerGridRowIndex);
    const cellToTheBottomRightOfCorner = polygonCells
      .find((cell) => cell.colIndex === currentCornerGridColIndex && cell.rowIndex === currentCornerGridRowIndex);

    const numberOfCellsAdjacentToCornerWhichArePartOfPolygon = 0 +
      (cellToTheTopLeftOfCorner ? 1 : 0) + 
      (cellToTheTopRightOfCorner ? 1 : 0) + 
      (cellToTheBottomLeftOfCorner ? 1 : 0) + 
      (cellToTheBottomRightOfCorner ? 1 : 0);

    if(numberOfCellsAdjacentToCornerWhichArePartOfPolygon === 0) {
      throw Error('Encountered invalid polygon. This is likely indicative of a bug within the library. Please report to the author along with the bmp file that failed to parse along with a passive aggressive statement about his lack of care for the library or lack of programming skill.')
    } else if(numberOfCellsAdjacentToCornerWhichArePartOfPolygon === 1) {
      if(cellToTheBottomRightOfCorner !== undefined) {
        cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
        currentCornerGridColIndex++;
        lastMove = LastMove.TO_THE_RIGHT;
        continue;
      }
      if(cellToTheTopRightOfCorner !== undefined) {
        cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
        currentCornerGridRowIndex--;
        lastMove = LastMove.UPWARDS;
        continue;
      }
      if(cellToTheTopLeftOfCorner !== undefined) {
        cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
        currentCornerGridColIndex--;
        lastMove = LastMove.TO_THE_LEFT;
        continue;
      }
      if(cellToTheBottomLeftOfCorner !== undefined) {
        cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
        currentCornerGridRowIndex++;
        lastMove = LastMove.DOWNWARDS;
        continue;
      }
      throw new Error('Unexpected state with one adjacent cell which is part of the polygon.');
    } else if(numberOfCellsAdjacentToCornerWhichArePartOfPolygon === 2) {
      if(
        cellToTheTopLeftOfCorner !== undefined &&
        cellToTheBottomLeftOfCorner !== undefined
      ) {
        currentCornerGridRowIndex++;
        lastMove = LastMove.DOWNWARDS;
        continue;
      }
      if(
        cellToTheTopRightOfCorner !== undefined &&
        cellToTheBottomRightOfCorner !== undefined
      ) {
        currentCornerGridRowIndex--;
        lastMove = LastMove.UPWARDS;
        continue;
      }
      if(
        cellToTheTopLeftOfCorner !== undefined &&
        cellToTheTopRightOfCorner !== undefined
      ) {
        currentCornerGridColIndex--;
        lastMove = LastMove.TO_THE_LEFT;
        continue;
      }
      if(
        cellToTheBottomLeftOfCorner !== undefined &&
        cellToTheBottomRightOfCorner !== undefined
      ) {
        currentCornerGridColIndex++;
        lastMove = LastMove.TO_THE_RIGHT;
        continue;
      }
      if(
        cellToTheTopLeftOfCorner !== undefined &&
        cellToTheBottomRightOfCorner !== undefined
      ) {
        // Q: Hey Sean, doesn't the existence of this scenario imply that you can visit the same point twice?
        //    Doesn't that make you concerned about when the starting point is either an
        //
        //    OX  scenario or a XO scenario?
        //    XO                OX
        //
        // A: Yes you're right that we can visit the same point twice under circumstances like this.
        //    What I'm relying on here is that a scenario like this will never be the starting point.
        //    Remember that the starting corner has to be the leftmost and then the topmost point.
        //    
        //    OX     XO
        //    XO and OX
        //    scenarios are ruled out immideately because the corner has to be the furthest left corner possible
        //    and the centre of both those shapes have cells which are part of the polygon that are further to the
        //    left and would be considered the leftmosttopmost point.
        //    Basically, so long as that leftmost topmost logic stays there I feel we're good.
        if(lastMove === LastMove.UPWARDS) {
          cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
          currentCornerGridColIndex++;
          lastMove = LastMove.TO_THE_RIGHT;
          continue;
        }
        if(lastMove === LastMove.DOWNWARDS) {
          cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
          currentCornerGridColIndex--;
          lastMove = LastMove.TO_THE_LEFT;
          continue;
        }

        throw new Error('Invalid last move for corned with two adjacent cells which are part of the polgyon');
      }
      if(
        cellToTheBottomLeftOfCorner !== undefined &&
        cellToTheTopRightOfCorner !== undefined
      ) {
        if(lastMove === LastMove.TO_THE_LEFT) {
          cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
          currentCornerGridRowIndex--;
          lastMove = LastMove.UPWARDS;
          continue;
        }
        if(lastMove === LastMove.TO_THE_RIGHT) {
          cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
          currentCornerGridRowIndex++;
          lastMove = LastMove.DOWNWARDS;
          continue;
        }

        throw new Error('Invalid last move for corned with two adjacent cells which are part of the polgyon');
      }
      throw new Error('Unexpected state with two adjacent cells which are part of the polygon.');
    } else if(numberOfCellsAdjacentToCornerWhichArePartOfPolygon === 3) {
      if(cellToTheBottomRightOfCorner === undefined) {
        cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
        currentCornerGridRowIndex++;
        lastMove = LastMove.DOWNWARDS;
        continue;
      }
      if(cellToTheTopLeftOfCorner === undefined) {
        cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
        currentCornerGridRowIndex--;
        lastMove = LastMove.UPWARDS;
        continue;
      }
      if(cellToTheTopRightOfCorner === undefined) {
        cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
        currentCornerGridColIndex++;
        lastMove = LastMove.TO_THE_RIGHT;
        continue;
      }
      if(cellToTheBottomLeftOfCorner === undefined) {
        cornersForPolygon.push([ currentCornerGridColIndex, currentCornerGridRowIndex ]);
        currentCornerGridColIndex--;
        lastMove = LastMove.TO_THE_LEFT;
        continue;
      }
    } else {
      throw Error('Encountered invalid polygon. This is likely indicative of a bug within the library. Please report to the author along with the bmp file that failed to parse along with a passive aggressive statement about his lack of care for the library or lack of programming skill.')
    }
  }

  return {
    cornersForPolygon,
    red,
    blue,
    green
  };
}