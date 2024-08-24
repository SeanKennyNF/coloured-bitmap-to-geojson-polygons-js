export const hexStringtoAsciiString = (hexString: string): string => {
  return Buffer.from(hexString, 'hex').toString();
}

export const hexStringToNumericValue = (hexString: string): number => {
  // As it turns out, BMP files store numbers in a little endian format so I just turn it into big endian before converting.
  const bigEndianHexString = hexString
    .match(/..?/g)
    ?.reverse()
    ?.join() ?? '';

  return parseInt(bigEndianHexString, 16);
}
