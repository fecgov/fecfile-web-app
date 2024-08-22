import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Contact } from 'app/shared/models/contact.model';
import { ContactDisplayNamePipe } from 'app/shared/pipes/contact-display-name.pipe';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { of } from 'rxjs';
import { DeletedContactDialogComponent } from './deleted-contact-dialog.component';

describe('DeletedContactDialogComponent', () => {
  let component: DeletedContactDialogComponent;
  let fixture: ComponentFixture<DeletedContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastModule, TableModule, DialogModule, ConfirmDialogModule, HttpClientTestingModule],
      declarations: [DeletedContactDialogComponent],
      providers: [ConfirmationService, MessageService, provideMockStore(testMockStore), ContactDisplayNamePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletedContactDialogComponent);
    component = fixture.componentInstance;
    spyOn(component.itemService, 'getTableData').and.returnValue(
      of({
        count: 2,
        pageNumber: 1,
        next: 'https://next',
        previous: 'https://previous',
        results: [Contact.fromJSON({ id: 1, first_name: 'first', last_name: 'last' })],
      }),
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable restore', () => {
    component.visible = true;
    component.onSelectionChange([Contact.fromJSON({ id: 1, first_name: 'first', last_name: 'last' })]);
    component.hide();
    expect(component.selectedItems).toEqual([]);
  });

  it('should restore', () => {
    spyOn(component.itemService, 'restore').and.returnValue(of(['1']));
    component.visible = true;
    component.onSelectionChange([Contact.fromJSON({ id: 1, first_name: 'first', last_name: 'last' })]);
    component.restoreSelected();

    expect(component.selectedItems).toEqual([]);
  });
});
