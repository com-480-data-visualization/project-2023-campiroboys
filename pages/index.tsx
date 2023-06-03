import * as d3 from 'd3'
import {FeatureCollection} from 'geojson'
import {Inter} from 'next/font/google'
import Head from 'next/head'
import {useEffect, useRef, useState} from 'react'


const inter = Inter({subsets: ['latin']})

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

let parkingData = {
  "maxCar": -1,
  "minCar": -1,
  "maxBike": -1,
  "minBike": -1
};

/**
 * Palette is of the form:
 *     c1   c2   c3
 *     c4   c5   c6
 *     c7   c8   c9
 */
const colorPalette: { [index: string]: string } = {
  "c1": "#4FA874",
  "c2": "#3A8269",
  "c3": "#275b5d",
  "c4": "#94bea4",
  "c5": "#6d8f90",
  "c6": "#4a6481",
  "c7": "#d2d2d2",
  "c8": "#999fbb",
  "c9": "#666aa4"
}

function colorMapping(numberOfCars: number, numberOfBikes: number): string {

  if (parkingData.maxCar == -1) return "#999999";

  let percentageCars = numberOfCars / parkingData.maxCar;
  let percentageBikes = numberOfBikes / parkingData.maxBike;

  if (percentageCars < (1 / 3)) {
    if (percentageBikes < (1 / 3)) return colorPalette.c7;
    if ((1 / 3) <= percentageBikes && percentageBikes < (2 / 3)) return colorPalette.c8;
    return colorPalette.c9;
  } else if ((1 / 3) <= percentageCars && percentageCars < (2 / 3)) {
    if (percentageBikes < (1 / 3)) return colorPalette.c4;
    if ((1 / 3) <= percentageBikes && percentageBikes < (2 / 3)) return colorPalette.c5;
    return colorPalette.c6;
  } else {
    if (percentageBikes < (1 / 3)) return colorPalette.c1;
    if ((1 / 3) <= percentageBikes && percentageBikes < (2 / 3)) return colorPalette.c2;
    return colorPalette.c3;
  }
}

function extractRingData(r: any) {
  let maxCar = -1;
  let minCar = -1;
  let maxBike = -1;
  let minBike = -1;

  for (const district of r.features) {
    let properties = district.properties;
    for (const [_, value] of Object.entries(properties.parkingcars)) {
      let n = Number(value);
      maxCar = maxCar == -1 || maxCar < n ? n : maxCar;
      minCar = minCar == -1 || minCar > n ? n : minCar;
    }
    for (const [_, value] of Object.entries(properties.parkingbikes)) {
      let n = Number(value);
      maxBike = maxBike == -1 || maxBike < n ? n : maxBike;
      minBike = minBike == -1 || minBike > n ? n : minBike;
    }
  }

  return {
    "maxCar": maxCar,
    "minCar": minCar,
    "maxBike": maxBike,
    "minBike": minBike
  };

}

type VisualizationProps = { selectedYear: string }

