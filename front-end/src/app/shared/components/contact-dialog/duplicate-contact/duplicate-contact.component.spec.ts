import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi, describe, beforeEach, afterEach, it, expect, Mock } from 'vitest';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { AddressPipe } from '../../../pipes/address.pipe';
import { DuplicateContactComponent, ValidatingFields } from './duplicate-contact.component';

@Component({
  standalone: true,
  imports: [DuplicateContactComponent],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-duplicate-contact
        [type]="type()"
        [data]="data()"
        [(hideDuplicate)]="hideDuplicate"
        (useContact)="onUseContact($event)"
      />
    </form>
  `,
})
class TestHostComponent {
  hideDuplicate = signal(false);
  type = signal<ContactTypes>(ContactTypes.INDIVIDUAL);
  data = signal<ValidatingFields>({ first_name: '', last_name: '' });

  selectedContact: Contact | null = null;

  readonly component = viewChild.required(DuplicateContactComponent);

  onUseContact(contact: Contact) {
    this.selectedContact = contact;
  }
}

describe('DuplicateContactComponent', () => {
  let host: TestHostComponent;
  let component: DuplicateContactComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let contactService: ContactService;
  let dupSpy: Mock<(value: ValidatingFields, type: ContactTypes, signal: AbortSignal) => Promise<Contact[]>>;

  const mockDuplicateContact = {
    id: '123',
    first_name: 'John',
    last_name: 'Doe',
    name: 'John Doe',
  } as Contact;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [AddressPipe, ContactService],
    }).compileComponents();

    contactService = TestBed.inject(ContactService);
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();

    dupSpy = vi.spyOn(contactService, 'checkForDuplicates');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('validEntry Computed Signal Validation', () => {
    it('should validate INDIVIDUAL type requiring non-empty first_name and last_name', () => {
      host.type.set(ContactTypes.INDIVIDUAL);

      host.data.set({ first_name: '', last_name: 'Doe' });
      fixture.detectChanges();
      expect(component.validEntry()).toBe(false);

      host.data.set({ first_name: 'John', last_name: '' });
      fixture.detectChanges();
      expect(component.validEntry()).toBe(false);

      host.data.set({ first_name: 'John', last_name: 'Doe' });
      fixture.detectChanges();
      expect(component.validEntry()).toBe(true);
    });

    it('should validate ORGANIZATION type requiring non-empty name', () => {
      host.type.set(ContactTypes.ORGANIZATION);

      host.data.set({ name: '' });
      fixture.detectChanges();
      expect(component.validEntry()).toBe(false);

      host.data.set({ name: 'Acme Corp' });
      fixture.detectChanges();
      expect(component.validEntry()).toBe(true);
    });

    it('should validate CANDIDATE type requiring exactly 9 characters for candidate_id', () => {
      host.type.set(ContactTypes.CANDIDATE);

      host.data.set({ candidate_id: 'C12345' });
      fixture.detectChanges();
      expect(component.validEntry()).toBe(false);

      host.data.set({ candidate_id: 'C12345678' });
      fixture.detectChanges();
      expect(component.validEntry()).toBe(true);
    });

    it('should validate COMMITTEE type requiring exactly 9 characters for committee_id', () => {
      host.type.set(ContactTypes.COMMITTEE);

      host.data.set({ committee_id: 'C00000' });
      fixture.detectChanges();
      expect(component.validEntry()).toBe(false);

      host.data.set({ committee_id: 'C00000001' });
      fixture.detectChanges();
      expect(component.validEntry()).toBe(true);
    });
  });

  describe('Resource & Service API Calls', () => {
    it('should NOT call ContactService when entry is invalid', async () => {
      host.type.set(ContactTypes.INDIVIDUAL);
      host.data.set({ first_name: '', last_name: '' });
      fixture.detectChanges();

      await vi.advanceTimersByTimeAsync(500);

      expect(dupSpy).not.toHaveBeenCalled();
      expect(component.duplicateCheck.value()).toEqual([]);
    });

    it('should call ContactService when entry is valid after timer elapsed', async () => {
      dupSpy.mockResolvedValue([mockDuplicateContact]);

      host.type.set(ContactTypes.INDIVIDUAL);
      host.data.set({ first_name: 'John', last_name: 'Doe' });
      fixture.detectChanges();

      await vi.advanceTimersByTimeAsync(400);

      expect(dupSpy).toHaveBeenCalledWith(
        { first_name: 'John', last_name: 'Doe' },
        ContactTypes.INDIVIDUAL,
        expect.anything(), // Bypasses constructor identity mismatch across environments
      );
      expect(component.duplicateCheck.value()).toEqual([mockDuplicateContact]);
    });
  });

  describe('User Interactions & Template Events', () => {
    it('should render duplicate info block when duplicates are found', async () => {
      dupSpy.mockResolvedValue([mockDuplicateContact]);

      host.type.set(ContactTypes.INDIVIDUAL);
      host.data.set({ first_name: 'John', last_name: 'Doe' });
      fixture.detectChanges();

      await vi.advanceTimersByTimeAsync(400);
      fixture.detectChanges();

      const bgBox = fixture.debugElement.query(By.css('.background-box'));
      expect(bgBox).not.toBeNull();
      expect(bgBox.nativeElement.textContent).toContain('We found an existing contact');
    });

    it('should close warning and update hideDuplicate model when close button is clicked', async () => {
      dupSpy.mockResolvedValue([mockDuplicateContact]);

      host.type.set(ContactTypes.INDIVIDUAL);
      host.data.set({ first_name: 'John', last_name: 'Doe' });
      fixture.detectChanges();

      await vi.advanceTimersByTimeAsync(400);
      fixture.detectChanges();

      const closeBtn = fixture.debugElement.query(By.css('button.rounded-image-button'));
      closeBtn.nativeElement.click();
      fixture.detectChanges();

      expect(host.hideDuplicate()).toBe(true);
      expect(component.hideDuplicate()).toBe(true);

      const bgBox = fixture.debugElement.query(By.css('.background-box'));
      expect(bgBox).toBeNull();
    });

    it('should emit useContact event when "Use this contact" button is clicked', async () => {
      dupSpy.mockResolvedValue([mockDuplicateContact]);

      host.type.set(ContactTypes.INDIVIDUAL);
      host.data.set({ first_name: 'John', last_name: 'Doe' });
      fixture.detectChanges();

      await vi.advanceTimersByTimeAsync(400);
      fixture.detectChanges();

      const useBtn = fixture.debugElement.query(By.css('button.p-button-primary'));
      useBtn.nativeElement.click();

      expect(host.selectedContact).toEqual(mockDuplicateContact);
    });
  });
});
