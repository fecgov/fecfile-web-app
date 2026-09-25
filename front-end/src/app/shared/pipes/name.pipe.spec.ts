import { describe, it, expect, beforeEach } from 'vitest';
import { NamePipe } from './name.pipe';
import { Contact } from '../models/contact.model';
import { testCandidate, testCommittee, testIndividual, testOrganization } from '../utils/unit-test.utils';

describe('NamePipe', () => {
  let pipe: NamePipe;

  beforeEach(() => {
    pipe = new NamePipe();
  });

  it('should return an empty string for null or undefined input', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  describe('Entity contact types', () => {
    it('should return contact.name when contact is an entity', () => {
      const contact = testOrganization();
      expect(pipe.transform(contact)).toBe('Organization LLC');
    });

    it('should return an empty string if an entity has no name defined', () => {
      const contact = { ...testCommittee(), name: undefined } as Contact;
      expect(pipe.transform(contact)).toBe('');
    });
  });

  describe('Individual contact types', () => {
    it('should format last name and first name correctly', () => {
      const contact = { ...testCandidate(), middle_name: undefined, prefix: undefined, suffix: undefined } as Contact;
      expect(pipe.transform(contact)).toBe('Smith, Joe');
    });

    it('should include middle name when present', () => {
      const contact = { ...testIndividual(), prefix: undefined, suffix: undefined } as Contact;
      expect(pipe.transform(contact)).toBe('Smith, Joe James');
    });

    it('should append prefix when present', () => {
      const contact = { ...testIndividual(), middle_name: undefined, suffix: undefined } as Contact;
      expect(pipe.transform(contact)).toBe('Smith, Joe, Mr');
    });

    it('should append suffix when present', () => {
      const contact = { ...testIndividual(), middle_name: undefined, prefix: undefined } as Contact;
      expect(pipe.transform(contact)).toBe('Smith, Joe, Jr');
    });

    it('should format full name with all components present', () => {
      const contact = testIndividual();
      expect(pipe.transform(contact)).toBe('Smith, Joe James, Mr, Jr');
    });
  });
});
