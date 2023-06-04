'use client'

import { useState } from 'react'
import Map from './map'
import YearSlider from './year-slider'

export default function MapSlider() {
  const [selectedYear, setSelectedYear] = useState(0)

  return (
    <div>
      <Map selectedYear={selectedYear} />
      <YearSlider
        showPalette={true}
        showGraph={true}
        handleSelectedYear={(selectedYear) => setSelectedYear(selectedYear)}
      />
    </div>
  )
}
