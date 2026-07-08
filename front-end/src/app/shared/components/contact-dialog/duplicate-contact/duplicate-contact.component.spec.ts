import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuplicateContactComponent } from './duplicate-contact.component';
import { StatePipe } from 'app/shared/pipes/state.pipe';
import { Component, signal, viewChild } from '@angular/core';
import { Contact } from 'app/shared/models/contact.model';
import { testContact, testOrganization } from 'app/shared/utils/unit-test.utils';

@Component({
  imports: [DuplicateContactComponent],
  standalone: true,
  template: `
    <app-duplicate-contact
      [(hideDuplicateWarning)]="hideDuplicateWarning"
      [name]="name"
      [existingContacts]="allContacts"
      (useContact)="onUseContact($event)"
    />
  `,
})
class TestHostComponent {
  hideDuplicateWarning = signal(false);
  name = '';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateContactComponent, TestHostComponent],
      providers: [StatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    component = host.component();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('potentialDuplicates', () => {
    it('should match person contacts using "last_name, first_name" format', () => {
      const testIndividual = testContact();
      host.allContacts = [testIndividual];
      host.name = 'Smith, Joe';
      fixture.detectChanges();

      expect(component.potentialDuplicates()).toContain(testIndividual);
      expect(component.potentialDuplicates().length).toBe(1);
    });

    it('should match entity contacts using corporate name format', () => {
      const testOrg = testOrganization();
      host.allContacts = [testOrg];
      host.name = 'Organization LLC';
      fixture.detectChanges();

      expect(component.potentialDuplicates()).toContain(testOrg);
      expect(component.potentialDuplicates().length).toBe(1);
    });

    it('should return an empty array if no contacts match the current name input', () => {
      host.allContacts = [testContact(), testOrganization()];
      host.name = 'Smith, Jane';
      fixture.detectChanges();

      expect(component.potentialDuplicates().length).toBe(0);
    });
  });

  describe('validName', () => {
    it('should return true for a properly formatted name', () => {
      host.name = 'Smith, Joe';
      fixture.detectChanges();

      expect(component.validName()).toBe(true);
    });

    it('should return false if name ends with a trailing comma or has an empty item', () => {
      host.name = 'Doe, ';
      fixture.detectChanges();
      expect(component.validName()).toBe(false);

      host.name = ', Joe';
      fixture.detectChanges();
      expect(component.validName()).toBe(false);
    });
  });

  describe('closeDuplicateWarning', () => {
    it('should set hideDuplicateWarning model to true', () => {
      host.hideDuplicateWarning.set(false);
      fixture.detectChanges();

      component.closeDuplicateWarning();
      fixture.detectChanges();

      expect(component.hideDuplicateWarning()).toBe(true);
      expect(host.hideDuplicateWarning()).toBe(true);
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
