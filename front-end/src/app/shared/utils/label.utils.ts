export type LabelList = string[][];
export type PrimeOptions = { label: string; value: string }[];

/**
 * Class to provide utilities for options lists
 * Methods called statically
 */
export class LabelUtils {
  /**
   * For a given key, return a LabelList pair
   * @param {LabelList} labelArrays
   * @param {string | null} key
   * @returns
   */
  public static get(labelArrays: LabelList, key: string | undefined): string {
    if (key) {
      const items: LabelList = labelArrays.filter((item: string[]) => item[0] === key);
      if (items.length) {
        return items[0][1];
      }
    }
    return '';
  }

  /**
   * Convert a LabelList to a javascript Map
   * @param labelArrays
   * @returns {Map<string, string}>
   */
  public static getMap(labelArrays: LabelList): Map<string, string> {
    const labelMap = new Map();
    labelArrays.forEach((item: string[]) => labelMap.set(item[0], item[1]));
    return labelMap;
  }

  /**
   * Get a list of options formatted so that it can be used easily in a
   * PrimeNG dropdown
   * @param {LabelList} labelArrays
   * @returns {PrimeOptions}
   */
  public static getPrimeOptions(labelArrays: LabelList, values?: string[]): PrimeOptions {
    if (values) {
      return values.map((type: string) => ({
        label: LabelUtils.get(labelArrays, type),
        value: type,
      }));
    } else {
      return labelArrays.map((item: string[]) => ({
        label: item[1],
        value: item[0],
      }));
    }
  }

  /**
   * Get a listing of the congressional districts for a given state
   * @param {string} state - 2-letter code
   * @returns {LabelList}
   */
  public static getCongressionalDistrictLabels(state: string): LabelList {
    const numberOfDistricts: number = CongressionalDistricts[state];
    if (numberOfDistricts === 0) {
      return [['00', '00']];
    }

    const labelList: LabelList = [];
    for (let i = 1; i <= numberOfDistricts; i++) {
      const district: string = String(i).padStart(2, '0');
      labelList.push([district, district]);
    }
    return labelList;
  }

  /**
   * Returns the state listing without the military and foreign country entries
   * @returns {LabelList}
   */
  public static getStateCodeLabelsWithoutMilitary(): LabelList {
    return StatesCodeLabels.filter((list: string[]) => !['AA', 'AE', 'AP', 'ZZ'].includes(list[0]));
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
  ['FL', 'Florida'],
  ['ZZ', 'Foreign Countries'],
  ['GA', 'Georgia'],
  ['GU', 'Guam'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
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
  ['MP', 'Northern Mariana Islands'],
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
  ['VI', 'U.S. Virgin Islands'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
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

const CongressionalDistricts: Record<string, number> = {
  AL: 7,
  AK: 1,
  AS: 0,
  AZ: 9,
  AR: 4,
  CA: 52,
  CO: 8,
  CT: 8,
  DE: 1,
  DC: 0,
  FL: 28,
  GA: 14,
  GU: 0,
  HI: 2,
  ID: 2,
  IL: 17,
  IN: 9,
  IA: 4,
  KS: 4,
  KY: 6,
  LA: 6,
  ME: 2,
  MD: 8,
  MA: 9,
  MI: 13,
  MN: 8,
  MS: 4,
  MO: 8,
  MT: 2,
  NE: 3,
  NV: 4,
  NH: 2,
  NJ: 12,
  NM: 3,
  NY: 26,
  NC: 14,
  ND: 1,
  MP: 0,
  OH: 15,
  OK: 5,
  OR: 6,
  PA: 17,
  PR: 0,
  RI: 2,
  SC: 7,
  SD: 1,
  TN: 9,
  TX: 38,
  VI: 0,
  UT: 4,
  VT: 1,
  VA: 11,
  WA: 10,
  WV: 2,
  WI: 8,
  WY: 1,
};

export const CategoryCodeLabels: LabelList = [
  ['001', '001 Administrative/Salary/Overhead Expenses'],
  ['002', '002 Travel Expenses - including travel reimbursement expenses'],
  ['003', '003 Solicitation and Fundraising Expenses'],
  ['004', '004 Advertising Expenses -including general public political advertising'],
  ['005', '005 Polling Expenses'],
  ['006', '006 Campaign Materials'],
  ['007', '007 Campaign Event Expenses'],
  ['008', '008 Transfers'],
  ['009', '009 Loan Repayments'],
  ['010', '010 Refunds of Contributions'],
  ['011', '011 Political Contributions'],
  ['012', '012 Donations'],
];
