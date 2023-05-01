import Head from 'next/head'
import { Inter } from 'next/font/google'
import * as d3 from 'd3';
import rewind from "@turf/rewind";
import { GeoJsonObject } from "geojson";

const inter = Inter({ subsets: ['latin'] })

const stadtKreise = "https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Stadtkreise?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=adm_stadtkreise_v"


function Map() {

  let width = 800
  let height = 800

  let projection = d3.geoMercator();

  let geoGenerator = d3.geoPath().projection(projection);

  function loadData() {
    Promise.all([
      d3.json<GeoJsonObject>(
        "https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Stadtkreise?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=adm_stadtkreise_v"
      ),
      // add more data to load if necessary
    ]).then(([cityRings]) => {

      // @ts-ignore
      let features = cityRings.features;

      // Apparently D3 uses ellipsoidal math. We do some fixing of the features to be able to display them
      let fixed = features.map((feature: any) => {
        return rewind(feature, {reverse: true});
      });

      // Here we "spread" out the polygons
      projection.fitSize([width, height], {"type": "FeatureCollection", "features": fixed})

      // Change the svg attributes to our needs...
      d3.select('#map')
        .attr("width", (width)).attr("height", (height))
        .attr("viewBox", "0 0 " + (width) + " " + (height))
        .style("background-color", "white")

      // Add data to the svg container
      d3.select('#map g.svgContainer')
        .selectAll('path')
        .data(fixed)
        .enter()
        .append('path')
        // @ts-ignore
        .attr('d', geoGenerator)
        .style('fill', 'white')
    });
  }

  return (
    <div id="map" onClick={loadData}>
      <svg width="800px" height="800px">
        <g className="svgContainer"></g>
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
        <Map />
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
