import * as d3 from 'd3'
import { FeatureCollection } from 'geojson'
import { useEffect, useState } from 'react'

export default function useFeatureCollection(url: string) {
  const [data, setData] = useState<FeatureCollection | null>(null)

  useEffect(() => {
    async function startFetching() {
      const data = await d3.json<FeatureCollection>(url)

      // Avoid possible race conditions
      if (!ignore) {
        setData(data ?? null)
      }
    }

    let ignore = false
    startFetching()
    return () => {
      ignore = true
    }
  }, [url])

  return data
}
