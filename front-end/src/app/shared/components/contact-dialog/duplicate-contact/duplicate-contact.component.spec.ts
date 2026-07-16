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

  describe('updateName & Debounce Logic', () => {
    it('should set checkingName to true immediately if both fields have values', () => {
      component.updateName(createInputEvent('Smith'), 'last_name');
      component.updateName(createInputEvent('Joe'), 'first_name');
      expect(component.checkingName()).toBe(true);
    });

    it('should not set checkingName to true if only one field has a value', () => {
      component.updateName(createInputEvent('Smith'), 'last_name');
      expect(component.checkingName()).toBe(false);
    });

    it('should process the signal updates after 600ms', () => {
      component.updateName(createInputEvent('Smith'), 'last_name');
      component.updateName(createInputEvent('Joe'), 'first_name');

      expect(component.name()).toBe(', ');

      vi.advanceTimersByTime(400);

      expect(component.name()).toBe('Smith, Joe');
      expect(component.checkingName()).toBe(false);
    });

    it('should debounce subsequent typing events and use the latest values', () => {
      component.updateName(createInputEvent('Smit'), 'last_name');
      vi.advanceTimersByTime(300);

      component.updateName(createInputEvent('Smith'), 'last_name');
      component.updateName(createInputEvent('Joe'), 'first_name');

      vi.advanceTimersByTime(600);

      expect(component.name()).toBe('Smith, Joe');
    });
  });

  describe('potentialDuplicates', () => {
    it('should match person contacts using "last_name, first_name" format', () => {
      const testIndividual = testContact();
      host.allContacts = [testIndividual];
      fixture.detectChanges();

      component.updateName(createInputEvent('Smith'), 'last_name');
      component.updateName(createInputEvent('Joe'), 'first_name');
      vi.advanceTimersByTime(600);

      expect(component.potentialDuplicates()).toContain(testIndividual);
      expect(component.potentialDuplicates().length).toBe(1);
    });
  });

  describe('validName', () => {
    it('should return true for a completely populated name after debounce finishes', () => {
      component.updateName(createInputEvent('Smith'), 'last_name');
      component.updateName(createInputEvent('Joe'), 'first_name');
      vi.advanceTimersByTime(600);

      expect(component.validName()).toBe(true);
    });

    it('should return false if fields remain blank or empty strings', () => {
      component.updateName(createInputEvent(''), 'last_name');
      component.updateName(createInputEvent(''), 'first_name');
      vi.advanceTimersByTime(600);

      expect(component.validName()).toBe(false);
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
