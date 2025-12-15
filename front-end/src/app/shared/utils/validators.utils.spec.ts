import { FormControl, FormGroup } from '@angular/forms';
import {
  emailValidator,
  buildGuaranteeUniqueValuesValidator,
  buildNonOverlappingCoverageValidator,
  buildCorrespondingForm3XValidator,
  buildWithinReportDatesValidator,
  buildAfterDateValidator,
  buildReattRedesTransactionValidator,
  CommitteeMemberEmailValidator,
  F24UniqueNameValidator,
} from './validators.utils';
import { CoverageDates } from '../models/reports/base-form-3';
import { SchATransaction } from '../models/scha-transaction.model';
import { CommitteeMemberService } from '../services/committee-member.service';
import { Form24Service } from '../services/form-24.service';
import { TestBed } from '@angular/core/testing';
import { CommitteeMember } from '../models/committee-member.model';
import { Form24 } from '../models/reports/form-24.model';

describe('ValidatorsUtils', () => {
  describe('emailValidator', () => {
    it('should return null for valid email', () => {
      const control = new FormControl('test@example.com');
      expect(emailValidator(control)).toBeNull();
    });

    it('should return error for invalid email', () => {
      const control = new FormControl('invalid-email');
      expect(emailValidator(control)).toEqual({ email: 'invalid' });
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      expect(emailValidator(control)).toBeNull();
    });
  });

  describe('buildGuaranteeUniqueValuesValidator', () => {
    it('should return error if value is not unique', () => {
      const form = new FormGroup({
        primary: new FormControl('duplicate'),
        other: new FormControl('duplicate'),
      });
      const validator = buildGuaranteeUniqueValuesValidator(form, 'primary', ['other']);
      expect(validator(form)).toEqual({ error: 'not-unique' });
    });

    it('should return null if value is unique', () => {
      const form = new FormGroup({
        primary: new FormControl('unique'),
        other: new FormControl('other'),
      });
      const validator = buildGuaranteeUniqueValuesValidator(form, 'primary', ['other']);
      expect(validator(form)).toBeNull();
    });
  });

  fdescribe('buildNonOverlappingCoverageValidator', () => {
    const existingCoverage: CoverageDates[] = [
      {
        coverage_from_date: new Date('2023-01-01'),
        coverage_through_date: new Date('2023-01-31'),
        report_code_label: 'Q1',
      } as CoverageDates,
    ];

    const validator = buildNonOverlappingCoverageValidator(existingCoverage);

    it('should return error on "from" control when start date overlaps', () => {
      const group = new FormGroup({
        coverage_from_date: new FormControl(new Date('2023-01-15')),
        coverage_through_date: new FormControl(new Date('2023-02-15')),
      });

      const result = validator(group.controls['coverage_from_date']);
      expect(result).toBeTruthy();
      expect(result?.['invaliddate']).toBeTruthy();
    });

    it('should NOT return error on "through" control when only start date overlaps', () => {
      const group = new FormGroup({
        coverage_from_date: new FormControl(new Date('2023-01-15')),
        coverage_through_date: new FormControl(new Date('2023-02-15')),
      });

      const result = validator(group.controls['coverage_through_date']);
      expect(result).toBeNull();
    });

    it('should return error on "through" control when end date overlaps', () => {
      const group = new FormGroup({
        coverage_from_date: new FormControl(new Date('2022-12-15')),
        coverage_through_date: new FormControl(new Date('2023-01-15')),
      });

      const result = validator(group.controls['coverage_through_date']);
      expect(result).toBeTruthy();
      expect(result?.['invaliddate']).toBeTruthy();
    });

    it('should return error on BOTH controls when the new dates surround an existing report', () => {
      const group = new FormGroup({
        coverage_from_date: new FormControl(new Date('2022-12-01')),
        coverage_through_date: new FormControl(new Date('2023-02-28')),
      });

      const fromResult = validator(group.controls['coverage_from_date']);
      const throughResult = validator(group.controls['coverage_through_date']);

      expect(fromResult).toBeTruthy();
      expect(throughResult).toBeTruthy();
    });

    it('should return null for completely non-overlapping dates', () => {
      const group = new FormGroup({
        coverage_from_date: new FormControl(new Date('2023-02-01')),
        coverage_through_date: new FormControl(new Date('2023-02-28')),
      });

      expect(validator(group.controls['coverage_from_date'])).toBeNull();
      expect(validator(group.controls['coverage_through_date'])).toBeNull();
    });
  });

  describe('buildCorrespondingForm3XValidator', () => {
    it('should return error if no corresponding form 3x', () => {
      const form = new FormGroup({
        date1: new FormControl('2023-01-01'),
      });
      const validator = buildCorrespondingForm3XValidator(form, 'date1', 'date2');
      const control = new FormControl(null);
      expect(validator(control)).toEqual({ noCorrespondingForm3X: true });
    });

    it('should return null if corresponding form 3x exists', () => {
      const form = new FormGroup({
        date1: new FormControl('2023-01-01'),
      });
      const validator = buildCorrespondingForm3XValidator(form, 'date1', 'date2');
      const control = new FormControl('some-value');
      expect(validator(control)).toBeNull();
    });
  });

  describe('buildWithinReportDatesValidator', () => {
    const fromDate = new Date('2023-01-01');
    const throughDate = new Date('2023-01-31');

    it('should return error if date is outside range', () => {
      const validator = buildWithinReportDatesValidator(fromDate, throughDate);
      const control = new FormControl(new Date('2023-02-01'));
      const result = validator(control);
      expect(result).toBeTruthy();
      expect(result?.['invaliddate']).toBeTruthy();
    });

    it('should return null if date is within range', () => {
      const validator = buildWithinReportDatesValidator(fromDate, throughDate);
      const control = new FormControl(new Date('2023-01-15'));
      expect(validator(control)).toBeNull();
    });
  });

  describe('buildAfterDateValidator', () => {
    it('should return error if date is before other date', () => {
      const form = new FormGroup({
        otherDate: new FormControl(new Date('2023-01-31')),
      });
      const validator = buildAfterDateValidator(form, 'otherDate');
      const control = new FormControl(new Date('2023-01-01'));
      const result = validator(control);
      expect(result).toBeTruthy();
      expect(result?.['isAfter']).toBeTruthy();
    });

    it('should return null if date is after other date', () => {
      const form = new FormGroup({
        otherDate: new FormControl(new Date('2023-01-01')),
      });
      const validator = buildAfterDateValidator(form, 'otherDate');
      const control = new FormControl(new Date('2023-01-31'));
      expect(validator(control)).toBeNull();
    });
  });

  describe('buildReattRedesTransactionValidator', () => {
    it('should return error if amount is positive when mustBeNegative is true', () => {
      const transaction = { transactionType: { templateMap: { amount: 'amount' } } } as unknown as SchATransaction;
      const validator = buildReattRedesTransactionValidator(transaction, true);
      const control = new FormControl(100);
      expect(validator(control)).toEqual({ exclusiveMax: { exclusiveMax: 0 } });
    });

    it('should return error if amount is negative when mustBeNegative is false', () => {
      const transaction = { transactionType: { templateMap: { amount: 'amount' } } } as unknown as SchATransaction;
      const validator = buildReattRedesTransactionValidator(transaction, false);
      const control = new FormControl(-100);
      expect(validator(control)).toEqual({ exclusiveMin: { exclusiveMin: 0 } });
    });
  });

  describe('CommitteeMemberEmailValidator', () => {
    let service: jasmine.SpyObj<CommitteeMemberService>;
    let validator: CommitteeMemberEmailValidator;

    beforeEach(() => {
      const spy = jasmine.createSpyObj('CommitteeMemberService', ['getMembers']);
      TestBed.configureTestingModule({
        providers: [CommitteeMemberEmailValidator, { provide: CommitteeMemberService, useValue: spy }],
      });
      service = TestBed.inject(CommitteeMemberService) as jasmine.SpyObj<CommitteeMemberService>;
      validator = TestBed.inject(CommitteeMemberEmailValidator);
    });

    it('should return error if email is taken', async () => {
      const member = CommitteeMember.fromJSON({ email: 'taken@example.com' });
      service.getMembers.and.resolveTo([member]);
      const control = new FormControl('taken@example.com');
      const result = await validator.validate(control);
      expect(result).toEqual({ email: 'taken-in-committee' });
    });

    it('should return null if email is not taken', async () => {
      service.getMembers.and.resolveTo([]);
      const control = new FormControl('new@example.com');
      const result = await validator.validate(control);
      expect(result).toBeNull();
    });
  });

  describe('F24UniqueNameValidator', () => {
    let service: jasmine.SpyObj<Form24Service>;
    let validator: F24UniqueNameValidator;

    beforeEach(() => {
      const spy = jasmine.createSpyObj('Form24Service', ['getAllReports']);
      TestBed.configureTestingModule({
        providers: [F24UniqueNameValidator, { provide: Form24Service, useValue: spy }],
      });
      service = TestBed.inject(Form24Service) as jasmine.SpyObj<Form24Service>;
      validator = TestBed.inject(F24UniqueNameValidator);
    });

    it('should return error if name is duplicate', async () => {
      const report = Form24.fromJSON({ name: '24 hourreport' });
      service.getAllReports.and.resolveTo([report]);
      const control = new FormGroup({
        typeName: new FormControl('24 HOUR'),
        form24Name: new FormControl('REPORT'),
      });
      const result = await validator.validate(control);
      expect(result).toEqual({ duplicateName: true });
    });

    it('should return null if name is unique', async () => {
      service.getAllReports.and.resolveTo([]);
      const control = new FormGroup({
        typeName: new FormControl('24 HOUR'),
        form24Name: new FormControl('REPORT'),
      });
      const result = await validator.validate(control);
      expect(result).toBeNull();
    });
  });
});
