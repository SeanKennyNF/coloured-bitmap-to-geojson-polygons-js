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
  const polygons: Array<Polygon<TData>> = [
    {
      type: "Polygon",
      coordinates: [
        [
          [40.0, 40.0],
          [20.0, 45.0],
          [45.0, 30.0],
          [40.0, 40.0]
        ]
      ],
      properties: {
        colourHexCode: '#FF00FF',
        data: null
      }
    },
    {
      type: "Polygon",
      coordinates: [
        [
          [20.0, 35.0],
          [10.0, 30.0],
          [10.0, 10.0],
          [30.0, 5.0],
          [45.0, 20.0],
          [20.0, 35.0]
        ]
      ],
      properties: {
        colourHexCode: '#00FFFF',
        data: null
      }
    },
    {
      type: "Polygon",
      coordinates: [
        [
          [30.0, 20.0],
          [20.0, 15.0],
          [20.0, 25.0],
          [30.0, 20.0]
        ]
      ],
      properties: {
        colourHexCode: '#0000FF',
        data: null
      }
    }
  ];

  return {
    polygons
  }
}