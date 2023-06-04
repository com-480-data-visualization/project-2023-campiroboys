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

export function colorMapping(numberOfCars: number, numberOfBikes: number): string {
  if (parkingData.maxCar == -1 || parkingData.maxBike == -1) return '#999999'

  
  let percentageCars = (numberOfCars === 0 || isNaN(numberOfCars) )? 0 : numberOfCars / parkingData.maxCar
  let percentageBikes = (numberOfBikes === 0 || isNaN(numberOfBikes)) ? 0 : numberOfBikes / parkingData.maxBike

  let c00 = '#4FA874' // Corresponds to colorPalette.c1
  let c10 = '#275b5d' // Corresponds to colorPalette.c3
  let c01 = '#d2d2d2' // Corresponds to colorPalette.c7
  let c11 = '#666aa4' // Corresponds to colorPalette.c9

  let color = ''
  for (let i = 1; i < 6; i += 2) {
      let t00 = parseInt(c00.slice(i, i + 2), 16)
      let t10 = parseInt(c10.slice(i, i + 2), 16)
      let t01 = parseInt(c01.slice(i, i + 2), 16)
      let t11 = parseInt(c11.slice(i, i + 2), 16)

      // Perform bilinear interpolation for each color component
      let t0 = Math.round(t00 + (t10 - t00) * percentageCars).toString(16)
      let t1 = Math.round(t01 + (t11 - t01) * percentageCars).toString(16)
      let value = Math.round(parseInt(t0, 16) + (parseInt(t1, 16) - parseInt(t0, 16)) * percentageBikes).toString(16)

      while (value.length < 2) {
        value = '0' + value
      }
      color += value
  }
  return '#' + color
}

