import { LabelList, LabelUtils, PrimeOptions, StatesCodeLabels } from './label.utils';

describe('LabelUtils', () => {
  it('should create an instance', () => {
    expect(new LabelUtils()).toBeTruthy();
  });

  it('#get() should return a label from the label list', () => {
    let label: string = LabelUtils.get(StatesCodeLabels, 'VA');
    expect(label).toBe('Virginia');
    label = LabelUtils.get(StatesCodeLabels, 'MP');
    expect(label).toBe('Northern Mariana Islands');
    label = LabelUtils.get(StatesCodeLabels, 'does-not-exist');
    expect(label).toBe('');
  });

  it('#geMap() should return a Map the label list', () => {
    const labelMap: Map<string, string> = LabelUtils.getMap(StatesCodeLabels);
    expect(labelMap.get('VA')).toBe('Virginia');
    expect(labelMap.get('MP')).toBe('Northern Mariana Islands');
    expect(labelMap.get('does-not-exist')).toBe(undefined);
  });

  it('#getPrimeOptions() should return a PrimeOptions type of the label list', () => {
    const options: PrimeOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    let option: PrimeOptions = options.filter((item) => item.value === 'VA');
    expect(option[0].label).toBe('Virginia');
    option = options.filter((item) => item.value === 'MP');
    expect(option[0].label).toBe('Northern Mariana Islands');
    option = options.filter((item) => item.value === 'does-not-exist');
    expect(option.length).toBe(0);
  });

  it('#getCongressionalDistrictLabels() should return a congression district list for a given state', () => {
    let districts: LabelList = LabelUtils.getCongressionalDistrictLabels('VA');
    expect(districts.length).toBe(11);
    expect(districts[1][0]).toBe('02');
    districts = LabelUtils.getCongressionalDistrictLabels('MP');
    expect(districts.length).toBe(1);
    expect(districts[0][0]).toBe('00');
    districts = LabelUtils.getCongressionalDistrictLabels('does-not-exist');
    expect(districts.length).toBe(0);
  });

  it('#getStateCodeLabelsWithoutMilitary() should return the state listing without the military and foreign country entries', () => {
    const states: LabelList = LabelUtils.getStateCodeLabelsWithoutMilitary();
    expect(states[2][0]).toBe('AS');
    expect(states[5][0]).toBe('CA'); // This should be AA if military included
  });
});
