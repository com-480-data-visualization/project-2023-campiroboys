import { FeatureCollection } from 'geojson'
import { parse } from 'path';
export interface DataEntry {
	knr: string;
	cars: number;
	bikes?: number;
}

interface DataAll {
	[year: string]: DataEntry[];
}

export const dataAll: DataAll = {
	"2021": [

		{ knr: "1.0", cars: 1588, bikes: 3986 },
		{ knr: "2.0", cars: 5266, bikes: 3132 },
		{ knr: "3.0", cars: 4933, bikes: 4292 },
		{ knr: "4.0", cars: 2952, bikes: 7478 },
		{ knr: "5.0", cars: 1692, bikes: 5526 },
		{ knr: "6.0", cars: 3896, bikes: 2840 },
		{ knr: "7.0", cars: 6401, bikes: 1624 },
		{ knr: "8.0", cars: 3005, bikes: 1673 },
		{ knr: "9.0", cars: 4649, bikes: 4836 },
		{ knr: "10.0", cars: 3969, bikes: 2181 },
		{ knr: "11.0", cars: 5490, bikes: 5624 },
		{ knr: "12.0", cars: 2441, bikes: 1933 },
	],
	"2019": [
		{ knr: "1.0", cars: 1604, bikes: 3870 },
		{ knr: "2.0", cars: 5603, bikes: 3745 },
		{ knr: "3.0", cars: 5153, bikes: 4666 },
		{ knr: "4.0", cars: 3097, bikes: 7228 },
		{ knr: "5.0", cars: 1847, bikes: 5448 },
		{ knr: "6.0", cars: 4004, bikes: 2958 },
		{ knr: "7.0", cars: 6499, bikes: 1766 },
		{ knr: "8.0", cars: 3122, bikes: 1935 },
		{ knr: "9.0", cars: 5023, bikes: 5491 },
		{ knr: "10.0", cars: 4118, bikes: 2188 },
		{ knr: "11.0", cars: 5817, bikes: 6328 },
		{ knr: "12.0", cars: 2770, bikes: 2044 },
	],
	"2017": [
		{ knr: "1.0", cars: 1660, bikes: 3833 },
		{ knr: "2.0", cars: 5663, bikes: 2193 },
		{ knr: "3.0", cars: 5189, bikes: 3627 },
		{ knr: "4.0", cars: 3320, bikes: 6221 },
		{ knr: "5.0", cars: 1854, bikes: 5583 },
		{ knr: "6.0", cars: 4030, bikes: 2282 },
		{ knr: "7.0", cars: 6420, bikes: 1662 },
		{ knr: "8.0", cars: 3131, bikes: 1310 },
		{ knr: "9.0", cars: 5098, bikes: 3149 },
		{ knr: "10.0", cars: 4189, bikes: 2297 },
		{ knr: "11.0", cars: 5900, bikes: 5345 },
		{ knr: "12.0", cars: 2778, bikes: 1368 },
	],
	"2013": [
		{ knr: "1.0", cars: 2158 },
		{ knr: "2.0", cars: 5868 },
		{ knr: "3.0", cars: 5198 },
		{ knr: "4.0", cars: 3305 },
		{ knr: "5.0", cars: 1910 },
		{ knr: "6.0", cars: 4191 },
		{ knr: "7.0", cars: 6405 },
		{ knr: "8.0", cars: 3169 },
		{ knr: "9.0", cars: 5003 },
		{ knr: "10.0", cars: 4328 },
		{ knr: "11.0", cars: 6093 },
		{ knr: "12.0", cars: 2733 },
	],
	"2015": [
		{ knr: "1.0", cars: 1829 },
		{ knr: "2.0", cars: 6029 },
		{ knr: "3.0", cars: 5333 },
		{ knr: "4.0", cars: 3388 },
		{ knr: "5.0", cars: 1922 },
		{ knr: "6.0", cars: 5273 },
		{ knr: "7.0", cars: 3167 },
		{ knr: "8.0", cars: 6443 },
		{ knr: "9.0", cars: 4216 },
		{ knr: "10.0", cars: 4395 },
		{ knr: "11.0", cars: 6176 },
		{ knr: "12.0", cars: 2944 },
	],
	"2011": [
		{ knr: "1.0", cars: 1983 },
		{ knr: "2.0", cars: 5914 },
		{ knr: "3.0", cars: 5414 },
		{ knr: "4.0", cars: 3239 },
		{ knr: "5.0", cars: 1816 },
		{ knr: "6.0", cars: 4267 },
		{ knr: "7.0", cars: 6417 },
		{ knr: "8.0", cars: 3090 },
		{ knr: "9.0", cars: 5248 },
		{ knr: "10.0", cars: 4468 },
		{ knr: "11.0", cars: 6263 },
		{ knr: "12.0", cars: 2735 },
	],
};

