import * as d3 from 'd3'
import { GeoJsonObject } from 'geojson'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useEffect, useRef } from 'react'

const inter = Inter({ subsets: ['latin'] })

function Visualization() {
  const cityDataUrl: string = 'https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Stadtkreise?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=adm_stadtkreise_v'
  const parkingSpacesUrl: string = 'https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Oeffentlich_zugaengliche_Strassenparkplaetze_OGD?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=view_pp_ogd'

  const visualizationRef = useRef(null)
  const svgRef = useRef(null)
  const svgContentRef = useRef(null)

  let width = 800  //TODO change dynamically?
  let height = 800

  const projection = d3.geoMercator()
  const geoGenerator = d3.geoPath().projection(projection)

  useEffect(() => {
    function initVisualization() {
      // Change the svg attributes to our needs...
      visualizationD3
      .attr('width', (width)).attr('height', (height))
      .attr('viewBox', `0 0 ${width} ${height}`)
    }

    function loadData() {
      // Load map first.
      d3.json<GeoJsonObject>(cityDataUrl).then(cityRings => {
        addMap(cityRings)
  
        // Nested call, after map is loaded, fetch other data.
        d3.json<GeoJsonObject>(parkingSpacesUrl).then(publicParking => {
          // TODO: loads a lot of points. We have to group them or filter them out.
          addPublicParkingSpaces(publicParking)
        })
      })
    }
  
    function addMap(data: any) {
      // @ts-ignore
      let features = data.features
  
      // Here we "spread" out the polygons
      projection.fitSize([width, height], { 'type': 'FeatureCollection', 'features': features })
  
      // Add data to the svg container
      svgContentD3
        .append('g')
        .attr('class', 'map')
        .selectAll('path')
        .data(features)
        .enter()
        //Add a path for each element
        .append('path')
        // @ts-ignore
        .attr('d', geoGenerator)
  
      // Add the titles of the rings
      svgContentD3
        .append('g')
        .attr('class', 'labels')
        .selectAll('path')
        .data(features)
        .enter()
        .append('text')
        .attr('x', (d: any) => geoGenerator.centroid(d)[0])
        .attr('y', (d: any) => geoGenerator.centroid(d)[1])
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text((d: any) => d.properties.knr)
    }
  
    function addPublicParkingSpaces(data: any) {
      // @ts-ignore
      const features = data.features
  
      // Here we "spread" out the polygons
      projection.fitSize([width, height], { 'type': 'FeatureCollection', 'features': features })
  
      // Add data to the svg container
      svgContentD3
        .append('g')
        .attr('class', 'parking-spaces')
        .selectAll('path')
        .data(features)
        .enter()
        .append('path')
        // @ts-ignore
        .attr('d', geoGenerator)
        .style('fill', 'blue')
    }
  
    // TODO: handleZoom is very simple. Could be optimized.
    function handleZoom(e: any) {
      svgContentD3.attr('transform', e.transform)
      if (typeof e.preventDefault !== 'undefined' && typeof e.preventDefault === 'function') {
        e.preventDefault()
      }
    }
  
    function initZoom() {
      const zoom = d3.zoom<SVGGElement, unknown>().on('zoom', handleZoom)
      // @ts-ignore
      svgD3.call(zoom)
    }
    
    const visualizationD3 = d3.select(visualizationRef.current)
    const svgD3 = d3.select(svgRef.current)
    const svgContentD3 = d3.select(svgContentRef.current)

    initVisualization()
    loadData()
    initZoom()
  }, [visualizationRef, svgRef, svgContentRef])

  // TODO: onclick is just a band aid fix. How to load it automatically?
  return (
    <div ref={visualizationRef} className="visualization">
      <svg ref={svgRef} className="visualization-svg" width="800px" height="800px">
        <g ref={svgContentRef} className="visualization-svg-content"></g>
      </svg>
    </div>
  )
}

function Option() {
  return (
    <a
      href="#"
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      rel="noopener noreferrer"
    >
      <h2 className="mb-3 text-2xl font-semibold">
        Option
      </h2>
      <p className="m-0 max-w-[30ch] text-sm opacity-50">
        Find more.
      </p>
    </a>
  )
}

export default function Home() {
  const title = 'Zurich Parking Spaces'
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Head>
        <title>{title}</title>
      </Head>
      <div className="relative flex place-items-center flex-col">
        <h1 className="mb-3 text-5xl font-semibold">{title}</h1>
        <Visualization />
      </div>
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Option />
        <Option />
        <Option />
        <Option />
      </div>
    </main>
  )
}
