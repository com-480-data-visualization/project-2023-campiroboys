'use client'

import * as d3 from 'd3'
import { colorMapping } from '@/lib/color-mapping'
import { getInterpolatedCarAndBikeNumbers } from '@/lib/data'
import stadtkreise from '@/json/stadtkreise_a'
import styles from './map.module.css'
import { useEffect, useRef } from 'react'

export type MapProps = {
  selectedYear: number
  width?: number
  height?: number
}

export default function Map(props: MapProps) {
  const { selectedYear, width = 400, height = 400 } = props

  const svgRef = useRef(null)
  const svgContentRef = useRef(null)
  const svgMapRef = useRef(null)

  const projection = d3.geoMercator()
  const geoGenerator = d3.geoPath().projection(projection)

  useEffect(() => {
    const svgD3 = d3.select(svgRef.current)
    const svgContentD3 = d3.select(svgContentRef.current)

    const zoom = d3.zoom<SVGGElement, any>()
      .scaleExtent([0.5, 7])  // limits zoom depth
      .translateExtent(([[0, 0], [width, height]]))  // stops users from panning to far out
      .on('zoom', function (e: any) {
        svgContentD3.attr('transform', e.transform)
      })

    // @ts-ignore
    svgD3.call(zoom)

    return () => {
      zoom.on('zoom', null)
    }
  }, [svgRef, svgContentRef, width, height])

  /* Adds districts polygon and labels to the scene. Additionally, changes the color of the districts. */
  useEffect(() => {
    const svgMapD3 = d3.select(svgMapRef.current)

    // Here we "spread" out the polygons
    projection.fitSize([width, height], stadtkreise)

    // Bind data to the svg container
    const districtPaths = svgMapD3
      .selectAll('path.district')
      .data(stadtkreise.features)

    const districtEnter = districtPaths
      .enter()
      .append('path')
      .attr('class', `district ${styles.svgDistrict}`)
      .on('mouseenter', function (event, d) {
        d3.select(this) // 'this' refers to the hovered element
          .style('stroke', 'light-grey') // border color
          .style('stroke-width', 1); // border width
      })
      .on('mouseleave', function (event, d) {
        d3.select(this)
          .style('stroke', null) // remove border color
          .style('stroke-width', null); // remove border width
      })


    districtPaths
      .merge(districtEnter as any) // apply these to both enter and update selections
      .attr('d', geoGenerator)
      .attr('style', (d: any) => {
        let entry = getInterpolatedCarAndBikeNumbers(selectedYear, d.properties.knr)
        let color = colorMapping(entry?.cars ?? 0, entry?.bikes ?? 0)
        return 'fill:' + color
      })

    districtPaths.exit().remove() // remove any elements no longer in data

    // Bind data for labels
    const labelSelection = svgMapD3
      .selectAll('text.label')
      .data(stadtkreise.features)

    const labelEnter = labelSelection
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')

    labelSelection
      .merge(labelEnter as any) // apply these to both enter and update selections
      .attr('x', (d: any) => geoGenerator.centroid(d)[0])
      .attr('y', (d: any) => geoGenerator.centroid(d)[1])
      .text((d: any) => d.properties.knr)

    labelSelection.exit().remove() // remove any elements no longer in data

  }, [selectedYear, width, height, svgMapRef, projection, geoGenerator])


  return (
    <div>
      <svg
        preserveAspectRatio="xMinYMin meet"
        viewBox={`0 0 ${width} ${height}`}
        ref={svgRef}
      >
        <g ref={svgContentRef} className={styles.svgContent}>
          <g ref={svgMapRef}></g>
        </g>
      </svg>
    </div>
  )
}
