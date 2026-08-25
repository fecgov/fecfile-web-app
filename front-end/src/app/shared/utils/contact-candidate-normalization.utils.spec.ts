import { normalizeCandidateDistrict, normalizeCandidateState } from './contact-candidate-normalization.utils';

describe('contact-candidate-normalization.utils', () => {
  describe('normalizeCandidateState', () => {
    it('returns undefined for empty input or US', () => {
      expect(normalizeCandidateState()).toBeUndefined();
      expect(normalizeCandidateState('')).toBeUndefined();
      expect(normalizeCandidateState('US')).toBeUndefined();
    });

    it('returns state when not US', () => {
      expect(normalizeCandidateState('AZ')).toBe('AZ');
    });
  });

  describe('normalizeCandidateDistrict', () => {
    it('returns undefined when district is not provided', () => {
      expect(normalizeCandidateDistrict('AZ', 'H')).toBeUndefined();
      expect(normalizeCandidateDistrict('AZ', 'H', '')).toBeUndefined();
    });

    it('returns undefined for US state or Senate office', () => {
      expect(normalizeCandidateDistrict('US', 'H', '00')).toBeUndefined();
      expect(normalizeCandidateDistrict('AZ', 'S', '00')).toBeUndefined();
    });

    it('returns district for non-US House candidate', () => {
      expect(normalizeCandidateDistrict('AZ', 'H', '00')).toBe('00');
    });
  });
});