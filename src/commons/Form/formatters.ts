export const CommonFormatters = {
  expiryToServer: (value: string | null) => {
    if (!value) return value;
    if (isNaN(Date.parse(`01/${value}`))) return value;
    let [month, twoDigitYear] = value.split('/');
    if (twoDigitYear.length > 2){
      twoDigitYear = twoDigitYear.slice(2);
    }
    const year =  `20${twoDigitYear}`;
    return `${year}-${month.padStart(2, '0')}-01`;
  },
  expiry: (value:string | null) => {
    if (!value) return null;
    let result = value
      .replace(
        /^([1-9]\/|[2-9])$/g,
        '0$1/', // 3 > 03/
      )
      .replace(
        /^([0]+)\/|[0]+$/g,
        '0', // 0/ > 0 and 00 > 0
      )
      .replace(
        /[^\d\/]|^[\/]*$/g,
        '', // To allow only digits and `/`
      )
      .replace(
        /\/\//g,
        '/', // Prevent entering more than 1 `/`
      )
      .replace(
        /^(0[1-9]|1[0-2])$/g,
        '$1/', // 11 > 11/
      )
      .replace(
        /^([0-1])([3-9])$/g,
        '0$1/$2', // 13 > 01/3
      )
      .replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
        '$1/$2', // 141 > 01/41
      );
    result = result.substring(0, 5);
    return result;
  },
};