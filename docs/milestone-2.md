# Milestone 2

The goal of the project is to visualize the changes in parking spaces in the city of Zurich over time. We will focus on the effects of the recent change in parking space laws in the city of Zurich. Specifically we will also compare car parking spaces to 2-wheel parking spaces. We will use the data from the city of Zurich website and visualize it on a map of Zurich. We will try to also compare the data to some other data points, such as the population of the districts of Zurich. This data is available here [^3].

## Sketches of Visualizations

Below are a few sketches of possible visualizations. We will probably use a combination of these visualizations.

#### Points

[![Sketches](assets/Sketch_Points.drawio.png)](assets/Sketch_Points.drawio.png)

This is the approach that theoretically displays the most information. Each parking space is represented by a dot, where the color represents the type of parking space (car or 2-wheel). The user can possibly hover over a dot to get some more information. Below the map is a timeline, showing the change in parking spaces over time. The user can use the slider to select which point in time to display.

#### Combination with other variables

[![Sketches](assets/Sketch_Gradient.drawio.png)](assets/Sketch_Gradient.drawio.png)

This visualization combines the number of parking spaces with a different variable, such as the population of the district. The user can select which variable to display. The user can also select which point in time to display.

#### Change over time

[![Sketches](assets/Sketch_Arrows.drawio.png)](assets/Sketch_Arrows.drawio.png)

In this visualization, the user can select a range of time. The map will display the change in parking spaces over that time period.

#### Bivariate Pie diagram

[![Sketches](assets/Sketch_Pie.drawio.png)](assets/Sketch_Pie.drawio.png)

In this visualization, the user can select a point in time. The map will display the number of parking spaces per district. The ration between the different types of parking spaces is displayed as a pie diagram. The size of the pie diagram represents the number of parking spaces in the district.

#### Bivariate 2-dimensional Color Palette

[![Sketches](assets/Sketch_BivarPal.drawio.png)](assets/Sketch_BivarPal.drawio.png)

In this visualization, the color palette is two-dimensional, allowing to show both types of parking spaces at the same time with a single color. With this approach, the color palette needs to be chosen very carefully.

#### Simple Time Diagram

[![Sketches](assets/Sketch_Simple_Time.drawio.png)](assets/Sketch_Simple_Time.drawio.png)

In this visualization, we show the whole timeline, and display the change in parking spaces over time.

#### Snapshot in Time per District (Kreis)

[![Sketches](assets/Sketch_Snapshot_Distr.drawio.png)](assets/Sketch_Snapshot_Distr.drawio.png)

#### Change in Time overall, per District on Hover

[![Sketches](assets/Sketch_Hover.drawio.png)](assets/Sketch_Hover.drawio.png)

This visualization shows the number of parking spaces over time (per year). When the user hovers over a specific year, the bars expand and split into bars for each district to give more information.

## Lectures and Tools

### Tools

We plan to use the **React** framework for the website and the **D3.js** library for the visualizations. We will also use the JavaScript programming language.
We will use data in the GeoJSON format for the maps, which can be used to create interactive maps with D3.js. Since we can query the data in the GeoJSON format from the city of Zurich website, we do not need to have a dedicated backend.

### Lectures

* Lecture: **Maps** and Lecture: **Practical Maps**
  For general map visualization and interaction.
* Lecture: **Perception colors**
  To have a good color scheme for the visualizations.
* Lecture: **D3.js**
  Interactive visualizations.
* Lecture: JavaScript

## Breakdown of goal into independent pieces. (Minimal viable product, and optional extensions)

1. Website "skeleton"
2. Map of Zurich
3. Show parking spaces on map
4. Show parking spaces over time

### Optional extensions

5. Show parking spaces per capita
6. Tooltips when hovering over districts or parking spaces.

[^3]: https://data.stadt-zuerich.ch/dataset/bev_bestand_jahr_quartier_od3240
