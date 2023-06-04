const fs = require('fs')
const bike_2017 = require('./bike_2017.json')
const bike_2019 = require('./bike_2019.json')
const bike_2021 = require('./bike_2021.json')
const car_2011 = require('./car_2011.json')
const car_2013 = require('./car_2013.json')
const car_2015 = require('./car_2015.json')
const car_2017 = require('./car_2017.json')
const car_2019 = require('./car_2019.json')
const car_2021 = require('./car_2021.json')

a = {'2011':{'cars':car_2011},'2013':{'cars':car_2013},'2015':{'cars':car_2015},'2017':{'cars':car_2017,'bikes':bike_2017},'2019':{'cars':car_2019,'bikes':bike_2019},'2021':{'cars':car_2021,'bikes':bike_2021}}

fs.writeFile('./points.json', JSON.stringify(a, null, 2), (err) => {
  if (err)
    console.log(err)
})
