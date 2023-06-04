import dataAll, { DataEntry } from '@/json/data_all'

export type { DataEntry } from '@/json/data_all'

export interface AggregatedPerYearData {
  year: number
  cars: number
  bikes: number
  value?: number
}

function nearestOddIntegers(n: number): [number, number] {
  // Check if number is an integer
  const isInteger = n % 1 === 0

  // Check if number is odd
  const isOdd = n % 2 !== 0

  if (isInteger && isOdd) {
    return [n, n]
  } else {
    const lowerOdd = Math.floor(n) % 2 === 0 ? Math.floor(n) - 1 : Math.floor(n)
    const upperOdd = Math.ceil(n) % 2 === 0 ? Math.ceil(n) + 1 : Math.ceil(n)

    return [lowerOdd, upperOdd]
  }
}

export function getInterpolatedCarAndBikeNumbers(year: number, knr: string) {
  const [yLow, yHigh] = nearestOddIntegers(year)



  const entriesBefore = dataAll[yLow]
  const entriesAfter = dataAll[yHigh]

  if (entriesBefore && entriesAfter) {
    const eb = entriesBefore.find((entry) => parseInt(entry.knr) === parseInt(knr))
    const ea = entriesAfter.find((entry) => parseInt(entry.knr) === parseInt(knr))


    if (eb && ea) {
      const carLow = eb.cars || 0
      const carHigh = ea.cars || 0
      const bikeLow = eb.bikes || 0
      const bikeHigh = ea.bikes || 0

      const cars = carLow * ((yHigh - year) / 2) + carHigh * ((year - yLow) / 2)
      const bikes = bikeLow * ((yHigh - year) / 2) + bikeHigh * ((year - yLow) / 2)

      return {
        year: year,
        cars: cars,
        bikes: bikes
      }
    }
  }

  // Return some default value in case we couldn't calculate
  return {
    year: year,
    cars: 0,
    bikes: 0
  }
}


export function getInterpolatedDataEntries(year: number): DataEntry[] {
  const [yLow, yHigh] = nearestOddIntegers(year)
  const entriesBefore = dataAll[yLow]
  const entriesAfter = dataAll[yHigh]

  if (entriesBefore && entriesAfter) {
    return entriesBefore.map((entry) => {
      const ea = entriesAfter.find((e) => parseInt(e.knr) === parseInt(entry.knr))
      return {
        knr: entry.knr,
        cars: entry.cars + ((ea?.cars ?? 0) - entry.cars) * (year - yLow),
        bikes: (entry?.bikes ?? 0) + ((ea?.bikes ?? 0) - (entry?.bikes ?? 0)) * (year - yLow),
      }
    })
  }

  return []
}

const allEntries: DataEntry[] = Object.values(dataAll).flatMap((entries) => entries)

export const parkingData = {
  'maxCar': allEntries.reduce((max, entry) => Math.max(max, entry.cars), 0),
  'minCar': allEntries.reduce((min, entry) => Math.min(min, entry.cars), 999999999),
  'maxBike': allEntries.reduce((max, entry) => Math.max(max, entry.bikes ?? 0), 0),
  'minBike': allEntries.reduce((min, entry) => Math.min(min, entry.bikes ?? 999999999), 999999999),
}

export const aggPerYearData: AggregatedPerYearData[] = Object.entries(dataAll).map(([year, entries]) => {
  const sumCars = entries.reduce((total, entry) => total + entry.cars, 0)
  const sumBikes = entries.reduce(
    (total, entry) => (entry.bikes ? total + entry.bikes : total),
    0
  )

  return {
    year: parseInt(year),
    cars: sumCars,
    bikes: sumBikes,
    value: sumCars + sumBikes,
  }
})
