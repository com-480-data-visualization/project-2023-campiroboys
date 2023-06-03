'use client'

import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import { DataEntry, getInterpolatedDataEntries } from '@/lib/data'
import { colorPalette } from '@/lib/color-mapping'
import styles from './bar-slider.module.css'

export type BarSliderProps = {
  width?: number
  height?: number
  padding?: number
}

export default function BarSlider(props: BarSliderProps) {
  const { width = 600, height = 400, padding = 20 } = props

  const svgRef = useRef(null)

  const [selectedYear, setSelectedYear] = useState(2021)

  useEffect(() => {
    // Set up the SVG container
    const data: DataEntry[] = getInterpolatedDataEntries(selectedYear)

    // Set up the SVG container
    const svg = d3.select(svgRef.current)

    svg.selectAll('*').remove()

    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([-d3.max(data, d => d.cars)!,
      d3.max(data, d => d.cars)!])
      .range([0, width / 2])

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.knr))
      .range([0, height])
      .padding(0.2)


    svg.selectAll('.bar.cars')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar cars')
      .attr('x', d => width / 2 - xScale(Math.abs(d.cars)))
      .attr('y', (d: DataEntry) => yScale(d.knr)!)
      .attr('width', d => xScale(Math.abs(d.cars)))
      .attr('height', yScale.bandwidth())
      .style('fill', colorPalette.c1)



    svg.selectAll('.bar.bikes')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar bikes')
      .attr('x', width / 2)
      .attr('y', (d: DataEntry) => yScale(d.knr)!)
      .attr('width', (d:any) => xScale(Math.abs(d.bikes)))
      .attr('height', yScale.bandwidth())
      .style('fill', colorPalette.c9)

    // Apply transition to update bar lengths
    svg.selectAll('.bar.cars')
      .attr('x', width / 2)
      .attr('width', 0)
      .transition()
      .duration(500) // Transition duration
      .attr('x', (d: any) => (d.cars < 0 ? width / 2 : width / 2 - xScale(Math.abs(d.cars))))
      .attr('width', (d: any) => xScale(Math.abs(d.cars)))

    svg.selectAll('.bar.bikes')
      .attr('x', width / 2)
      .attr('width', 0)
      .transition()
      .duration(500) // Transition duration
      .attr('x', (d: any) => (d.bikes < 0 ? width / 2 - xScale(Math.abs(d.bikes)) : width / 2))
      .attr('width', (d: any) => xScale(Math.abs(d.bikes)))



    svg.selectAll('.bar.bikes')
      .transition()
      .duration(500) // Transition duration
      .attr('x', width / 2)
      .attr('width', (d: any) => xScale(Math.abs(d.bikes)))

    svg.append('line')
      .attr('x1', width / 2)
      .attr('y1', 0)
      .attr('x2', width / 2)
      .attr('y2', height)
      .style('stroke', 'black')
      .style('stroke-width', 1)

    xScale.range([0, width])
    const xAxis = d3.axisBottom(xScale).ticks(9)
    const yAxis = d3.axisLeft(yScale)

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .transition()
      .duration(500)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px')

    svg.append('g')
      .transition()
      .duration(500)
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px')

    return () => {}
  }, [svgRef, height, width, selectedYear])


  // TODO: take input from range and update map accordingly.
  return (
    <div className={styles.graphSlider}>
      <div className="w-full">
      <svg
        preserveAspectRatio="xMinYMin meet"
        viewBox={`${-padding} 0 ${width + 2 * padding} ${height + 2 * padding}`}
        className={styles.graphSvg}
        ref={svgRef}
      />
      </div>
      <div className={styles.slider}>
        <input
          type="range"
          min={2011}
          max={2021}
          defaultValue={selectedYear}
          step={0.01}
          className={styles.sliderInput}
          onChange={e => setSelectedYear(e.target.valueAsNumber)}
        />
      </div>
    </div>
  )
}
