import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ManageCommitteeComponent } from './manage-committee.component';
import { CommitteeMember } from 'app/shared/models/committee-member.model';

describe('ManageCommitteeComponent', () => {
  let component: ManageCommitteeComponent;
  let fixture: ComponentFixture<ManageCommitteeComponent>;
  const johnSmith = CommitteeMember.fromJSON({
    first_name: 'John',
    last_name: 'Smith',
    email: 'JS_Test@test.com',
    role: 'COMMITTEE_ADMINISTRATOR',
    is_active: true,
  });

  let committeeMembers = [
    johnSmith,
    CommitteeMember.fromJSON({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'JD_Test@test.com',
      role: 'COMMITTEE_ADMINISTRATOR',
      is_active: true,
    }),
    CommitteeMember.fromJSON({
      first_name: 'test_first_name',
      last_name: 'test_last_name',
      email: 'test_email@testhost.com',
      role: 'COMMITTEE_ADMINISTRATOR',
      is_active: true,
    }),
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastModule,
        TableModule,
        ToolbarModule,
        DialogModule,
        FileUploadModule,
        ConfirmDialogModule,
      ],
      declarations: [ManageCommitteeComponent],
      providers: [ConfirmationService, MessageService, FormBuilder, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCommitteeComponent);
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

  it("the Committee Member's names should be correct", () => {
    const name = `${committeeMembers[0].last_name}, ${committeeMembers[0].first_name}`;
    expect(name).toBe('Smith, John');
  });

  it('should not be able to remove self from committee', () => {
    component.currentUserEmail = committeeMembers[2].email;
    expect(component.isNotCurrentUser(committeeMembers[0])).toBeTrue();
    expect(component.isNotCurrentUser(committeeMembers[2])).toBeFalse();
  });

  it('should confirm before delete', () => {
    const confirmSpy = spyOn(component.confirmationService, 'confirm');
    component.confirmDelete(committeeMembers[0]);
    expect(confirmSpy).toHaveBeenCalled();
  });

  describe('deleteItem', () => {
    it('should throw error if missing committee', () => {
      const messageSpy = spyOn(component.messageService, 'add');
      component.activeCommitteeIndex = undefined;
      component.deleteItem(committeeMembers[0]);
      expect(messageSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Failed to delete',
        detail: 'Unable to determine active committee',
        life: 3000,
      });
    });

    it('should delete member', fakeAsync(async () => {
      const messageSpy = spyOn(component.messageService, 'add');
      const deleteSpy = spyOn(component.itemService, 'deleteFromCommittee').and.callFake(async (member) => {
        committeeMembers = committeeMembers.filter((m) => m.email !== member.email);
        return 'Deleted';
      });

      component.activeCommitteeIndex = 'C00601211';
      await component.deleteItem(committeeMembers[0]);

      expect(deleteSpy).toHaveBeenCalledWith(johnSmith, 'C00601211');
      expect(messageSpy).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully removed user from committee',
        life: 3000,
      });
    }));
  });
});
