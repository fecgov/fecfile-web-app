import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SelectModule } from 'primeng/select';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmationService } from 'primeng/api';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMember, Roles } from 'app/shared/models';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, viewChild } from '@angular/core';
import { EditCommitteeMemberDialogComponent } from './edit-committee-member-dialog.component';

const johnSmith = CommitteeMember.fromJSON({
  first_name: 'John',
  last_name: 'Smith',
  email: 'JS_Test@test.com',
  role: 'COMMITTEE_ADMINISTRATOR',
  is_active: true,
  id: 'TEST',
});

@Component({
  imports: [EditCommitteeMemberDialogComponent],
  standalone: true,
  template: `<app-edit-committee-member-dialog [(detailVisible)]="visible" [member]="member" />`,
})
class TestHostComponent {
  component = viewChild.required(EditCommitteeMemberDialogComponent);
  visible = false;

  member = CommitteeMember.fromJSON({ role: 'MANAGER', email: 'test@test.com' });
}

describe('EditCommitteeMemberDialogComponent', () => {
  let component: EditCommitteeMemberDialogComponent;
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
        EditCommitteeMemberDialogComponent,
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

  it('should default role to null', async () => {
    expect(component.form.get('role')?.value).toBeNull();
  });

  it('should disable submit if no role is selected', async () => {
    component.form.get('role')?.setValue(null);
    component.form.updateValueAndValidity();
    fixture.detectChanges();
    expect(component.form.valid).toBe(false);
  });

  describe('submit', () => {
    it('should set formSubmitted to true', () => {
      component.submitForm();
      expect(component.formSubmitted).toBe(true);
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      component.form.get('role')?.setValue('COMMITTEE_ADMINISTRATOR');
      fixture.detectChanges();
    });

    it('should not proceed if role is invalid', async () => {
      component.form.get('role')?.setErrors({ required: true });
      vi.spyOn(testCommitteeService, 'update');
      await component.submitForm();
      expect(testCommitteeService.update).not.toHaveBeenCalled();
    });

    it('should call committeeMemberService.update when role is valid', async () => {
      const updateSpy = vi.spyOn(testCommitteeService, 'update').mockResolvedValue(johnSmith);
      const resetSpy = vi.spyOn(component, 'resetForm');
      host.member = johnSmith;
      fixture.detectChanges();
      component.form.get('role')?.setValue('MANAGER');
      await component.submit();

      expect(updateSpy).toHaveBeenCalledWith({ ...johnSmith, role: 'MANAGER' } as CommitteeMember);
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should handle error if update fails', async () => {
      const error = new Error('Update failed');
      const updateSpy = vi.spyOn(testCommitteeService, 'update').mockRejectedValue(error);
      const resetSpy = vi.spyOn(component, 'resetForm');
      const consoleSpy = vi.spyOn(console, 'error');
      await component.submit();
      expect(consoleSpy).toHaveBeenCalledWith('Error updating member', error);

      expect(updateSpy).toHaveBeenCalled();
      expect(resetSpy).not.toHaveBeenCalled();
    });

    it('should exclude current role from available role options', () => {
      host.member = johnSmith;
      fixture.detectChanges();

      expect(component.availableRoleOptions().some((option) => option.value === johnSmith.role)).toBe(false);
    });

    it('should include other roles when editing a user', () => {
      host.member = johnSmith;
      fixture.detectChanges();

      expect(component.availableRoleOptions().some((option) => option.value === 'MANAGER')).toBe(true);
    });
  });

  describe('role getter', () => {
    it('should return the role label from Roles enum', () => {
      fixture.detectChanges();
      expect(component.role()).toBe(Roles.MANAGER);
    });
  });
});
