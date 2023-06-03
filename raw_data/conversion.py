import shapefile
import geopandas
import os


# loop through all folders in the raw_data folder
rootdir = '4wheel'
for folder in os.listdir(rootdir):
    folder_path = rootdir + "/" + folder
    for file in os.listdir(folder_path):
        if file.endswith('.shp'):
            file_path = folder_path + '/' + file
            shp_file = geopandas.read_file(file_path)
            shp_file.to_file(file_path.rstrip(".shp") +
                             '.geojson', driver='GeoJSON')
