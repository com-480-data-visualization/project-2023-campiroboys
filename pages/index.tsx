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

  const projection = d3.geoMercator()
  const geoGenerator = d3.geoPath().projection(projection)

  useEffect(() => {
    // TODO: handleZoom is very simple. Could be optimized.
    function handleZoom(e: any) {
      svgContentD3.attr('transform', e.transform)
    }

    const svgD3 = d3.select(svgRef.current)
    const svgContentD3 = d3.select(svgContentRef.current)
    
    const zoom = d3.zoom<SVGGElement, any>().on('zoom', handleZoom)

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

  useEffect(() => {
    const svgContentD3 = d3.select(svgContentRef.current)

    const parkingSpacesD3 = svgContentD3
      .append('g')
      .attr('class', 'parking-spaces')
    
    if (publicParking) {
      // TODO: Improve the performance in another way
      const features = publicParking.features.filter((_e, i) => i % 25 == 0)

      // Here we "spread" out the polygons
      projection.fitSize([width, height], publicParking)

      // Add data to the svg container
      parkingSpacesD3
        .selectAll('path')
        .data(features)
        .enter()
        // Add a path for each element
        .append('path')
        .attr('d', geoGenerator)
        .style('fill', 'blue')
    }

    return () => {
      parkingSpacesD3.remove()
    }
  }, [svgContentRef, publicParking, width, height, projection, geoGenerator])

  useEffect(() => {
    const svgMapD3 = d3.select(svgMapRef.current)

    const ringsD3 = svgMapD3
      .append('g')
      .attr('class', 'rings')
    
    const labelsD3 = svgMapD3
      .append('g')
      .attr('class', 'labels')

    if (cityRings) {
      // Here we "spread" out the polygons
      projection.fitSize([width, height], cityRings)

      // Add data to the svg container
      ringsD3
        .selectAll('path')
        .data(cityRings.features)
        .enter()
        // Add a path for each element
        .append('path')
        .attr('d', geoGenerator)

      // Add the titles of the rings
      labelsD3
        .selectAll('path')
        .data(cityRings.features)
        .enter()
        .append('text')
        .attr('x', (d: any) => geoGenerator.centroid(d)[0])
        .attr('y', (d: any) => geoGenerator.centroid(d)[1])
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text((d: any) => d.properties.knr)
    }
    
    return () => {
      ringsD3.remove()
      labelsD3.remove()
    }
  }, [svgMapRef, cityRings, width, height, projection, geoGenerator])

  return (
    <div className="visualization">
      <svg ref={svgRef} className="visualization-svg w-full">
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
        Learn more.
      </p>
    </a>
  )
}

export default function Home() {
  const title = 'Zurich Parking Spaces'
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between pt-2 md:pt-4 lg:p-2 ${inter.className}`}
    >
      <Head>
        <title>{title}</title>
      </Head>
      <div className="relative flex place-items-center flex-col w-full">
        <h1 className="mb-3 text-3xl md:text-4xl font-semibold text-center">{title}</h1>
        <div className="home-visualization w-full md:w-4/6 lg:w-3/6">
          <Visualization />
        </div>
      </div>
      <div className="mb-32 grid text-center grid-cols-4 lg:mb-0 lg:text-left">
        <Option />
        <Option />
        <Option />
        <Option />
      </div>
    </main>
  )
}
