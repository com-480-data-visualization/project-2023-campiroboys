# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
|----------------|--------|
| Silas Meier        | 367460 |
| Josua Stuck    |    367491    |
| Damiano Amatruda|   353579     |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (7th April, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

We will visualize two datasets for the city of Zürich. The first dataset contains the locations and capacity of car parking spaces. The second dataset contains the locations and capacities of bicycle and motorcycle parking spaces.

The data is in CSV format, and does not need much preprocessing. Since the data is directly from the city of Zurich we expect the entries to accurate.

> Datasets:
>
> * <https://opendata.swiss/de/dataset/offentlich-zugangliche-strassenparkplatze-ogd>
> * <https://opendata.swiss/de/dataset/zweiradparkierung>

### Problematic

We will exlore the temporal axis of the data, to show if, and how much public car parking spaces have been (re)moved and or replaced by parking spaces for bicycles or motorcycles. (Since 2021, the ["Parkplatzkompromiss"](https://www.stadt-zuerich.ch/ted/de/index/taz/publikationen_u_broschueren/der-historische-kompromiss-von-1996.html) which aimed to keep the number of available car parking spaces in the inner city constant is no longer in effect.)

This visualization will be interesting for people living in the city and potentially show the results of the end of the "Parkplatzkompromiss"

### Exploratory Data Analysis

There are around 50'000 entries of car parking spaces in the dataset and around 2'000 for bicycles and motorcycles. While the dataset for bicycles and motorcycles contains grouped entries, which show the capacity of the parking spaces, the dataset for cars has an individual entry for each spot.

| Capacity | Category | Location |
| --- | ----------- | --------|
| 60 | Motorcycles | (x,y,z)
| 50 | Bicycles | (x,y,z)

| Max Parking duration | Category | Location | Paid |
| --- | ----------- | --------| ----|
| 360 | Blue zone | (x,y,z) | no |
| 60 | White zone | (x,y,z)| yes |

### Related work

There does not seem to be any previous work with the datasets in question.

Our approach is original in the sense that we consider the historical data, especially focussing on the effects of the recent change in parking space laws in the city of Zürich.


## Milestone 2 (7th May, 5pm)

**10% of the final grade**

## Milestone 3 (4th June, 5pm)

**80% of the final grade**

## Late policy

* < 24h: 80% of the grade for the milestone
* < 48h: 70% of the grade for the milestone
