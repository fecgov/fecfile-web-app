import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  const committeeMember = CommitteeMember.fromJSON({
    first_name: 'John',
    last_name: 'Smith',
    email: 'JS_Test@test.com',
    role: 'COMMITTEE_ADMINISTRATOR',
    is_active: true,
  });

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
    component.editItem(committeeMember);
    expect(component.isNewItem).toBe(false);
  });

  it("the Committee Member's names should be correct", () => {
    const name = `${committeeMember.last_name}, ${committeeMember.first_name}`;
    expect(name).toBe('Smith, John');
  });
});
