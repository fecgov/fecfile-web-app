import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ManageCommitteeComponent } from './manage-committee.component';
import { CommitteeMember } from 'app/shared/models';
import { CommitteeMemberDialogComponent } from 'app/shared/components/committee-member-dialog/committee-member-dialog.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';

describe('ManageCommitteeComponent', () => {
  let component: ManageCommitteeComponent;
  let fixture: ComponentFixture<ManageCommitteeComponent>;
  const johnSmith = CommitteeMember.fromJSON({
    first_name: 'John',
    last_name: 'Smith',
    email: 'JS_Test@test.com',
    role: 'COMMITTEE_ADMINISTRATOR',
    is_active: true,
    id: 'TEST',
  });
  let mockStore: MockStore;

  let committeeMembers: CommitteeMember[];
  let service: CommitteeMemberService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToastModule,
        TableModule,
        ToolbarModule,
        DialogModule,
        ConfirmDialogModule,
        ManageCommitteeComponent,
        CommitteeMemberDialogComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        ConfirmationService,
        MessageService,
        FormBuilder,
        provideMockStore(testMockStore),
        CommitteeMemberService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(CommitteeMemberService);
    mockStore = TestBed.inject(MockStore);
    mockStore.overrideSelector(selectUserLoginData, johnSmith);
    fixture = TestBed.createComponent(ManageCommitteeComponent);
    committeeMembers = [
      johnSmith,
      CommitteeMember.fromJSON({
        first_name: 'test_first_name',
        last_name: 'test_last_name',
        email: 'test_email@testhost.com',
        role: 'COMMITTEE_ADMINISTRATOR',
        is_active: true,
      }),
    ];

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#addItem opens the dialog to add an item', () => {
    component.isNewItem = false;
    component.addItem();
    expect(component.isNewItem).toBe(true);
  });

  it('#editItem opens the dialog to edit an item', () => {
    component.isNewItem = true;
    component.editItem(committeeMembers[0]);
    expect(component.isNewItem).toBe(false);
  });

  it('should open edit mode and set member', () => {
    component.openEdit(committeeMembers[0]);

    expect(component.member).toEqual(committeeMembers[0]);
    expect(component.detailVisible).toBeTrue();
  });

  it('should call loadTableItems, show success message, and close detail', () => {
    spyOn(component, 'loadTableItems');
    spyOn(component, 'detailClose');
    const messageSpy = spyOn(component.messageService, 'add');

    component.roleEdited();

    expect(component.loadTableItems).toHaveBeenCalledWith({});
    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Successful',
      detail: 'Role Updated',
    });
    expect(component.detailClose).toHaveBeenCalled();
  });

  it('should close detail and clear member', () => {
    component.member = committeeMembers[0];
    component.detailVisible = true;
    component.detailClose();

    expect(component.detailVisible).toBeFalse();
    expect(component.member).toBeUndefined();
  });

  it("the Committee Member's names should be correct", () => {
    const name = `${committeeMembers[0].last_name}, ${committeeMembers[0].first_name}`;
    expect(name).toBe('Smith, John');
  });

  it('should not be able to remove self from committee', () => {
    expect(component.isNotCurrentUser(committeeMembers[0])).toBeFalse();
    expect(component.isNotCurrentUser(committeeMembers[1])).toBeTrue();
  });

  it('should not be able to remove committee admin if less than 3 committee admins', () => {
    spyOn(service.members$, 'value').and.returnValue(committeeMembers);
    committeeMembers.push(
      CommitteeMember.fromJSON({
        first_name: 'Man',
        last_name: 'Agar',
        email: 'manager@test.com',
        role: 'MANAGER',
        is_active: true,
      }),
    );

    expect(component.canEditMember(committeeMembers[0])).toBeFalse(); // Admin
    expect(component.canEditMember(committeeMembers[1])).toBeFalse(); // Admin
    expect(component.canEditMember(committeeMembers[2])).toBeTrue(); // Manager
  });

  it('should do it', () => {
    committeeMembers.push(
      CommitteeMember.fromJSON({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'JD_Test@test.com',
        role: 'COMMITTEE_ADMINISTRATOR',
        is_active: true,
      }),
    );
    spyOn(service.members$, 'value').and.returnValue(committeeMembers);

    expect(component.canEditMember(committeeMembers[0])).toBeTrue();
    expect(component.canEditMember(committeeMembers[1])).toBeTrue();
    expect(component.canEditMember(committeeMembers[2])).toBeTrue();
  });

  it('should confirm before delete', () => {
    const confirmSpy = spyOn(component.confirmationService, 'confirm');
    component.confirmDelete(committeeMembers[0]);
    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should delete member', fakeAsync(async () => {
    const messageSpy = spyOn(component.messageService, 'add');
    const deleteSpy = spyOn(service, 'delete').and.callFake(async (member: CommitteeMember) => {
      committeeMembers = committeeMembers.filter((m) => m.email !== member.email);
      return null;
    });
    await component.deleteItem(committeeMembers[0]);

    expect(deleteSpy).toHaveBeenCalledWith(johnSmith);
    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully removed user from committee',
      life: 3000,
    });
  }));

  it('should show error on fail', fakeAsync(async () => {
    const messageSpy = spyOn(component.messageService, 'add');
    const deleteSpy = spyOn(service, 'delete').and.callFake(() => {
      throw new Error('Failed');
    });
    await component.deleteItem(committeeMembers[0]);

    expect(deleteSpy).toHaveBeenCalledWith(johnSmith);
    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error removing the user from the committee',
      life: 3000,
    });
  }));
});
