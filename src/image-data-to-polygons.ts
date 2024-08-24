import { PolygonCoordinateSet } from "./geojson-types";

interface ConsolidateImageDataIntoPolygonsInput {
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

interface ConsolidateImageDataIntoPolygonsOutput {
  polygons: Array<PolygonCoordinateSet>;
}

export const consolidateImageDataIntoPolygons = (input: ConsolidateImageDataIntoPolygonsInput): ConsolidateImageDataIntoPolygonsOutput => {
  const polygons: Array<PolygonCoordinateSet> = [
    [
      [
        [40.0, 40.0],
        [20.0, 45.0],
        [45.0, 30.0],
        [40.0, 40.0]
      ]
    ],
    [
      [
        [20.0, 35.0],
        [10.0, 30.0],
        [10.0, 10.0],
        [30.0, 5.0],
        [45.0, 20.0],
        [20.0, 35.0]
      ],
      [
        [30.0, 20.0],
        [20.0, 15.0],
        [20.0, 25.0],
        [30.0, 20.0]
      ]
    ]
  ];

  return {
    polygons
  }
}