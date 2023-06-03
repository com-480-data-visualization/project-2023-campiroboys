type ParkingData = {
  'maxCar': Number,
  'minCar': Number,
  'maxBike': Number,
  'minBike': Number
}

/**
 * Palette is of the form:
 *     c1   c2   c3
 *     c4   c5   c6
 *     c7   c8   c9
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

export default function colorMapping(parkingData: ParkingData, numberOfCars: number, numberOfBikes: number): string {
  if (parkingData.maxCar == -1) return '#999999'

  let percentageCars = numberOfCars / parkingData.maxCar
  let percentageBikes = numberOfBikes / parkingData.maxBike

  if (percentageCars < (1 / 3)) {
    if (percentageBikes < (1 / 3)) return colorPalette.c7
    if ((1 / 3) <= percentageBikes && percentageBikes < (2 / 3)) return colorPalette.c8
    return colorPalette.c9
  } else if ((1 / 3) <= percentageCars && percentageCars < (2 / 3)) {
    if (percentageBikes < (1 / 3)) return colorPalette.c4
    if ((1 / 3) <= percentageBikes && percentageBikes < (2 / 3)) return colorPalette.c5
    return colorPalette.c6
  } else {
    if (percentageBikes < (1 / 3)) return colorPalette.c1
    if ((1 / 3) <= percentageBikes && percentageBikes < (2 / 3)) return colorPalette.c2
    return colorPalette.c3
  }
}
