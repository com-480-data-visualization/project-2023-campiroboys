import os
import geopandas
import json


### Constants ###
reference_coordinates = "epsg:2056"

year_dicts = {}

rootdir = '2wheel'
for folder in os.listdir(rootdir):
    folder_path = rootdir + "/" + folder
    for file in os.listdir(folder_path):
        if file.endswith('.shp'):
            file_path = folder_path + '/' + file
            shp_file = geopandas.read_file(file_path)
            shp_file = shp_file.set_crs(reference_coordinates)
            js = shp_file.to_json(to_wgs84=True)
            with open(f"bike_{folder}.json", "w") as f:
                f.write(js)

rootdir = '4wheel'
for folder in os.listdir(rootdir):
    folder_path = rootdir + "/" + folder
    for file in os.listdir(folder_path):
        if file.endswith('.shp'):
            file_path = folder_path + '/' + file
            shp_file = geopandas.read_file(file_path)
            shp_file = shp_file.set_crs(reference_coordinates)
            js = shp_file.to_json(to_wgs84=True)
            with open(f"car_{folder}.json", "w") as f:
                f.write(js)

