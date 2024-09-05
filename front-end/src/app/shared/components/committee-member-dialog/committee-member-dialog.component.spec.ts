import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { CommitteeMemberDialogComponent } from './committee-member-dialog.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmationService } from 'primeng/api';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMember } from 'app/shared/models/committee-member.model';
import { firstValueFrom, of } from 'rxjs';

describe('CommitteeMemberDialogComponent', () => {
  let component: CommitteeMemberDialogComponent;
  let fixture: ComponentFixture<CommitteeMemberDialogComponent>;
  let testCommitteeService: CommitteeMemberService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule, DropdownModule, AutoCompleteModule],
      declarations: [CommitteeMemberDialogComponent, ErrorMessagesComponent],
      providers: [ConfirmationService, provideMockStore(testMockStore), CommitteeMemberService],
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
    component.addUser();
    expect(component.detailVisible).toBeFalse();
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
    component.ngOnChanges();
    expect(component.form.get('role')?.value.value).toBe('COMMITTEE_ADMINISTRATOR');
  });
});
