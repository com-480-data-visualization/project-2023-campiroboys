export function getDateFromYearFraction(yearFraction: number): Date {
    const year = Math.floor(yearFraction);
    const fraction = yearFraction - year;
  
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const millisecondsInYear = (isLeapYear ? 366 : 365) * 24 * 60 * 60 * 1000;
  
    const date = new Date(year, 0); // Start at Jan 1st
    date.setTime(date.getTime() + fraction * millisecondsInYear);
  
    return date;
  }