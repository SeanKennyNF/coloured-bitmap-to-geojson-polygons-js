export enum CompressionType {
  BI_RGB = 'BI_RGB',
  BI_RLE_EIGHT = 'BI_RLE_EIGHT',
  BI_RLE_FOUR = 'BI_RLE_FOUR'
}

export const hexValueToCompressionType: Record<string, CompressionType | undefined> = {
  0: CompressionType.BI_RGB,
  1: CompressionType.BI_RLE_EIGHT,
  2: CompressionType.BI_RLE_FOUR,
}