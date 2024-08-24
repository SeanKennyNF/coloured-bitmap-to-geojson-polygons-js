import { expect, test } from 'vitest'
import { exportColouredBitmapToGeoJSONPolygons } from '../src'
import path from 'path';
import { readFileSync } from 'fs';

test('the exportColouredBitmapToGeoJSONPolygons function is callable.', () => {
  const input = {
    inputFilePath: path.join(
      __dirname,
      'sample-inputs',
      'provinces.bmp'
    ),
    bitmapWidthPx: 5632,
    bitmapHeightPx: 2048
  }
  const output = exportColouredBitmapToGeoJSONPolygons(input);

  const pathToExpectedOutputGeoJSONFile = path.join(
    __dirname,
    'expected-outputs',
    'provinces-expected-geojson-output.json'
  );
  const expectedOutputGeoJSON = JSON.parse(readFileSync(pathToExpectedOutputGeoJSONFile).toString());

  expect(output).resolves.toStrictEqual({
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
        horizontalPixelsPerMetre: 46,
        imageCompressedSizeBytes: 0,
        infoHeaderSizeBytes: 0,
        numberOfColoursUsed: 0,
        numberOfImportantColours: 0,
        numberOfPlanes: 0,
        verticalPixelsPerMetre: 46
      },
      colourMap: {}
    },
    outputGeoJSON: expectedOutputGeoJSON
  });
})