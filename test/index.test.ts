import { expect, test } from 'vitest'
import { exportColouredBitmapToGeoJSONPolygons } from '../src'
import path from 'path';
import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';

test('the exportColouredBitmapToGeoJSONPolygons function is callable.', { timeout: 50000 }, async() => {
  const input = {
    inputFilePath: path.join(
      __dirname,
      'sample-inputs',
      'provinces.bmp'
    ),
    bitmapWidthPx: 5632,
    bitmapHeightPx: 2048
  }
  const output = await exportColouredBitmapToGeoJSONPolygons(input);

  const pathToExpectedOutputGeoJSONFile = path.join(
    __dirname,
    'expected-outputs',
    'provinces-expected-geojson-output.json'
  );
  const expectedOutputGeoJSON = JSON.parse(readFileSync(pathToExpectedOutputGeoJSONFile).toString());

  const outputGeoJSONToCreateArtifact = JSON.stringify(output.outputGeoJSON);

  const pathToWriteArtifactTo = path.join(
    __dirname,
    'artifacts',
    'provinces-geojson-artifact.json'
  );

  await writeFile(pathToWriteArtifactTo, outputGeoJSONToCreateArtifact, 'utf8');

  expect(output).toStrictEqual({
    bmpFileMetadata: {
      header: {
        signature: 'BM',
        fileSizeBytes: 2,
        reservedField: '00000000',
        dataOffsetBytes: 0 
      },
      infoHeader: {
        bitsPerPixel: "ZERO",
        bmpHeightPx: 0,
        bmpWidthPx: 0,
        compressionType: "BI_RGB",
        horizontalPixelsPerMetre: 0,
        imageCompressedSizeBytes: 2,
        infoHeaderSizeBytes: 0,
        numberOfColoursUsed: 0,
        numberOfImportantColours: 0,
        numberOfPlanes: 0,
        verticalPixelsPerMetre: 0
      },
      colourMap: {}
    },
    outputGeoJSON: expectedOutputGeoJSON
  });
});