import { expect, test } from 'vitest'
import { exportColouredBitmapToGeoJSONPolygons, ExportColouredBitmapToGeoJSONPolygonsInput } from '../src'
import path from 'path';
import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';

const testCases: Array<{
  inputFilename: string;
  colourToPropertiesMap: ExportColouredBitmapToGeoJSONPolygonsInput<{
    zone: string;
  }>['colourToPropertiesMap'];
  domainLatitudeLowerBound?: number | undefined;
  domainLatitudeUpperBound?: number | undefined;
  domainLongitudeLowerBound?: number | undefined;
  domainLongitudeUpperBound?: number | undefined;
  artifactFilename: string;
  geoJsonExpectedOutputFilename: string;
  metadataExpectedOutputFilename: string;
}> = [
  {
    inputFilename: 'bmp-24.bmp',
    colourToPropertiesMap: {
      "#ff0000": {
        zone: "The red zone"
      },
      "#00ff00": {
        zone: "The green zone"
      },
      "#0000ff": {
        // Mandatory viewing: https://www.youtube.com/watch?v=j4aLwDY0R_U
        zone: "The blue zone"
      },
    },
    artifactFilename: 'bmp-24-geojson-artifact.json',
    geoJsonExpectedOutputFilename: 'bmp-24-expected-geojson-output.json',
    metadataExpectedOutputFilename: 'bmp-24-expected-bmp-file-metadata.json',
  },
  {
    inputFilename: 'provinces-subset-1.bmp',
    colourToPropertiesMap: {},
    artifactFilename: 'provinces-subset-1-geojson-artifact.json',
    geoJsonExpectedOutputFilename: 'provinces-subset-1-expected-geojson-output.json',
    metadataExpectedOutputFilename: 'provinces-subset-1-expected-bmp-file-metadata.json',
  },
  {
    inputFilename: 'provinces-subset-1.bmp',
    colourToPropertiesMap: {},
    domainLatitudeLowerBound: -30,
    domainLatitudeUpperBound: 60,
    domainLongitudeLowerBound: -20,
    domainLongitudeUpperBound: 20,
    artifactFilename: 'provinces-subset-1-with-domain-geojson-artifact.json',
    geoJsonExpectedOutputFilename: 'provinces-subset-1-with-domain-expected-geojson-output.json',
    metadataExpectedOutputFilename: 'provinces-subset-1-with-domain-expected-bmp-file-metadata.json',
  },
  {
    inputFilename: 'provinces-subset-2.bmp',
    colourToPropertiesMap: {},
    artifactFilename: 'provinces-subset-2-geojson-artifact.json',
    geoJsonExpectedOutputFilename: 'provinces-subset-2-expected-geojson-output.json',
    metadataExpectedOutputFilename: 'provinces-subset-2-expected-bmp-file-metadata.json',
  },
  {
    inputFilename: 'provinces-subset-3.bmp',
    colourToPropertiesMap: {},
    artifactFilename: 'provinces-subset-3-geojson-artifact.json',
    geoJsonExpectedOutputFilename: 'provinces-subset-3-expected-geojson-output.json',
    metadataExpectedOutputFilename: 'provinces-subset-3-expected-bmp-file-metadata.json',
  },
  {
    inputFilename: 'provinces-subset-4.bmp',
    colourToPropertiesMap: {},
    artifactFilename: 'provinces-subset-4-geojson-artifact.json',
    geoJsonExpectedOutputFilename: 'provinces-subset-4-expected-geojson-output.json',
    metadataExpectedOutputFilename: 'provinces-subset-4-expected-bmp-file-metadata.json',
  },
  {
    inputFilename: 'provinces-subset-5.bmp',
    colourToPropertiesMap: {},
    artifactFilename: 'provinces-subset-5-geojson-artifact.json',
    geoJsonExpectedOutputFilename: 'provinces-subset-5-expected-geojson-output.json',
    metadataExpectedOutputFilename: 'provinces-subset-5-expected-bmp-file-metadata.json',
  },
  {
    inputFilename: 'provinces-subset-6.bmp',
    colourToPropertiesMap: {},
    artifactFilename: 'provinces-subset-6-geojson-artifact.json',
    geoJsonExpectedOutputFilename: 'provinces-subset-6-expected-geojson-output.json',
    metadataExpectedOutputFilename: 'provinces-subset-6-expected-bmp-file-metadata.json',
  },
]

test.each(testCases)('exportColouredBitmapToGeoJSONPolygons should produce the right output for $inputFilename -> $geoJsonExpectedOutputFilename', { timeout: 200000 }, async({
  inputFilename,
  artifactFilename,
  geoJsonExpectedOutputFilename,
  metadataExpectedOutputFilename,
  colourToPropertiesMap,
  domainLatitudeLowerBound,
  domainLatitudeUpperBound,
  domainLongitudeLowerBound,
  domainLongitudeUpperBound
}) => {
  const input = {
    inputFilePath: path.join(
      __dirname,
      'sample-inputs',
      inputFilename,
    ),
    domainBounds: (
      domainLatitudeLowerBound !== undefined &&
      domainLatitudeUpperBound !== undefined &&
      domainLongitudeLowerBound !== undefined &&
      domainLongitudeUpperBound !== undefined
    ) ? {
      latitudeLowerBound: domainLatitudeLowerBound,
      latitudeUpperBound: domainLatitudeUpperBound,
      longitudeLowerBound: domainLongitudeLowerBound,
      longitudeUpperBound: domainLongitudeUpperBound,
    } : undefined,
    colourToPropertiesMap
  }

  const output = await exportColouredBitmapToGeoJSONPolygons(input);

  const pathToExpectedOutputGeoJSONFile = path.join(
    __dirname,
    'expected-outputs',
    geoJsonExpectedOutputFilename
  );
  const expectedOutputGeoJSON = JSON.parse(readFileSync(pathToExpectedOutputGeoJSONFile).toString());
  const pathToExpectedOutputMetadataFile = path.join(
    __dirname,
    'expected-outputs',
    metadataExpectedOutputFilename
  );
  const expectedOutputMetadata = JSON.parse(readFileSync(pathToExpectedOutputMetadataFile).toString());

  const outputGeoJSONToCreateArtifact = JSON.stringify(output.outputGeoJSON);

  const pathToWriteArtifactTo = path.join(
    __dirname,
    'artifacts',
    artifactFilename
  );

  await writeFile(pathToWriteArtifactTo, outputGeoJSONToCreateArtifact, 'utf8');

  expect(output.bmpFileMetadata).toStrictEqual(expectedOutputMetadata);
  expect(output.outputGeoJSON).toStrictEqual(expectedOutputGeoJSON);
})