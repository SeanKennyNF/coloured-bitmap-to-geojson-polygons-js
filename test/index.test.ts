import { expect, test } from 'vitest'
import { exportColouredBitmapToGeoJSONPolygons } from '../src'
import path from 'path';
import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';

const testCases = [
  //{
  //  inputFilename: 'provinces.bmp',
  //  colourToPropertiesMap: {},
  //  bitmapWidthPx: 5632,
  //  bitmapHeightPx: 2048,
  //  artifactFilename: 'provinces-geojson-artifact.json',
  //  geoJsonExpectedOutputFilename: 'provinces-expected-geojson-output.json',
  //  metadataExpectedOutputFilename: 'provinces-expected-bmp-file-metadata.json',
  //},
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
    bitmapWidthPx: 200,
    bitmapHeightPx: 200,
    artifactFilename: 'bmp-24-geojson-artifact.json',
    geoJsonExpectedOutputFilename: 'bmp-24-expected-geojson-output.json',
    metadataExpectedOutputFilename: 'bmp-24-expected-bmp-file-metadata.json',
  },
  //{
  //  inputFilename: 'provinces-subset-1.bmp',
  //  colourToPropertiesMap: {},
  //  bitmapWidthPx: 32,
  //  bitmapHeightPx: 31,
  //  artifactFilename: 'provinces-subset-1-geojson-artifact.json',
  //  geoJsonExpectedOutputFilename: 'provinces-subset-1-expected-geojson-output.json',
  //  metadataExpectedOutputFilename: 'provinces-subset-1-expected-bmp-file-metadata.json',
  //},
  //{
  //  inputFilename: 'provinces-subset-2.bmp',
  //  colourToPropertiesMap: {},
  //  bitmapWidthPx: 480,
  //  bitmapHeightPx: 480,
  //  artifactFilename: 'provinces-subset-2-geojson-artifact.json',
  //  geoJsonExpectedOutputFilename: 'provinces-subset-2-expected-geojson-output.json',
  //  metadataExpectedOutputFilename: 'provinces-subset-2-expected-bmp-file-metadata.json',
  //}
]

test.each(testCases)('exportColouredBitmapToGeoJSONPolygons should produce the right output for $inputFilename', { timeout: 50000}, async(
  { inputFilename, bitmapWidthPx, bitmapHeightPx, artifactFilename, geoJsonExpectedOutputFilename, metadataExpectedOutputFilename, colourToPropertiesMap }
) => {
  const input = {
    inputFilePath: path.join(
      __dirname,
      'sample-inputs',
      inputFilename,
    ),
    bitmapWidthPx,
    bitmapHeightPx,
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

  expect(output).toStrictEqual({
    bmpFileMetadata: expectedOutputMetadata,
    outputGeoJSON: expectedOutputGeoJSON
  });
})