'use client'

import * as d3 from 'd3'
import { colorMapping } from '@/lib/color-mapping'
import { getInterpolatedCarAndBikeNumbers } from '@/lib/data'
import cd from '@/json/stadtkreise_a.json'
import styles from './visualization.module.css'
import { useEffect, useRef, useState } from 'react'
import { FeatureCollection, GeometryObject} from 'geojson'
import { FeatureCollection, GeometryObject} from 'geojson'

export type MapProps = {
  selectedYear: number
  width?: number
  height?: number
}

export default function Map(props: MapProps) {
  const { selectedYear, width = 800, height = 800 } = props

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
      .on('zoom', function(e: any) {
        svgContentD3.attr('transform', e.transform)
      })

    // Change the svg attributes to our needs...
    svgD3
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height}`)
      // @ts-ignore
      .call(zoom)

    return () => {
      zoom.on('zoom', null)
    }
  }, [svgRef, svgContentRef, width, height])

  /* Adds districts polygon and labels to the scene. Additionally, changes the color of the districts. */
  useEffect(() => {
    const svgMapD3 = d3.select(svgMapRef.current)
    const cityDistrict = cd as FeatureCollection<GeometryObject>

    const districtD3 = svgMapD3
      .append('g')

    const labelsD3 = svgMapD3
      .append('g')

    // Here we "spread" out the polygons
    projection.fitSize([width, height], cityDistrict)

    // Add data to the svg container
    districtD3
      .selectAll('path')
      .data(cityDistrict.features)
      .enter()
      // Add a path for each element
      .append('path')
      .attr('class', styles.svgDistrict)
      .attr('d', geoGenerator)

    // Add the titles of the districts
    labelsD3
      .selectAll('path')
      .data(cityDistrict.features)
      .enter()
      .append('text')
      .attr('x', (d: any) => geoGenerator.centroid(d)[0])
      .attr('y', (d: any) => geoGenerator.centroid(d)[1])
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text((d: any) => d.properties.knr)

    // Color each polygon according to the matrix
    d3.select(svgMapRef.current).selectAll('path')
      .attr('style', (d: any) => {
        let entry = getInterpolatedCarAndBikeNumbers(selectedYear, d.properties.knr)
        let color = colorMapping(entry?.cars ?? 0 ,entry?.bikes ?? 0)
        return `fill:${color}`
      })

    return () => {
      districtD3.remove()
      labelsD3.remove()
    }
  }, [selectedYear, width, height, svgMapRef, projection, geoGenerator])

  return (
    <div>
      <svg ref={svgRef} className="w-full">
        <g ref={svgContentRef} className={styles.svgContent}>
          <g ref={svgMapRef}></g>
        </g>
      </svg>
    </div>
  )
}