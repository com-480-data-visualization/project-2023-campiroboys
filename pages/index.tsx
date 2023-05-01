import Head from 'next/head'
import { Inter } from 'next/font/google'
import * as d3 from 'd3';
import rewind from "@turf/rewind";
import { GeoJsonObject } from "geojson";

const inter = Inter({ subsets: ['latin'] })

const cityData: string = "https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Stadtkreise?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=adm_stadtkreise_v"
const parkingSpaces: string = "https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Oeffentlich_zugaengliche_Strassenparkplaetze_OGD?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=view_pp_ogd"

function Map() {

  // TODO: constructor or similar to init data etc?
  // The code could then be much cleaner as we could initialise d3.select(svg), ... there.

  function initAll() {
    loadData();
    initZoom();
  }

  let width = 800
  let height = 800

  let projection = d3.geoMercator();
  let geoGenerator = d3.geoPath().projection(projection);

  let svg = undefined;
  let svgContainer = undefined;

  let cityRingsData = undefined;



  function loadData() {
    Promise.all([
      d3.json<GeoJsonObject>(
        "https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Stadtkreise?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=adm_stadtkreise_v"
      ),
      d3.json<GeoJsonObject>(
        "https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Oeffentlich_zugaengliche_Strassenparkplaetze_OGD?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=view_pp_ogd"
      )
      // add more data to load if necessary
    ]).then(([cityRings, publicParking]) => {

      cityRingsData = cityRings;

      addGeoJSONData(cityRings);
      // TODO: loads a lot of points. Maybe we have to group them or filter them out.
      addGeoJSONData(publicParking);
    });
  }

  function addGeoJSONData(data: any) {
    // @ts-ignore
    let features = data.features;

    // Apparently D3 uses ellipsoidal math. We do some fixing of the features to be able to display them
    let fixed = features.map((feature: any) => {
      return rewind(feature, {reverse: true});
    });

    // Here we "spread" out the polygons
    projection.fitSize([width, height], {"type": "FeatureCollection", "features": fixed})

    // Change the svg attributes to our needs...
    svg = d3.select('#map')
      .attr("width", (width)).attr("height", (height))
      .attr("viewBox", "0 0 " + (width) + " " + (height))

    // Add data to the svg container
    svgContainer = d3.select('#map g.svgContainer')
      .selectAll('path')
      .data(fixed)
      .enter()
      .append('path')
      // @ts-ignore
      .attr('d', geoGenerator)
      .style('fill', 'white')
  }


  // TODO: handleZoom is very simple. Could be optimized.
  function handleZoom(e: any) {
    d3.select('svg g.svgContainer').attr('transform', e.transform);
  }

  function initZoom() {
    let zoom = d3.zoom<SVGGElement, unknown>().on('zoom', handleZoom);
    d3.select('svg').call(zoom);
  }


  return (
    <div id="map" onClick={initAll}>
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
