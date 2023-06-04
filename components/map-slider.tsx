'use client'

import * as d3 from 'd3'
import { AggregatedPerYearData, aggPerYearData } from '@/lib/data'
import { colorPalette } from '@/lib/color-mapping'
import Image from 'next/image'
import paletteIcon from './palette.svg'
import styles from './map-slider.module.css'
import barStyles from './bar-slider.module.css'
import { useEffect, useRef, useState } from 'react'
import Map from './map'

export type MapSliderProps = {
  width?: number
  height?: number
  padding?: number
}

export default function MapSlider(props: MapSliderProps) {
  const { width = 1200, height = 200, padding = 30 } = props

  const minYear = 2011, maxYear = 2021, step = 0.01

  const svgRef = useRef(null)

  const [selectedYear, setSelectedYear] = useState(maxYear - step)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .append('g')

    const xScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, width - padding])

    const yScale = d3.scaleLinear()
      .domain([0, 60000])
      .range([height - padding, padding])

    /* Creates the x-axis. */
    const xAxis = d3.axisBottom(xScale)
      .tickValues(aggPerYearData.map(d => d.year))
      .tickFormat(d3.format('d'))
      .tickSize(0)
      .tickSizeInner(-width)

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .style('color', 'black')
      .style('font-size', '4.25em')
      .attr('dx', '-0.2em')
      .attr('dy', '1.2em')
      .attr('transform', 'rotate(-45)')

    /* Create data lines. */

    const lineGenerator = d3.line<AggregatedPerYearData>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value || 0))
      .curve(d3.curveLinear)

    svg.append('path')
      .datum(aggPerYearData)
      .attr('fill', 'none')
      .attr('stroke', colorPalette.c1)
      .attr('stroke-width', 4)
      .attr('d', lineGenerator.y(d => yScale(d.cars)))

    svg.append('path')
      .datum(aggPerYearData)
      .attr('fill', 'none')
      .attr('stroke', colorPalette.c9)
      .attr('stroke-width', 4)
      .attr('d', lineGenerator.y(d => yScale(d.bikes)))

    return () => {
      svg.remove()
    }
  }, [height, width, padding, svgRef])

  return (
    <div>
      <Map selectedYear={selectedYear} />
      <div className={styles.wrapper}>
        <div className={styles.infoBox}>
          <Image src={paletteIcon} alt="Palette" />
        </div>
        <div className={barStyles.graphSlider}>
          <div className="w-full">
          <svg
            preserveAspectRatio="xMinYMin meet"
            viewBox={`${-padding} 0 ${width + padding} ${height + 4 * padding}`}
            className={barStyles.graphSvg}
            ref={svgRef}
          />
          </div>
          <div className={barStyles.slider}>
            <span>{minYear}</span>
            <input
              type="range"
              //TO avoid interpolation failure, lazy fix
              min={minYear + step}
              max={maxYear - step}
              defaultValue={selectedYear}
              step={step}
              className={barStyles.sliderInput}
              onChange={e => setSelectedYear(e.target.valueAsNumber)}
            />
            <span>{maxYear}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
