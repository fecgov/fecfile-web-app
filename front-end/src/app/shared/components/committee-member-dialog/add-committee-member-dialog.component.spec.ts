import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SelectModule } from 'primeng/select';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmationService } from 'primeng/api';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMember } from 'app/shared/models';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { Component, viewChild } from '@angular/core';
import { AddCommitteeMemberDialogComponent } from './add-committee-member-dialog.component';

const johnSmith = CommitteeMember.fromJSON({
  first_name: 'John',
  last_name: 'Smith',
  email: 'JS_Test@test.com',
  role: 'COMMITTEE_ADMINISTRATOR',
  is_active: true,
  id: 'TEST',
});

@Component({
  imports: [AddCommitteeMemberDialogComponent],
  standalone: true,
  template: `<app-add-committee-member-dialog [(detailVisible)]="visible" />`,
})
class TestHostComponent {
  component = viewChild.required(AddCommitteeMemberDialogComponent);
  visible = false;
}

describe('AddCommitteeMemberDialogComponent', () => {
  let component: AddCommitteeMemberDialogComponent;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testCommitteeService: CommitteeMemberService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        AutoCompleteModule,
        AddCommitteeMemberDialogComponent,
        ErrorMessagesComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        provideMockStore(testMockStore()),
        CommitteeMemberService,
      ],
    }).compileComponents();

    TestBed.inject(ConfirmationService);
    testCommitteeService = TestBed.inject(CommitteeMemberService);
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new users', () => {
    const newEmail = 'test_1234321@test.com';

    component.form.get('email')?.setValue(newEmail);
    component.form.get('role')?.setValue('MANAGER');

    component.submitForm();

    expect(component.detailVisible()).toBe(false);
  });

  it('should not add user with pre-existing email', async () => {
    const takenEmail = 'test@test.com';
    const takenEmail2 = 'TeSt@TeSt.CoM'; // Same email but with different case
    vi.spyOn(testCommitteeService, 'getMembers').mockResolvedValue([CommitteeMember.fromJSON({ email: takenEmail })]);
    await testCommitteeService.getMembers();

    component.form.get('email')?.patchValue(takenEmail);
    const valid = await component.validateForm();
    expect(valid).toBe(false);

    component.form.get('email')?.patchValue(takenEmail2);
    component.form.updateValueAndValidity();

    expect(component.form.valid).toBe(false);
  });

  it('should default role to null', async () => {
    expect(component.form.get('role')?.value).toBeNull();
  });

  it('should disable submit if no role is selected', async () => {
    component.form.get('role')?.setValue(null);
    component.form.get('email')?.setValue('test@test.com');

    component.form.updateValueAndValidity();
    fixture.detectChanges();

    expect(component.submitDisabled()).toBe(true);
  });

  describe('submit', () => {
    it('should set formSubmitted to true', () => {
      component.submitForm();
      expect(component.formSubmitted).toBe(true);
    });
  });

  describe('addUser', () => {
    it('should not proceed if form is invalid', async () => {
      component.form.get('email')?.setErrors({ required: true });
      vi.spyOn(testCommitteeService, 'addMember');
      await component.submitForm();
      expect(testCommitteeService.addMember).not.toHaveBeenCalled();
    });

    it('should call committeeMemberService.addMember when form is valid', async () => {
      const addMemberSpy = vi.spyOn(testCommitteeService, 'addMember').mockResolvedValue(johnSmith);
      const resetSpy = vi.spyOn(component, 'resetForm');
      const updateSpy = vi.spyOn(component.form, 'updateValueAndValidity');
      component.form.setControl('email', new SubscriptionFormControl('test@example.com'));
      component.form.setControl('role', new SubscriptionFormControl('MANAGER'));
      const manager = component.form.get('role')?.value;

      await component.addUser();
      expect(updateSpy).toHaveBeenCalled();
      expect(component.form.valid).toBe(true);
      expect(addMemberSpy).toHaveBeenCalledWith('test@example.com', manager);
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should handle error if addMember fails', async () => {
      const error = new Error('Add failed');
      const addSpy = vi.spyOn(testCommitteeService, 'addMember').mockRejectedValue(error);
      const resetSpy = vi.spyOn(component, 'resetForm');
      const consoleSpy = vi.spyOn(console, 'error');
      component.form.setControl('email', new SubscriptionFormControl('test@example.com'));
      component.form.setControl('role', new SubscriptionFormControl('MANAGER'));
      await component.addUser();
      expect(consoleSpy).toHaveBeenCalledWith('Error adding member', error);
      expect(addSpy).toHaveBeenCalled();
      expect(resetSpy).not.toHaveBeenCalled();
    });
  });
});
