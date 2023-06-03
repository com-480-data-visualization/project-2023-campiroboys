# Todo List for Milestone 3

## Visualization
### Data
- [ ] Create a script that counts how many parking spaces are contained in 
      each ring and add this data to the GeoJson as a property.
- [ ] Flatten edges of the rings? They are very detailed, maybe a bit too much.
- [ ] The ring polygon contain a bug, the lake is not visible. Ring data should be changed.

### D3
- [x] Implement `Bivariate 2-dimensional Color Palette` from the Milestone2
- [x] Temporal axis to change which years to include, similar to `Change over time`.
- [ ] Clickable rings: a model/box/... is opened that shows additional data.
  - Maybe highlight the ring and show a heatmap of where the parking spaces are?
- [ ] Add the map in the background
- [x] Limit the maximum zoom

### Website
- [ ] Add a text for the "story" part of the Milestone3.
- [ ] Serve the new geoJson files.
- [ ] Add control elements (change visualization, enable map, show only car parking spaces/only bikes, ...)
- [ ] Make the code more modular. 

### Optional
- [ ] Add an animation button that goes through each year and updates the visualization.
- [ ] Add additional filters. For example: exclude paid parking, only blue zone etc.
- [ ] Show parking spaces per capita.