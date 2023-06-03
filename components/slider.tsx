'use client'

import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import Visualization from './visualization'
import { AggregatedPerYearData, DataEntry, aggPerYearData, getInterpolatedDataEntries } from './data'
import { colorPalette } from './colorMapping'

export default function Slider() {
  const svgRef = useRef(null)

  const [width, setWidth] = useState(1200)
  const [height, setHeight] = useState(200)

  const padding = 20

  const [selectedYear, setSelectedYear] = useState(2021)

  useEffect(() => {
    const svgD3 = d3.select(svgRef.current)
    svgD3
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `${-padding} 0 ${width + padding} ${height + 3 * padding}`)
  }, [svgRef, width, height])

  useEffect(() => {

    const data = aggPerYearData
    const svg = d3.select(svgRef.current)
      .append('g')

    const xScale = d3.scaleLinear()
      .domain([2011, 2021])
      .range([padding, width - padding])

    const yScale = d3.scaleLinear()
      .domain([0, 60000])
      .range([height, 0])


    /* Creates the x-axis. */
    const xAxis = d3.axisBottom(xScale)
      .tickValues(data.map(d => d.year))
      .tickFormat(d3.format('d'))
      .tickSize(0)
      .tickSizeInner(-width)

    svg.append("g")
      .attr("transform", `translate(0, ${height - 20})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .style("color", "black")
      .style("font-size", "3em")
      .attr("dx", "-0.2em")
      .attr("dy", "1.2em")
      .attr("transform", "rotate(-45)")

    /* Create data lines. */

    const lineGenerator = d3.line<AggregatedPerYearData>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value || 0))
      .curve(d3.curveLinear)

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colorPalette.c1)
      .attr('stroke-width', 4)
      .attr('d', lineGenerator.y(d => yScale(d.cars)))

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colorPalette.c9)
      .attr('stroke-width', 4)
      .attr('d', lineGenerator.y(d => yScale(d.bikes)))

    return () => {
      svg.remove()
    }
  }, [svgRef, height, width])

  // TODO: take input from range and update map accordingly.
  return (
    <div>
      <Visualization
        selectedYear={selectedYear} />
      <br />
      <div className="slider-wrapper">
        <div className="info-box">
          <img src="/palette.svg" />
        </div>
        <div className="slider">
          <div className="graph w-full">
            <svg ref={svgRef} className="slider-svg w-full">
            </svg>
          </div>
          <div id="year-slider">
            <input type="range" min="2011" max="2021" defaultValue={selectedYear} step="0.01"
              onChange={e => setSelectedYear(e.target.valueAsNumber)}></input>
          </div>
        </div>
      </div>
    </div>
  )
}
