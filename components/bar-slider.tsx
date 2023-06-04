'use client'

import { useState } from 'react'
import Bar from './bar'
import YearSlider from './year-slider'

export default function BarSlider() {
  const [selectedYear, setSelectedYear] = useState(0)

  return (
    <div>
      <Bar selectedYear={selectedYear} />
      <YearSlider handleSelectedYear={(selectedYear) => setSelectedYear(selectedYear)} />
    </div>
  )
}
