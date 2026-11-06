import { ComponentFixture, TestBed } from '@angular/core/testing';
import { inputBinding, signal } from '@angular/core';
import { form, FieldTree } from '@angular/forms/signals';
import { CandidateOfficeFormComponent } from './candidate-office-form.component';
import { CandidateOfficeTypes, CandidateOfficeTypeLabels } from 'app/shared/models';
import { LabelUtils } from 'app/shared/utils/label.utils';

interface CandidateOfficeModel {
  candidate_office: CandidateOfficeTypes | null;
  candidate_state: string | null;
  candidate_district: string | null;
}

describe('CandidateOfficeFormComponent', () => {
  let fixture: ComponentFixture<CandidateOfficeFormComponent>;
  let component: CandidateOfficeFormComponent;
  let model: ReturnType<typeof signal<CandidateOfficeModel>>;
  let fields: FieldTree<CandidateOfficeModel, string | number>;

  beforeEach(async () => {
    model = signal({
      candidate_office: CandidateOfficeTypes.HOUSE,
      candidate_state: 'CA',
      candidate_district: '12',
    });

    TestBed.configureTestingModule({
      imports: [CandidateOfficeFormComponent],
    });

    fields = TestBed.runInInjectionContext(() => form(model, () => {}));
    fixture = TestBed.createComponent(CandidateOfficeFormComponent, {
      bindings: [inputBinding('fields', () => fields)],
    });
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  describe('rendering', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render the office and state inputs', () => {
      const selectInputs = fixture.nativeElement.querySelectorAll('app-select-input');

      expect(selectInputs.length).toBeGreaterThanOrEqual(2);
      expect(fixture.nativeElement.textContent).toContain('CANDIDATE OFFICE');
      expect(fixture.nativeElement.textContent).toContain('CANDIDATE STATE');
    });

    it('should expose office options', () => {
      expect(component.officeTypeOptions).toEqual(LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels));
    });

    it('should expose state options', () => {
      expect(component.stateOptions).toEqual(
        LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary()),
      );
    });
  });

  describe('districtOptions', () => {
    it('should return an empty array when the office is not House', () => {
      model.update((value) => ({ ...value, candidate_office: CandidateOfficeTypes.SENATE }));
      fixture.detectChanges();
      expect(component.districtOptions()).toEqual([]);
    });

    it('should return an empty array when the state is null', () => {
      model.update((value) => ({ ...value, candidate_state: null }));
      fixture.detectChanges();
      expect(component.districtOptions()).toEqual([]);
    });

    it('should return district options for the selected House state', () => {
      const expectedOptions = LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels('CA'));
      expect(component.districtOptions()).toEqual(expectedOptions);
    });

    it('should update district options when the state changes', () => {
      model.update((value) => ({ ...value, candidate_state: 'NY' }));
      fixture.detectChanges();
      expect(component.districtOptions()).toEqual(
        LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels('NY')),
      );
    });
  });

  describe('districtOverride', () => {
    it('should return false when the office is not House', () => {
      model.update((value) => ({ ...value, candidate_office: CandidateOfficeTypes.SENATE }));
      fixture.detectChanges();
      expect(component.districtOverride()).toBe(false);
    });

    it('should return false when the state is null', () => {
      model.update((value) => ({ ...value, candidate_state: null }));
      fixture.detectChanges();
      expect(component.districtOverride()).toBe(false);
    });

    it('should render the district override when only one district exists', () => {
      // Alaska has one congressional district.
      model.update((value) => ({ ...value, candidate_state: 'AK' }));
      fixture.detectChanges();
      expect(component.districtOverride()).toBe(true);
      const override = fixture.nativeElement.querySelector('#district_00');
      expect(override).not.toBeNull();
      expect(override.value).toBe('00');
      expect(override.disabled).toBe(true);
    });
  });

  describe('onStateChanged', () => {
    it('should clear the district when the state changes', () => {
      component.onStateChanged('NY');
      expect(fields.candidate_district().value()).toBeNull();
    });

    it('should set the district to 00 when the selected state has one district', () => {
      component.onStateChanged('AK');
      expect(fields.candidate_district().value()).toBe('00');
    });

    it('should leave the district null when the state has multiple districts', () => {
      component.onStateChanged('CA');
      expect(fields.candidate_district().value()).toBeNull();
    });

    it('should clear the district when the state is null', () => {
      component.onStateChanged(null);
      expect(fields.candidate_district().value()).toBeNull();
    });

    it('should treat boolean values as null', () => {
      component.onStateChanged(true);
      expect(fields.candidate_district().value()).toBeNull();
    });
  });

  describe('onOfficeChanged', () => {
    it('should clear the state and district when switching to presidential office', () => {
      component.onOfficeChanged(CandidateOfficeTypes.PRESIDENTIAL);
      expect(fields.candidate_state().value()).toBeNull();
      expect(fields.candidate_district().value()).toBeNull();
    });

    it('should clear the district when switching to Senate', () => {
      component.onOfficeChanged(CandidateOfficeTypes.SENATE);
      expect(fields.candidate_district().value()).toBeNull();
      expect(fields.candidate_state().value()).toBe('CA');
    });

    it('should set the district to 00 when switching to House with a single-district state', () => {
      model.update((value) => ({
        ...value,
        candidate_office: CandidateOfficeTypes.SENATE,
        candidate_state: 'AK',
        candidate_district: null,
      }));

      fixture.detectChanges();
      component.onOfficeChanged(CandidateOfficeTypes.HOUSE);
      fixture.detectChanges();
      expect(fields.candidate_district().value()).toBe('00');
    });

    it('should clear the district when switching to House with a multiple-district state', () => {
      component.onOfficeChanged(CandidateOfficeTypes.HOUSE);
      expect(fields.candidate_district().value()).toBeNull();
    });
  });
});
