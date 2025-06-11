/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SelectModule } from 'primeng/select';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { CommitteeMemberDialogComponent } from './committee-member-dialog.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmationService } from 'primeng/api';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMember, Roles } from 'app/shared/models';
import { firstValueFrom, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { signal } from '@angular/core';

const johnSmith = CommitteeMember.fromJSON({
  first_name: 'John',
  last_name: 'Smith',
  email: 'JS_Test@test.com',
  role: 'COMMITTEE_ADMINISTRATOR',
  is_active: true,
  id: 'TEST',
});

describe('CommitteeMemberDialogComponent', () => {
  let component: CommitteeMemberDialogComponent;
  let fixture: ComponentFixture<CommitteeMemberDialogComponent>;
  let testCommitteeService: CommitteeMemberService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        AutoCompleteModule,
        CommitteeMemberDialogComponent,
        ErrorMessagesComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        provideMockStore(testMockStore),
        CommitteeMemberService,
      ],
    }).compileComponents();

    TestBed.inject(ConfirmationService);
    testCommitteeService = TestBed.inject(CommitteeMemberService);
    fixture = TestBed.createComponent(CommitteeMemberDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new users', () => {
    const newEmail = 'test_1234321@test.com';
    component.form.get('email')?.setValue(newEmail);
    component.submit();
    expect(component.detailVisible()).toBeFalse();
  });

  it('should not add user with pre-existing email', () => {
    const takenEmail = 'test@test.com';
    const takenEmail2 = 'TeSt@TeSt.CoM'; // Same email but with different case
    const serviceSpy = spyOn(testCommitteeService, 'getMembers').and.returnValue(
      firstValueFrom(of([CommitteeMember.fromJSON({ email: takenEmail })])),
    );

    component.form.get('email')?.patchValue(takenEmail);
    component.form.updateValueAndValidity();

    expect(serviceSpy).toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();

    component.form.get('email')?.patchValue(takenEmail2);
    component.form.updateValueAndValidity();

    expect(component.form.valid).toBeFalse();
  });

  it('should default role to first in list', () => {
    (component.detailVisible as any) = signal<boolean>(true);
    component.ngOnChanges();
    expect(component.form.get('role')?.value).toBe('COMMITTEE_ADMINISTRATOR');
  });

  describe('submit', () => {
    it('should set formSubmitted to true', () => {
      component.submit();
      expect(component.formSubmitted).toBeTrue();
    });

    it('should call editRole when member is defined', () => {
      spyOn(component, 'editRole');
      (component.member as any) = signal<CommitteeMember | undefined>({ role: 'MANAGER' } as CommitteeMember);
      component.submit();
      expect(component.editRole).toHaveBeenCalled();
    });

    it('should call addUser when member is undefined', () => {
      spyOn(component, 'addUser');
      (component.member as any) = signal<CommitteeMember | undefined>(undefined);
      component.submit();
      expect(component.addUser).toHaveBeenCalled();
    });
  });

  describe('editRole', () => {
    beforeEach(() => {
      (component.member as any) = signal<CommitteeMember | undefined>({ role: 'MANAGER' } as CommitteeMember);
      component.form.get('role')?.setValue('COMMITTEE_ADMINISTRATOR');
    });

    it('should not proceed if role is invalid', async () => {
      component.form.get('role')?.setErrors({ required: true });
      spyOn(testCommitteeService, 'update');
      await component.editRole();
      expect(testCommitteeService.update).not.toHaveBeenCalled();
    });

    it('should call committeeMemberService.update when role is valid', async () => {
      const updateSpy = spyOn(testCommitteeService, 'update').and.returnValue(Promise.resolve(johnSmith));
      const resetSpy = spyOn(component, 'resetForm');
      (component.member as any) = signal<CommitteeMember | undefined>(johnSmith);
      component.form.get('role')?.setValue('MANAGER');
      await component.editRole();

      expect(updateSpy).toHaveBeenCalledWith({ ...johnSmith, role: 'MANAGER' } as CommitteeMember);
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should handle error if update fails', async () => {
      const error = new Error('Update failed');
      const updateSpy = spyOn(testCommitteeService, 'update').and.returnValue(Promise.reject(error));
      const resetSpy = spyOn(component, 'resetForm').and.callThrough();
      const consoleSpy = spyOn(console, 'error');
      await component.editRole();
      expect(consoleSpy).toHaveBeenCalledWith('Error updating member', error);

      expect(updateSpy).toHaveBeenCalled();
      expect(resetSpy).not.toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('should not proceed if form is invalid', async () => {
      component.form.get('email')?.setErrors({ required: true });
      spyOn(testCommitteeService, 'addMember');
      await component.addUser();
      expect(testCommitteeService.addMember).not.toHaveBeenCalled();
    });

    it('should call committeeMemberService.addMember when form is valid', async () => {
      const addMemberSpy = spyOn(testCommitteeService, 'addMember').and.returnValue(Promise.resolve(johnSmith));
      const resetSpy = spyOn(component, 'resetForm').and.callThrough();
      const updateSpy = spyOn(component.form, 'updateValueAndValidity').and.callThrough();
      component.form.setControl('email', new SubscriptionFormControl('test@example.com'));
      component.form.setControl('role', new SubscriptionFormControl('MANAGER'));
      const manager = component.form.get('role')?.value;

      await component.addUser();
      expect(updateSpy).toHaveBeenCalled();
      expect(component.form.valid).toBeTrue();
      expect(addMemberSpy).toHaveBeenCalledWith('test@example.com', manager);
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should handle error if addMember fails', async () => {
      const error = new Error('Add failed');
      const addSpy = spyOn(testCommitteeService, 'addMember').and.returnValue(Promise.reject(error));
      const resetSpy = spyOn(component, 'resetForm').and.callThrough();
      const consoleSpy = spyOn(console, 'error');
      component.form.setControl('email', new SubscriptionFormControl('test@example.com'));
      component.form.setControl('role', new SubscriptionFormControl('MANAGER'));
      await component.addUser();
      expect(consoleSpy).toHaveBeenCalledWith('Error adding member', error);
      expect(addSpy).toHaveBeenCalled();
      expect(resetSpy).not.toHaveBeenCalled();
    });
  });

  describe('role getter', () => {
    it('should return empty string if member is undefined', () => {
      (component.member as any) = signal<CommitteeMember | undefined>(undefined);
      expect(component.role()).toBe('');
    });

    it('should return the role label from Roles enum', () => {
      (component.member as any) = signal<CommitteeMember | undefined>({ role: 'MANAGER' } as CommitteeMember);
      expect(component.role()).toBe(Roles.MANAGER);
    });
  });
});
