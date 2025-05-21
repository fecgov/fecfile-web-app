/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactModalComponent } from './contact-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactService } from 'app/shared/services/contact.service';
import { ContactManagementService, ContactManager } from 'app/shared/services/contact-management.service';
import { provideRouter } from '@angular/router';
import { ContactTypes, CandidateOfficeTypes, Contact } from '../../models/contact.model';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { testContact } from 'app/shared/utils/unit-test.utils';

describe('ContactModalComponent', () => {
  let component: ContactModalComponent;
  let fixture: ComponentFixture<ContactModalComponent>;

  let contactManagementService: ContactManagementService;
  let manager: ContactManager;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ContactModalComponent],
      providers: [
        provideHttpClient(),
        ContactService,
        ConfirmationService,
        provideRouter([]),
        ContactManagementService,
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactModalComponent);
    component = fixture.componentInstance;

    contactManagementService = TestBed.inject(ContactManagementService);

    contactManagementService.activeKey.set('testKey');
    manager = contactManagementService.get('testKey');
    manager.contactType.set(ContactTypes.INDIVIDUAL);
    manager.contact.set(new Contact());

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('type')?.value).toEqual(ContactTypes.INDIVIDUAL);
  });

  it('should update state options when contact type changes to Candidate', () => {
    manager.contactType.set(ContactTypes.CANDIDATE);
    fixture.detectChanges();

    expect(component.isCandidate()).toBeTrue();
    expect(component.stateOptions().length).toBeGreaterThan(0);
  });

  it('should disable state control when country is not USA', () => {
    component.form.get('country')?.setValue('CAN');
    fixture.detectChanges();

    expect(component.form.get('state')?.disabled).toBeTrue();
  });

  it('should enable state control when country is USA', () => {
    component.form.get('country')?.setValue('USA');
    fixture.detectChanges();

    expect(component.form.get('state')?.enabled).toBeTrue();
  });

  it('should update candidate district options when candidate state changes', () => {
    component.form.get('candidate_office')?.setValue(CandidateOfficeTypes.HOUSE);
    component.form.get('candidate_state')?.setValue('CA');
    fixture.detectChanges();

    expect(component.candidateDistrictOptions.length).toBeGreaterThan(0);
  });

  it('should clear candidate district options when candidate office is not HOUSE', () => {
    component.form.get('candidate_office')?.setValue(CandidateOfficeTypes.SENATE);
    component.form.get('candidate_state')?.setValue('CA');
    fixture.detectChanges();

    expect(component.candidateDistrictOptions.length).toEqual(0);
  });

  it('should not save contact if form is invalid', async () => {
    spyOn(component.cmservice.showDialog, 'set');
    component.form.get('first_name')?.setValue('');
    fixture.detectChanges();
    await fixture.whenStable();
    component.saveContact();

    expect(component.form.valid).toBeFalse();
    expect(component.cmservice.showDialog.set).not.toHaveBeenCalled();
  });

  it('should save contact if form is valid', async () => {
    component.form.patchValue(testContact);
    component.form.patchValue({ telephone: null });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.form.valid).toBeTrue();
    component.saveContact();
    expect(manager.contact().first_name).toEqual('Joe');
    expect(manager.outerContact()).toEqual(manager.contact());
  });

  it('should reset the form when the dialog is closed', () => {
    spyOn<any>(component, 'reset').and.callThrough();
    component.cmservice.showDialog.set(true);
    fixture.detectChanges();
    component.cmservice.showDialog.set(false);
    fixture.detectChanges();
    expect(component['reset']).toHaveBeenCalled();
  });

  it('should call updateContactType on initialization', () => {
    spyOn<any>(component, 'updateContactType').and.callThrough();
    component.ngOnInit();

    expect(component['updateContactType']).toHaveBeenCalled();
  });

  it('should set the correct schema validators based on contact type', () => {
    spyOn(SchemaUtils, 'addJsonSchemaValidators').and.callThrough();
    component['updateContactType']();

    const contactType = component.manager().contactType();
    const schema = ContactService.getSchemaByType(contactType);

    expect(SchemaUtils.addJsonSchemaValidators).toHaveBeenCalledWith(component.form, schema, true);
  });

  it('should patch form value when manager contact changes', () => {
    spyOn(component.form, 'patchValue').and.callThrough();
    const newContact = new Contact();
    newContact.first_name = 'Jane';
    manager.contact.set(newContact);
    fixture.detectChanges();

    expect(component.form.patchValue).toHaveBeenCalledWith(newContact, { emitEvent: false });
  });
});
