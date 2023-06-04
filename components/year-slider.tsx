'use client'

import * as d3 from 'd3'
import { AggregatedPerYearData, aggPerYearData } from '@/lib/data'
import { colorPalette } from '@/lib/color-mapping'
import { getDateFromYearFraction } from '@/lib/util'
import Image from 'next/image'
import paletteIcon from './palette.svg'
import styles from './year-slider.module.css'
import { useEffect, useRef, useState } from 'react'

export type YearSliderProps = {
  width?: number
  height?: number
  padding?: number
  showPalette?: boolean
  showGraph?: boolean
  handleSelectedYear?: (selectedYear: number) => any
}

export default function YearSlider(props: YearSliderProps) {
  const {
    width = 1200,
    height = 200,
    padding = 30,
    showPalette = false,
    showGraph = false,
    handleSelectedYear = null
  } = props

  const minYear = 2011, maxYear = 2021, step = 0.01

  const graphSvgRef = useRef(null)

  const [selectedYear, setSelectedYear] = useState(maxYear - step)

  useEffect(() => {
    if (!showGraph)
      return

    const graphSvgD3 = d3.select(graphSvgRef.current)
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

    graphSvgD3.append('g')
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

    graphSvgD3.append('path')
      .datum(aggPerYearData)
      .attr('fill', 'none')
      .attr('stroke', colorPalette.c1)
      .attr('stroke-width', 4)
      .attr('d', lineGenerator.y(d => yScale(d.cars)))

    graphSvgD3.append('path')
      .datum(aggPerYearData)
      .attr('fill', 'none')
      .attr('stroke', colorPalette.c9)
      .attr('stroke-width', 4)
      .attr('d', lineGenerator.y(d => yScale(d.bikes)))

    return () => {
      graphSvgD3.remove()
    }
  }, [height, width, padding, showGraph, graphSvgRef])

  useEffect(() => {
    if (handleSelectedYear)
      handleSelectedYear(selectedYear)
  }, [selectedYear, handleSelectedYear])

  return (
    <div className={styles.wrapper}>
      {showPalette && <div className={styles.infoBox}>
        <Image src={paletteIcon} alt="Palette" />
      </div>}
      <div className="w-full">
        {showGraph && <div className="w-full">
          <svg
            preserveAspectRatio="xMinYMin meet"
            viewBox={`${-padding} 0 ${width + padding} ${height + 4 * padding}`}
            className={styles.graphSvg}
            ref={graphSvgRef}
          />
        </div>}
        <div className={styles.sliderDate}>
          {getDateFromYearFraction(selectedYear).toDateString()}
        </div>
        <div className={styles.slider}>
          <span>{minYear}</span>
          <input
            type="range"
            //TO avoid interpolation failure, lazy fix
            min={minYear + step}
            max={maxYear - step}
            defaultValue={selectedYear}
            step={step}
            className={styles.sliderInput}
            onChange={e => setSelectedYear(e.target.valueAsNumber)}
          />
          <span>{maxYear}</span>
        </div>
      </div>
    </div>
  )
}
