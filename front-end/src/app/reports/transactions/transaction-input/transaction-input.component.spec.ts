import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testContact, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { TransactionInputComponent } from './transaction-input.component';

describe('TransactionInputComponent', () => {
  let component: TransactionInputComponent;
  let fixture: ComponentFixture<TransactionInputComponent>;

  const selectItem = {
    value: testContact,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionInputComponent],
    });
    fixture = TestBed.createComponent(TransactionInputComponent);
    component = fixture.componentInstance;
    component.transaction = testScheduleATransaction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateFormWithPrimaryContact should call emit', () => {
    spyOn(component.primaryContactSelect, 'emit');
    component.updateFormWithPrimaryContact(selectItem);
    expect(component.primaryContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });

  it('updateFormWithSecondaryContact should call emit', () => {
    spyOn(component.secondaryContactSelect, 'emit');
    component.updateFormWithSecondaryContact(selectItem);
    expect(component.secondaryContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });

  it('updateFormWithCandidateContact should call emit', () => {
    spyOn(component.candidateContactSelect, 'emit');
    component.updateFormWithCandidateContact(selectItem);
    expect(component.candidateContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });

  it('updateFormWithTertiaryContact should call emit', () => {
    spyOn(component.tertiaryContactSelect, 'emit');
    component.updateFormWithTertiaryContact(selectItem);
    expect(component.tertiaryContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });
});
