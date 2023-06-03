import { parkingData } from './data'

/**
 * Palette is of the form:
 *   c1   c2   c3
 *   c4   c5   c6
 *   c7   c8   c9
 */
export const colorPalette: { [index: string]: string } = {
  'c1': '#4FA874',
  'c2': '#3A8269',
  'c3': '#275b5d',
  'c4': '#94bea4',
  'c5': '#6d8f90',
  'c6': '#4a6481',
  'c7': '#d2d2d2',
  'c8': '#999fbb',
  'c9': '#666aa4'
}

function interpolateColor(color1: string, color2: string, ratio: number): string {
  let color = ''
  for (let i = 1; i < 6; i += 2) {
    let t1 = parseInt(color1.slice(i, i + 2), 16)
    let t2 = parseInt(color2.slice(i, i + 2), 16)
    let value = Math.round(t1 + (t2 - t1) * ratio).toString(16)
    while (value.length < 2) {
      value = '0' + value
    }
    color += value
  }
  return '#' + color
}

function bilinearInterpolateColor(c00: string, c10: string, c01: string, c11: string, tx: number, ty: number): string {
  const rgb00 = interpolateColor(c00, c10, tx)
  const rgb01 = interpolateColor(c01, c11, tx)
  return interpolateColor(rgb00, rgb01, ty)
}

export function colorMapping(numberOfCars: number, numberOfBikes: number): string {
  if (parkingData.maxCar == -1) return '#999999'

  let percentageCars = numberOfCars / parkingData.maxCar
  let percentageBikes = numberOfBikes / parkingData.maxBike

  const tx = percentageCars
  const ty = percentageBikes
  
  if (percentageCars < (1 / 3)) {
    if (percentageBikes < (1 / 3)) return bilinearInterpolateColor(colorPalette.c7, colorPalette.c4, colorPalette.c8, colorPalette.c5, tx, ty)
    if ((1 / 3) <= percentageBikes && percentageBikes < (2 / 3)) return bilinearInterpolateColor(colorPalette.c8, colorPalette.c5, colorPalette.c9, colorPalette.c6, tx, ty)
    return bilinearInterpolateColor(colorPalette.c9, colorPalette.c6, colorPalette.c9, colorPalette.c6, tx, ty)
  } else if ((1 / 3) <= percentageCars && percentageCars < (2 / 3)) {
    if (percentageBikes < (1 / 3)) return bilinearInterpolateColor(colorPalette.c4, colorPalette.c1, colorPalette.c5, colorPalette.c2, tx, ty)
    if ((1 / 3) <= percentageBikes && percentageBikes < (2 / 3)) return bilinearInterpolateColor(colorPalette.c5, colorPalette.c2, colorPalette.c6, colorPalette.c3, tx, ty)
    return bilinearInterpolateColor(colorPalette.c6, colorPalette.c3, colorPalette.c6, colorPalette.c3, tx, ty)
  } else {
    if (percentageBikes < (1 / 3)) return bilinearInterpolateColor(colorPalette.c1, colorPalette.c1, colorPalette.c2, colorPalette.c2, tx, ty)
    if ((1 / 3) <= percentageBikes && percentageBikes < (2 / 3)) return bilinearInterpolateColor(colorPalette.c2, colorPalette.c2, colorPalette.c3, colorPalette.c3, tx, ty)
    return bilinearInterpolateColor(colorPalette.c3, colorPalette.c3, colorPalette.c3, colorPalette.c3, tx, ty)
  }
}
