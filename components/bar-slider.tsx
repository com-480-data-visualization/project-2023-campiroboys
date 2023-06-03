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
  const [data, setData] = useState<DataEntry[]>([])

  const [selectedYear, setSelectedYear] = useState(2021)

  useEffect(() => {
    setData(getInterpolatedDataEntries(selectedYear))
  }, [selectedYear])

  useEffect(() => {

    // Set up the SVG container
    const svg = d3.select(svgRef.current)

    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([-d3.max(data, d => d.cars)!,
      d3.max(data, d => d.cars)!])
      .range([0, width / 2])

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.knr))
      .range([0, height])
      .padding(0.2)

    // Bind data
    const cars = svg.selectAll('.bar.cars').data(data);
    const bikes = svg.selectAll('.bar.bikes').data(data);

    // Update selection for cars
    cars
      .transition()
      .duration(500)
      .attr('x', (d: any) => width / 2 - xScale(Math.abs(d.cars)))
      .attr('width', (d: any) => xScale(Math.abs(d.cars)));

    // Enter selection for cars
    cars.enter()
      .append('rect')
      .attr('class', 'bar cars')
      .attr('y', (d: DataEntry) => yScale(d.knr)!)
      .attr('height', yScale.bandwidth())
      .style('fill', colorPalette.c1)
      .transition()
      .duration(500)
      .attr('x', (d: any) => width / 2 - xScale(Math.abs(d.cars)))
      .attr('width', (d: any) => xScale(Math.abs(d.cars)));

    // Exit selection for cars
    cars.exit()
      .transition()
      .duration(500)
      .attr('width', 0)
      .remove();

    // Update selection for bikes
    bikes
      .transition()
      .duration(500)
      .attr('x', width / 2)
      .attr('width', (d: any) => xScale(Math.abs(d.bikes)));

    // Enter selection for bikes
    bikes.enter()
      .append('rect')
      .attr('class', 'bar bikes')
      .attr('y', (d: DataEntry) => yScale(d.knr)!)
      .attr('height', yScale.bandwidth())
      .style('fill', colorPalette.c9)
      .transition()
      .duration(500)
      .attr('x', width / 2)
      .attr('width', (d: any) => xScale(Math.abs(d.bikes)));

    // Exit selection for bikes
    bikes.exit()
      .transition()
      .duration(500)
      .attr('width', 0)
      .remove();

    const line = svg.selectAll<SVGLineElement, null>('.center-line').data([null]);
    line.enter()
      .append('line')
      .attr('class', 'center-line')
      .merge(line)
      .attr('x1', width / 2)
      .attr('y1', 0)
      .attr('x2', width / 2)
      .attr('y2', height)
      .style('stroke', 'black')
      .style('stroke-width', 1);

    // Adjust scale for x-axis
    xScale.range([0, width])
    const xAxis = d3.axisBottom(xScale).ticks(9);

    // Update x-axis if it exists, or append a new one if it doesn't
    const xAxisGroup = svg.selectAll<SVGGElement, null>('.x-axis').data([null]);
    xAxisGroup.enter()
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .merge(xAxisGroup)
      .transition()
      .duration(500)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px');

    const yAxis = d3.axisLeft(yScale);
    // Update y-axis if it exists, or append a new one if it doesn't
    const yAxisGroup = svg.selectAll<SVGGElement, null>('.y-axis').data([null]);
    yAxisGroup.enter()
      .append('g')
      .attr('class', 'y-axis')
      .merge(yAxisGroup)
      .transition()
      .duration(500)
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px');

    return () => { }
  }, [svgRef, height, width, data])


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
