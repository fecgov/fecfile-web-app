import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuplicateContactComponent } from './duplicate-contact.component';
import { StatePipe } from 'app/shared/pipes/state.pipe';
import { Component, viewChild } from '@angular/core';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';
import { testContact } from 'app/shared/utils/unit-test.utils';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

@Component({
  imports: [DuplicateContactComponent],
  standalone: true,
  template: `
    <app-duplicate-contact [type]="type" [existingContacts]="allContacts" (useContact)="onUseContact($event)" />
  `,
})
class TestHostComponent {
  type: ContactTypes = ContactTypes.INDIVIDUAL;
  allContacts: Contact[] = [];
  component = viewChild.required(DuplicateContactComponent);

  onUseContact(contact: Contact) {
    console.log(contact);
  }
}

describe('DuplicateContactComponent', () => {
  let component: DuplicateContactComponent;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const createInputEvent = (value: string): Event => {
    return { target: { value } } as unknown as Event;
  };

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [DuplicateContactComponent, TestHostComponent],
      providers: [StatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    component = host.component();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateCheckedData & Debounce Logic', () => {
    it('should set checkingForDuplicate to true immediately if both fields have values', () => {
      component.updateCheckedData(createInputEvent('Smith'), 'last_name');
      component.updateCheckedData(createInputEvent('Joe'), 'first_name');
      expect(component.checkingForDuplicate()).toBe(true);
    });

    it('should not set checkingForDuplicate to true if only one field has a value', () => {
      component.updateCheckedData(createInputEvent('Smith'), 'last_name');
      expect(component.checkingForDuplicate()).toBe(false);
    });

    it('should process the signal updates after 600ms', () => {
      component.updateCheckedData(createInputEvent('Smith'), 'last_name');
      component.updateCheckedData(createInputEvent('Joe'), 'first_name');

      expect(component.checkedValue()).toBe('');

      vi.advanceTimersByTime(400);

      expect(component.checkedValue()).toBe('Smith, Joe');
      expect(component.checkingForDuplicate()).toBe(false);
    });

    it('should debounce subsequent typing events and use the latest values', () => {
      component.updateCheckedData(createInputEvent('Smit'), 'last_name');
      vi.advanceTimersByTime(300);

      component.updateCheckedData(createInputEvent('Smith'), 'last_name');
      component.updateCheckedData(createInputEvent('Joe'), 'first_name');

      vi.advanceTimersByTime(600);

      expect(component.checkedValue()).toBe('Smith, Joe');
    });
  });

  describe('potentialDuplicates', () => {
    it('should match person contacts using "last_name, first_name" format', () => {
      const testIndividual = testContact();
      host.allContacts = [testIndividual];
      fixture.detectChanges();

      component.updateCheckedData(createInputEvent('Smith'), 'last_name');
      component.updateCheckedData(createInputEvent('Joe'), 'first_name');
      vi.advanceTimersByTime(600);

      expect(component.potentialDuplicates()).toContain(testIndividual);
      expect(component.potentialDuplicates()).toHaveLength(1);
    });
  });

  describe('validEntry', () => {
    it('should return true for a completely populated name after debounce finishes', () => {
      component.updateCheckedData(createInputEvent('Smith'), 'last_name');
      component.updateCheckedData(createInputEvent('Joe'), 'first_name');
      vi.advanceTimersByTime(600);

      expect(component.validEntry()).toBe(true);
    });

    it('should return false if fields remain blank or empty strings', () => {
      component.updateCheckedData(createInputEvent(''), 'last_name');
      component.updateCheckedData(createInputEvent(''), 'first_name');
      vi.advanceTimersByTime(600);

      expect(component.validEntry()).toBe(false);
    });
  });

  describe('closeDuplicateWarning', () => {
    it('should set hideDuplicateWarning model to true', () => {
      component.hideDuplicateWarning.set(false);
      fixture.detectChanges();

      component.closeDuplicateWarning();
      fixture.detectChanges();

      expect(component.hideDuplicateWarning()).toBe(true);
    });
  });

  describe('useContact output', () => {
    it('should emit the selected contact when useContact output is triggered', () => {
      const individual = testContact();
      const emitSpy = vi.spyOn(host, 'onUseContact');

      component.useContact.emit(individual);

      expect(emitSpy).toHaveBeenCalledWith(individual);
    });
  });
});
