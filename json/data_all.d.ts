export interface DataEntry {
  knr: string
  cars: number
  bikes?: number
}

export interface DataAll {
  [year: string]: DataEntry[]
}

declare const dataAll: DataAll
export default dataAll
