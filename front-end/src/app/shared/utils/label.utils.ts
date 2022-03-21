export type LabelList = string[][];

export type PrimeOptions = { name: string; code: string }[];

export class LabelUtils {
  public static get(labelArrays: LabelList, key: string): string {
    return labelArrays.filter((item: string[]) => item[0] === key)[0][1];
  }

  public static getMap(labelArrays: LabelList): Map<string, string> {
    const labelMap = new Map();
    labelArrays.forEach((item: string[]) => labelMap.set(item[0], item[1]));
    return labelMap;
  }

  public static getPrimeOptions(labelArrays: LabelList): PrimeOptions {
    let options: PrimeOptions = [];
    options = labelArrays.map((item: string[]) => ({ name: item[1], code: item[0] }));
    return options;
  }
}

export const StatesCodeLabels: LabelList = [
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AS', 'American Samoa'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['AA', 'Armed Forces Americas'],
  ['AE', 'Armed Forces Europe'],
  ['AP', 'Armed Forces Pacific'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['DC', 'District of Columbia'],
  ['ZZ', 'Foreign Countries'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['GU', 'Guam'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentuky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['PR', 'Puerto Rico'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VI', 'Virgin Islands'],
  ['VA', 'Virginia'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
];

export const CountryCodeLabels: LabelList = [
  ['USA', 'United States of America'],
  ['CAN', 'Canada'],
  ['MEX', 'Mexico'],
];
