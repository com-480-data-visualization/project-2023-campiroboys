'use client'

import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import { DataEntry, getInterpolatedDataEntries } from './data'
import { colorPalette } from './colorMapping'

export default function SnapshotInTime() {
  const svgRef = useRef(null)

  const [width, setWidth] = useState(600)
  const [height, setHeight] = useState(400)

  const padding = 20

  const [selectedYear, setSelectedYear] = useState(2021)

  let xScale: d3.ScaleLinear<number, number>
  let yScale: d3.ScaleBand<string>


  useEffect(() => {
    const svgD3 = d3.select(svgRef.current)
    svgD3
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `${-padding} 0 ${width + 2 * padding} ${height + 2 * padding}`)
  }, [svgRef, width, height])

  useEffect(() => {

    // Set up the SVG container
    const data: DataEntry[] = getInterpolatedDataEntries(selectedYear);

    // Set up the SVG container
    const svg = d3.select(svgRef.current)

    svg.selectAll("*").remove()

    // Set up scales
    xScale = d3.scaleLinear()
      .domain([-d3.max(data, d => d.cars)!,
      d3.max(data, d => d.cars)!])
      .range([0, width / 2])

    yScale = d3.scaleBand()
      .domain(data.map(d => d.knr))
      .range([0, height])
      .padding(0.2)


    svg.selectAll(".bar.cars")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar cars")
      .attr("x", d => width / 2 - xScale(Math.abs(d.cars)))
      .attr("y", (d: DataEntry) => yScale(d.knr)!)
      .attr("width", d => xScale(Math.abs(d.cars)))
      .attr("height", yScale.bandwidth())
      .style("fill", colorPalette.c1)



    svg.selectAll(".bar.bikes")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar bikes")
      .attr("x", width / 2)
      .attr("y", (d: DataEntry) => yScale(d.knr)!)
      .attr("width", (d:any) => xScale(Math.abs(d.bikes)))
      .attr("height", yScale.bandwidth())
      .style("fill", colorPalette.c9)

    // Apply transition to update bar lengths
    svg.selectAll(".bar.cars")
      .attr("x", width / 2)
      .attr("width", 0)
      .transition()
      .duration(500) // Transition duration
      .attr("x", (d: any) => (d.cars < 0 ? width / 2 : width / 2 - xScale(Math.abs(d.cars))))
      .attr("width", (d: any) => xScale(Math.abs(d.cars)))

    svg.selectAll(".bar.bikes")
      .attr("x", width / 2)
      .attr("width", 0)
      .transition()
      .duration(500) // Transition duration
      .attr("x", (d: any) => (d.bikes < 0 ? width / 2 - xScale(Math.abs(d.bikes)) : width / 2))
      .attr("width", (d: any) => xScale(Math.abs(d.bikes)))



    svg.selectAll(".bar.bikes")
      .transition()
      .duration(500) // Transition duration
      .attr("x", width / 2)
      .attr("width", (d: any) => xScale(Math.abs(d.bikes)))

    svg.append("line")
      .attr("x1", width / 2)
      .attr("y1", 0)
      .attr("x2", width / 2)
      .attr("y2", height)
      .style("stroke", "black")
      .style("stroke-width", 1)

    xScale.range([0, width])
    const xAxis = d3.axisBottom(xScale).ticks(9)
    const yAxis = d3.axisLeft(yScale)

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .transition()
      .duration(500)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "12px")

    svg.append("g")
      .transition()
      .duration(500)
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px")

    return () => {
    }

  }, [svgRef, height, width, selectedYear])


  // TODO: take input from range and update map accordingly.
  return (
    <div>
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
  )
}
