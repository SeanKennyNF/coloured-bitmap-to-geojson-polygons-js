# Changelog

## Version 0.1.0 - August 27th 2024

- Created first version of the library.
- Added `exportColouredBitmapToGeoJSONPolygons` which takes a `.bmp` bitmap file and converts it to a GeoJSON file.
- Only files containing a 24 or 32 bit per pixel scheme are supported. All other schemes are unsupported as of right now.

## Version 0.1.1 - August 27th 2024

- Added better `README.md`.

## Version 0.1.2 - August 27th 2024

- Fixed typos in `README.md`

## Version 0.1.3 - August 27th 2024

- Added repository link into the `package.json` file.

## Version 0.1.4 - August 27th 2024

- No changes, accidental publish.

## Version 0.1.5 - August 27th 2024

- Fixed a bug with the imports.

## Version 0.2.0 - August 30th 2024

- [BREAKING] Changed the library to use a `FeatureCollection` instead of a `GeometryCollection` in order for the properties to actually be read properly by mapping software.