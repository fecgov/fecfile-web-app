import { LabelPipe } from './label.pipe';
import { StatesCodeLabels } from '../utils/label.utils';

describe('LabelPipe', () => {
  let pipe: LabelPipe;

  beforeEach(() => {
    pipe = new LabelPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms should return the label', () => {
    expect(pipe.transform('AL', StatesCodeLabels)).toBe('Alabama');
  });

  it('transforms should return empty string if no label found', () => {
    expect(pipe.transform('does-not-exist', StatesCodeLabels)).toBe('');
  });
});
