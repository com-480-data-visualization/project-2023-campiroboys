import * as d3 from 'd3'
import { FeatureCollection } from 'geojson'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

function useFeatureCollection(url: string) {
  const [data, setData] = useState<FeatureCollection | null>(null)

  useEffect(() => {
    async function startFetching() {
      const data = await d3.json<FeatureCollection>(url)

      // Avoid possible race conditions
      if (!ignore) {
        setData(data ?? null)
      }
    }

    let ignore = false
    startFetching()
    return () => {
      ignore = true
    }
  }, [url])

  return data
}

function Visualization() {
  const cityDataUrl = 'https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Stadtkreise?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=adm_stadtkreise_v'
  const parkingSpacesUrl = 'https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Oeffentlich_zugaengliche_Strassenparkplaetze_OGD?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=view_pp_ogd'

  const svgRef = useRef(null)
  const svgContentRef = useRef(null)
  const svgMapRef = useRef(null)

  // TODO: change dynamically?
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(800)

  // TODO: Cache the data
  const cityRings = useFeatureCollection(cityDataUrl)
  const publicParking = useFeatureCollection(parkingSpacesUrl)

  useEffect(() => {
    // TODO: handleZoom is very simple. Could be optimized.
    function handleZoom(e: any) {
      svgContentD3.attr('transform', e.transform)
      if (typeof e.preventDefault === 'function') {
        e.preventDefault()
      }
    }

    function initSvg() {
      // Change the svg attributes to our needs...
      svgD3
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', `0 0 ${width} ${height}`)

      const zoom = d3.zoom<SVGGElement, unknown>().on('zoom', handleZoom)
      // @ts-ignore
      svgD3.call(zoom)
    }

    function initSvgContent() {
      if (!publicParking) {
        return
      }

      const features = publicParking.features

      // Here we "spread" out the polygons
      projection.fitSize([width, height], publicParking)

      // Add data to the svg container
      svgContentD3
        .append('g')
        .attr('class', 'parking-spaces')
        .selectAll('path')
        .data(features)
        .enter()
        // Add a path for each element
        .append('path')
        .attr('d', geoGenerator)
        .style('fill', 'blue')
    }

    function initMap() {
      if (!cityRings) {
        return
      }

      const features = cityRings.features

      // Here we "spread" out the polygons
      projection.fitSize([width, height], cityRings)

      // Add data to the svg container
      svgMapD3
        .append('g')
        .attr('class', 'rings')
        .selectAll('path')
        .data(features)
        .enter()
        // Add a path for each element
        .append('path')
        .attr('d', geoGenerator)

      // Add the titles of the rings
      svgMapD3
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

    const svgD3 = d3.select(svgRef.current)
    const svgContentD3 = d3.select(svgContentRef.current)
    const svgMapD3 = d3.select(svgMapRef.current)

    const projection = d3.geoMercator()
    const geoGenerator = d3.geoPath().projection(projection)

    initSvg()
    //initSvgContent()
    initMap()
  }, [svgRef, svgContentRef, svgMapRef, width, height, cityRings, publicParking])

  return (
    <div className="visualization w-5/12">
      <svg ref={svgRef} className="visualization-svg">
        <g ref={svgContentRef} className="visualization-svg-content">
          <g ref={svgMapRef} className="visualization-svg-map"></g>
        </g>
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
      className={`flex min-h-screen flex-col items-center justify-between p-6 ${inter.className}`}
    >
      <Head>
        <title>{title}</title>
      </Head>
      <div className="relative flex place-items-center flex-col w-full">
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
