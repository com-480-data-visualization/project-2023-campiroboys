'use client'

import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import { colorPalette } from '@/lib/color-mapping'
import Visualization from './visualization'

export default function Slider() {
  const svgRef = useRef(null)

  const [width, setWidth] = useState(1200)
  const [height, setHeight] = useState(200)

  const padding = 20

  const [selectedYear, setSelectedYear] = useState("2023")

  useEffect(() => {
    const svgD3 = d3.select(svgRef.current)
    svgD3
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `${-padding} 0 ${width + padding} ${height + 3 * padding}`)
  }, [svgRef, width, height])

  useEffect(() => {

    /* Sample data, replace with correct one. */
    // TODO: Fetch data from API
    type FilteredData = {
      year: number,
      cars: number,
      bikes: number
      value?: number,
    }

    const data: FilteredData[] = [
      { year: 2015, cars: 1500, bikes: 1900 },
      { year: 2016, cars: 1600, bikes: 1250 },
      { year: 2017, cars: 1700, bikes: 1300 },
      { year: 2018, cars: 1800, bikes: 1350 },
      { year: 2019, cars: 1500, bikes: 1400 },
      { year: 2020, cars: 1950, bikes: 1250 },
      { year: 2021, cars: 1700, bikes: 1500 },
      { year: 2022, cars: 1790, bikes: 1900 },
      { year: 2023, cars: 2000, bikes: 1750 }
    ]

    const svg = d3.select(svgRef.current)
      .append('g')

    const xScale = d3.scaleLinear()
      .domain([2015, 2023])
      .range([padding, width - padding])

    const yScale = d3.scaleLinear()
      .domain([1000, 2000])
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

    const lineGenerator = d3.line<FilteredData>()
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
            <input type="range" min="2015" max="2023" defaultValue={selectedYear} step="1"
              onChange={e => setSelectedYear(e.target.value.toString())}></input>
          </div>
        </div>
      </div>
    </div>
  )
}
