'use client'

import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import { DataEntry, getInterpolatedDataEntries } from '@/lib/data'
import { colorPalette } from '@/lib/color-mapping'

export type BarProps = {
  width?: number
  height?: number
  padding?: number
  selectedYear: number
}

export default function Bar(props: BarProps) {
  const { width = 600, height = 400, padding = 20, selectedYear } = props

  const svgRef = useRef(null)

  const data = getInterpolatedDataEntries(selectedYear)

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
    const cars = svg.selectAll('.bar.cars').data(data)
    const bikes = svg.selectAll('.bar.bikes').data(data)

    // Update selection for cars
    cars
      .transition()
      .duration(500)
      .attr('x', (d: any) => width / 2 - xScale(Math.abs(d.cars)))
      .attr('width', (d: any) => xScale(Math.abs(d.cars)))

    // Enter selection for cars
    cars.enter()
      .append('rect')
      .attr('class', 'bar cars')
      .attr('y', (d: DataEntry) => yScale(d.knr)!)
      .attr('height', yScale.bandwidth())
      .style('fill', colorPalette.c1)
      .on('mouseenter', function (event, d) { // Add event listener for mouseenter
        svg.append('text') // Add text on mouse enter
          .attr('class', 'value')
          .attr('x', () => width / 2 - xScale(Math.abs(d.cars)) / 2 + 5)
          .attr('y', () => yScale(d.knr)! + yScale.bandwidth() / 2 + 5)
          .text(() => Math.floor(d.cars))
      })
      .on('mouseleave', function () { // Add event listener for mouseleave
        svg.select('.value').remove() // Remove text on mouse leave
      })
      .transition()
      .duration(500)
      .attr('x', (d: any) => width / 2 - xScale(Math.abs(d.cars)))
      .attr('width', (d: any) => xScale(Math.abs(d.cars)))

    // Exit selection for cars
    cars.exit()
      .transition()
      .duration(500)
      .attr('width', 0)
      .remove()

    // Update selection for bikes
    bikes
      .transition()
      .duration(500)
      .attr('x', width / 2)
      .attr('width', (d: any) => xScale(Math.abs(d.bikes)))

    // Enter selection for bikes
    bikes.enter()
      .append('rect')
      .attr('class', 'bar bikes')
      .attr('y', (d: DataEntry) => yScale(d.knr)!)
      .attr('height', yScale.bandwidth())
      .style('fill', colorPalette.c9)
      .on('mouseenter', function (event, d) { // Add event listener for mouseenter
        svg.append('text') // Add text on mouse enter
          .attr('class', 'value')
          .attr('x', () => width/2 + 5) // Adjust this line
          .attr('y', () => yScale(d.knr)! + yScale.bandwidth() / 2 + 5)
          .text(() => Math.floor(d.bikes ?? 0))
      })
      .on('mouseleave', function () { // Add event listener for mouseleave
        svg.select('.value').remove() // Remove text on mouse leave
      })
      .transition()
      .duration(500)
      .attr('x', width / 2)
      .attr('width', (d: any) => xScale(Math.abs(d.bikes)))

    // Exit selection for bikes
    bikes.exit()
      .transition()
      .duration(500)
      .attr('width', 0)
      .remove()

    const line = svg.selectAll<SVGLineElement, null>('.center-line').data([null])
    line.enter()
      .append('line')
      .attr('class', 'center-line')
      .merge(line)
      .attr('x1', width / 2)
      .attr('y1', 0)
      .attr('x2', width / 2)
      .attr('y2', height)
      .style('stroke', 'black')
      .style('stroke-width', 1)

    // Adjust scale for x-axis
    xScale.range([0, width])
    // Adjust scale for x-axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(9)
      .tickFormat((d: any) => `${Math.abs(d)}`); // Display ticks as absolute values

    // Update x-axis if it exists, or append a new one if it doesn't
    const xAxisGroup = svg.selectAll<SVGGElement, null>('.x-axis').data([null])
    xAxisGroup.enter()
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .merge(xAxisGroup)
      .transition()
      .duration(500)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '1.5em')

    const yAxis = d3.axisLeft(yScale).ticks(12).tickFormat((d: any) => `District ${d}`)
    // Update y-axis if it exists, or append a new one if it doesn't
    const yAxisGroup = svg.selectAll<SVGGElement, null>('.y-axis').data([null])
    yAxisGroup.enter()
      .append('g')
      .attr('class', 'y-axis')
      .merge(yAxisGroup)
      .transition()
      .duration(500)
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '1.5em')

    return () => { }
  }, [svgRef, height, width, data])

  return (
    <div>
      <svg
        preserveAspectRatio="xMinYMin meet"
        viewBox={`${-6 * padding} 0 ${width + 8 * padding} ${height + padding}`}
        ref={svgRef}
      />
    </div>
  )
}
