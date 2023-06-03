'use client';

import * as d3 from 'd3'
import { FeatureCollection } from 'geojson'
import { useEffect, useRef, useState } from 'react'
import { Property } from "csstype";
import Filter = Property.Filter;

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
  const cityDataUrl = '/stadtkreise_test.json'
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
      const response = await fetch('/stadtkreise_test.json');
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
      { year: 2015, cars: 1500, bikes: 1900 },
      { year: 2016, cars: 1600, bikes: 1250 },
      { year: 2017, cars: 1700, bikes: 1300 },
      { year: 2018, cars: 1800, bikes: 1350 },
      { year: 2019, cars: 1500, bikes: 1400 },
      { year: 2020, cars: 1950, bikes: 1250 },
      { year: 2021, cars: 1700, bikes: 1500 },
      { year: 2022, cars: 1790, bikes: 1900 },
      { year: 2023, cars: 2000, bikes: 1750 }
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


function SnapshotInTime() {

  const svgRef = useRef(null)

  const [width, setWidth] = useState(600)
  const [height, setHeight] = useState(400)

  const padding = 20;

  const [selectedYear, setSelectedYear] = useState("2023")

  let xScale: d3.ScaleLinear<number, number>;
  let yScale: d3.ScaleBand<string>;

  /* Sample data, replace with correct one. */
  // TODO: Fetch data from API
  interface FilteredData {
    knr: string;
    cars: number;
    bikes: number;
  }

  const dataAll: any = {
    "2023": [
      { knr: "1", cars: 1500, bikes: 1900 },
      { knr: "2", cars: 1600, bikes: 1250 },
      { knr: "3", cars: 1700, bikes: 1300 },
      { knr: "4", cars: 1800, bikes: 1350 },
      { knr: "5", cars: 1500, bikes: 1400 },
      { knr: "6", cars: 1950, bikes: 1250 },
      { knr: "7", cars: 1700, bikes: 1500 },
      { knr: "8", cars: 1790, bikes: 1900 },
      { knr: "9", cars: 2000, bikes: 1750 },
      { knr: "10", cars: 1790, bikes: 1900 },
      { knr: "11", cars: 1790, bikes: 1900 },
      { knr: "12", cars: 1790, bikes: 1900 },
    ], "2022": [
      { knr: "1", cars: 1300, bikes: 3200 },
      { knr: "2", cars: 1500, bikes: 1550 },
      { knr: "3", cars: 1100, bikes: 1300 },
      { knr: "4", cars: 1800, bikes: 350 },
      { knr: "5", cars: 1100, bikes: 400 },
      { knr: "6", cars: 1950, bikes: 1250 },
      { knr: "7", cars: 1300, bikes: 1500 },
      { knr: "8", cars: 1190, bikes: 900 },
      { knr: "9", cars: 2000, bikes: 1750 },
      { knr: "10", cars: 1790, bikes: 1900 },
      { knr: "11", cars: 1790, bikes: 1900 },
      { knr: "12", cars: 1790, bikes: 1900 },
    ],
  };

  useEffect(() => {
    const svgD3 = d3.select(svgRef.current)
    svgD3
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `${-padding} 0 ${width + 2 * padding} ${height + 2 * padding}`)
  }, [svgRef, width, height]);

  useEffect(() => {

    // Set up the SVG container
    const data: FilteredData[] = dataAll[selectedYear];

    // Set up the SVG container
    const svg = d3.select(svgRef.current)

    svg.selectAll("*").remove();

    // Set up scales
    xScale = d3.scaleLinear()
      .domain([-d3.max(data, d => d.cars)!,
      d3.max(data, d => d.cars)!])
      .range([0, width / 2]);

    yScale = d3.scaleBand()
      .domain(data.map(d => d.knr))
      .range([0, height])
      .padding(0.2);


    svg.selectAll(".bar.cars")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar cars")
      .attr("x", d => width / 2 - xScale(Math.abs(d.cars)))
      .attr("y", (d: FilteredData) => yScale(d.knr)!)
      .attr("width", d => xScale(Math.abs(d.cars)))
      .attr("height", yScale.bandwidth())
      .style("fill", colorPalette.c1)



    svg.selectAll(".bar.bikes")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar bikes")
      .attr("x", width / 2)
      .attr("y", (d: FilteredData) => yScale(d.knr)!)
      .attr("width", d => xScale(Math.abs(d.bikes)))
      .attr("height", yScale.bandwidth())
      .style("fill", colorPalette.c9)

    // Apply transition to update bar lengths
    svg.selectAll(".bar.cars")
      .attr("x", width / 2)
      .attr("width", 0)
      .transition()
      .duration(500) // Transition duration
      .attr("x", (d: any) => (d.cars < 0 ? width / 2 : width / 2 - xScale(Math.abs(d.cars))))
      .attr("width", (d: any) => xScale(Math.abs(d.cars)));

    svg.selectAll(".bar.bikes")
      .attr("x", width / 2)
      .attr("width", 0)
      .transition()
      .duration(500) // Transition duration
      .attr("x", (d: any) => (d.bikes < 0 ? width / 2 - xScale(Math.abs(d.bikes)) : width / 2))
      .attr("width", (d: any) => xScale(Math.abs(d.bikes)));



    svg.selectAll(".bar.bikes")
      .transition()
      .duration(500) // Transition duration
      .attr("x", width / 2)
      .attr("width", (d: any) => xScale(Math.abs(d.bikes)));

    svg.append("line")
      .attr("x1", width / 2)
      .attr("y1", 0)
      .attr("x2", width / 2)
      .attr("y2", height)
      .style("stroke", "black")
      .style("stroke-width", 1);

    xScale.range([0, width]);
    const xAxis = d3.axisBottom(xScale).ticks(9);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .transition()
      .duration(500)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "12px");

    svg.append("g")
      .transition()
      .duration(500)
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px");

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
          <input type="range" min="2015" max="2023" defaultValue={selectedYear} step="1"
            onChange={e => setSelectedYear(e.target.value.toString())}></input>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const title = 'Zurich Parking Spaces'
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-2 md:pt-4 lg:p-2">
      <div className="relative flex place-items-center flex-col w-full">
        <div className="title">
          <h1 className="mb-3 text-3xl md:text-4xl font-semibold text-center">{title}</h1>
        </div>
        <div className="fade-in home-visualization w-full md:w-4/6 lg:w-3/6">
          <Slider />
          <hr />
          <SnapshotInTime />
        </div>
      </div>
    </main>
  )
}
