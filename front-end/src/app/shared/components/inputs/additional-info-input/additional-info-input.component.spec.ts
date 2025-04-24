/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionalInfoInputComponent } from './additional-info-input.component';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Transaction } from 'app/shared/models';

describe('AdditionalInfoInputComponent', () => {
  let component: AdditionalInfoInputComponent;
  let fixture: ComponentFixture<AdditionalInfoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdditionalInfoInputComponent],
      imports: [ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalInfoInputComponent);
    component = fixture.componentInstance;

    // Prepare test inputs
    const testForm = new FormGroup({
      purpose_description: new FormControl(''),
      text4000: new FormControl(''),
      category_code: new FormControl(''),
    });

    const testTransaction: Transaction = {
      transactionType: {
        purposeDescripLabel: 'Purpose',
        generatePurposeDescriptionLabel: () => 'Generated',
        purposeDescriptionPrefix: 'Prefix:',
        memoTextPrefix: 'Memo:',
        generatePurposeDescription: () => 'Auto',
        hasDesignatedSubordinate: () => true,
        hasMemoText: () => true,
        hasCategoryCode: () => true,
        memoTextRequired: true,
      },
      memo_text: {},
    } as any;

    (component as any)._form = () => testForm;
    (component as any)._transaction = () => testTransaction;
    (component as any)._templateMap = () => ({
      purpose_description: 'purpose_description',
      text4000: 'text4000',
      category_code: 'category_code',
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit events correctly', () => {
    const spy = jasmine.createSpy();
    component.designatingCommitteeSelect.subscribe(spy);
    component.onDesignatingCommitteeSelect({ value: 'test' } as any);
    expect(spy).toHaveBeenCalledWith({ value: 'test' });
  });

  it('should initialize purpose_description prefix on empty', () => {
    const control = component.form().get('purpose_description')!;
    control.setValue('');
    component.initPrefix('purpose_description', 'Prefix: ');
    expect(control.value).toBe('Prefix: ');
  });

  it('should preserve user text if prefix changed', () => {
    const control = component.form().get('text4000')!;
    control.setValue('Wrong: User message');
    component.initPrefix('text4000', 'Memo: ');
    expect(control.value).toBe('Memo: User message');
  });

  it('should return true for isDescriptionSystemGenerated if generator exists', () => {
    expect(component.isDescriptionSystemGenerated()).toBeTrue();
  });
});
