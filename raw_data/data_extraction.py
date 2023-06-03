import os
import geopandas
import json


### Constants ###
reference_coordinates = "epsg:2056"




def get_district_name(district_data: geopandas.GeoDataFrame, point: geopandas.GeoSeries) -> str:
    """
    Returns the name of the district in which the point is located.
    :param point: geopandas.GeoSeries
    :return: str
    """
    for index, row in district_data.iterrows():
        if row.geometry.contains(point):
            return row["name"]
    return "not found"


def count_points_per_district(district_data: geopandas.GeoDataFrame, points: geopandas.GeoDataFrame) -> dict:
    """
    Returns a dictionary with the number of points per district.
    :param points: geojson.Geodataframe
    :return: dict
    """
    district_count = {}
    for index, row in points.iterrows():
        district = get_district_name(district_data, row.geometry)
        count = 1
        if "ANZ_PP" in row.keys():
            count = row["ANZ_PP"]

        if district in district_count:
            district_count[district] += count
        else:
            district_count[district] = count
    return district_count

def combine_dicts(data):
    result = {}
    for year, values in data.items():
        year_dict = {}
        for month, entries in values.items():
            for key, value in entries.items():
                if key not in year_dict:
                    year_dict[key] = {}
                year_dict[key][month] = value
        result[year] = year_dict
    return result

# import sample wheel
# gp_2wheel = geopandas.read_file("./2wheel/2019/TBL_PP_ZWEIRAD_2019.shp")
# gp_2wheel = gp_2wheel.set_crs(reference_coordinates)

# gp_4wheel = geopandas.read_file("./4wheel/2019/TBL_PP_2019.shp")
# print(gp_4wheel)


# import districtzs
gp_districts = geopandas.read_file("./districts/stzh.adm_stadtkreise_a.shp")
gp_districts = gp_districts.set_crs(reference_coordinates)


# exit()
# import data

year_dicts = {}

rootdir = '2wheel'
for folder in os.listdir(rootdir):
    folder_path = rootdir + "/" + folder
    for file in os.listdir(folder_path):
        if file.endswith('.shp'):
            file_path = folder_path + '/' + file
            shp_file = geopandas.read_file(file_path)
            shp_file = shp_file.set_crs(reference_coordinates)
            if(folder not in year_dicts):
                year_dicts[folder] = {}
            counts = count_points_per_district(gp_districts, shp_file)
            year_dicts[folder]["bikes"] = counts

rootdir = '4wheel'
for folder in os.listdir(rootdir):
    folder_path = rootdir + "/" + folder
    for file in os.listdir(folder_path):
        if file.endswith('.shp'):
            file_path = folder_path + '/' + file
            shp_file = geopandas.read_file(file_path)
            shp_file = shp_file.set_crs(reference_coordinates)
            if(folder not in year_dicts):
                year_dicts[folder] = {}
            counts = count_points_per_district(gp_districts, shp_file)
            year_dicts[folder]["cars"] = counts

year_dicts = combine_dicts(year_dicts)
json.dump(year_dicts, open("data.json", "w"))