function Visualization(props: VisualizationProps) {
  const cityDataUrl = 'http://localhost:8010/index.php'
  const parkingSpacesUrl = 'https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Oeffentlich_zugaengliche_Strassenparkplaetze_OGD?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=view_pp_ogd'

  const svgRef = useRef(null)
  const svgContentRef = useRef(null)
  const svgMapRef = useRef(null)

  // TODO: change dynamically?
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(800)

  const [districtGeoJson, setDistrictGeoJson] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:8010/index.php');
      const data = await response.json();
      setDistrictGeoJson(data);
      parkingData = extractRingData(data);
    }

    fetchData();
  }, []);

  // TODO: Cache the data
  const cityDistrict = useFeatureCollection(cityDataUrl)
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

    const zoom = d3.zoom<SVGGElement, any>()
      .scaleExtent([0.5, 7])  // limits zoom depth
      .translateExtent(([[0, 0], [width, height]]))  // stops users from panning to far out
      .on('zoom', handleZoom)

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

    const districtD3 = svgMapD3
      .append('g')
      .attr('class', 'districts')

    const labelsD3 = svgMapD3
      .append('g')
      .attr('class', 'labels')

    if (cityDistrict) {
      // Here we "spread" out the polygons
      projection.fitSize([width, height], cityDistrict)

      // Add data to the svg container
      districtD3
        .selectAll('path')
        .data(cityDistrict.features)
        .enter()
        // Add a path for each element
        .append('path')
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


      /* Color each polygon according to the matrix. */
      d3.select(svgMapRef.current).selectAll('path')
        .attr('style', (d: any) => {
          let color = colorMapping(d.properties.parkingcars[props.selectedYear], d.properties.parkingbikes[props.selectedYear])
          return "fill:" + color + ";";
        })
    }

    return () => {
      districtD3.remove()
      labelsD3.remove()
    }
  }, [svgMapRef, cityDistrict, width, height, projection, geoGenerator,])


  return (
    <div>

      <div className="visualization">

        <svg ref={svgRef} className="visualization-svg w-full">
          <g ref={svgContentRef} className="visualization-svg-content">
            <g ref={svgMapRef} className="visualization-svg-map"></g>
          </g>
        </svg>
      </div>
    </div>
  )
}

function Slider() {

  const svgRef = useRef(null)

  const [width, setWidth] = useState(1200)
  const [height, setHeight] = useState(200)

  const padding = 20;

  const [selectedYear, setSelectedYear] = useState("2023")

  useEffect(() => {
    const svgD3 = d3.select(svgRef.current)
    svgD3
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `${-padding} 0 ${width + padding} ${height + 3 * padding}`)
  }, [svgRef, width, height]);

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
      {year: 2015, cars: 1500, bikes: 1900},
      {year: 2016, cars: 1600, bikes: 1250},
      {year: 2017, cars: 1700, bikes: 1300},
      {year: 2018, cars: 1800, bikes: 1350},
      {year: 2019, cars: 1500, bikes: 1400},
      {year: 2020, cars: 1950, bikes: 1250},
      {year: 2021, cars: 1700, bikes: 1500},
      {year: 2022, cars: 1790, bikes: 1900},
      {year: 2023, cars: 2000, bikes: 1750}
    ];

    const svg = d3.select(svgRef.current)
      .append('g')

    const xScale = d3.scaleLinear()
      .domain([2015, 2023])
      .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
      .domain([1000, 2000])
      .range([height, 0]);


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
      .attr("transform", "rotate(-45)");

    /* Create data lines. */

    const lineGenerator = d3.line<FilteredData>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value || 0))
      .curve(d3.curveLinear);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colorPalette.c1)
      .attr('stroke-width', 4)
      .attr('d', lineGenerator.y(d => yScale(d.cars)));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colorPalette.c9)
      .attr('stroke-width', 4)
      .attr('d', lineGenerator.y(d => yScale(d.bikes)));

    return () => {
      svg.remove()
    }
  }, [svgRef, height, width])

  // TODO: take input from range and update map accordingly.
  return (
    <div>
      <Visualization
        selectedYear={selectedYear}/>
      <br/>
      <div className="slider-wrapper">
        <div className="info-box">
          <img
            src={"/media/palette.svg"}
          />
        </div>
        <div className="slider">
          <div className="graph w-full">
            <svg ref={svgRef} className="slider-svg w-full">
            </svg>
          </div>
          <div id="year-slider">
            <input type="range" min="2015" max="2023" defaultValue={selectedYear} step="1"
                   onChange={e => setSelectedYear(e.target.value)}></input>
          </div>
        </div>
      </div>
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
        <div className="title">
          <h1 className="mb-3 text-3xl md:text-4xl font-semibold text-center">{title}</h1>
        </div>
        <div className="fade-in home-visualization w-full md:w-4/6 lg:w-3/6">
          <Slider />
        </div>

      </div>
      <div className="fade-in mb-32 grid text-center grid-cols-4 lg:mb-0 lg:text-left">
        <Option />
        <Option />
        <Option />
        <Option />
      </div>
    </main>
  )
}