function nearestOddIntegers(n: number): [number, number] {
    // Check if number is an integer
    const isInteger = n % 1 === 0;

    // Check if number is odd
    const isOdd = n % 2 !== 0;

    if (isInteger && isOdd) {
        return [n, n];
    } else {
        const lowerOdd = Math.floor(n) % 2 === 0 ? Math.floor(n) - 1 : Math.floor(n);
        const upperOdd = Math.ceil(n) % 2 === 0 ? Math.ceil(n) + 1 : Math.ceil(n);

        return [lowerOdd, upperOdd];
    }
}


export function getInterpolatedCarAndBikeNumbers(year: number, knr: string) {
	console.log(year)
	const [yLow, yHigh] = nearestOddIntegers(year);
	console.log(yLow, yHigh);

	const entriesBefore = dataAll[yLow];
	const entriesAfter = dataAll[yHigh];

	if (entriesBefore && entriesAfter) {
		const eb = entriesBefore.find((entry) => parseInt(entry.knr) === parseInt(knr));
		const ea = entriesAfter.find((entry) => parseInt(entry.knr) === parseInt(knr));
		return {
			year: year,
			cars: eb.cars + (ea.cars - eb.cars) * (year - (yLow)),
			bikes: eb.bikes + (ea.bikes - eb.bikes) * (year - (yLow)),
		}
	}


}

export function getInterpolatedDataEntries(year: number): DataEntry[] {
	console.log(year)
	const [yLow, yHigh] = nearestOddIntegers(year);
	console.log(yLow, yHigh);
	const entriesBefore = dataAll[yLow];
	const entriesAfter = dataAll[yHigh];

	if (entriesBefore && entriesAfter) {
		return entriesBefore.map((entry) => {
			const ea = entriesAfter.find((e) => parseInt(e.knr) === parseInt(entry.knr));
			return {
				knr: entry.knr,
				cars: entry.cars + (ea.cars - entry.cars) * (year - (yLow)),
				bikes: entry.bikes + (ea.bikes - entry.bikes) * (year - (yLow)),
			}
		});
	}

	return [];
}

export interface AggregatedPerYearData {
	year: number;
	cars: number;
	bikes: number;
	value?: number;
}
const allEntries: DataEntry[] = Object.values(dataAll).flatMap((entries) => entries);
export const parkingData = {
	"maxCar": allEntries.reduce((max, entry) => Math.max(max, entry.cars), 0),
	"minCar": allEntries.reduce((min, entry) => Math.min(min, entry.cars), 999999999),
	"maxBike": allEntries.reduce((max, entry) => Math.max(max, entry.bikes ?? 0), 0),
	"minBike": allEntries.reduce((min, entry) => Math.min(min, entry.bikes ?? 999999999), 999999999),
}

export const aggPerYearData: AggregatedPerYearData[] = Object.entries(dataAll).map(([year, entries]) => {
	const sumCars = entries.reduce((total, entry) => total + entry.cars, 0);
	const sumBikes = entries.reduce(
		(total, entry) => (entry.bikes ? total + entry.bikes : total),
		0
	);

	return {
		year: parseInt(year),
		cars: sumCars,
		bikes: sumBikes,
		value: sumCars + sumBikes,
	};
});

