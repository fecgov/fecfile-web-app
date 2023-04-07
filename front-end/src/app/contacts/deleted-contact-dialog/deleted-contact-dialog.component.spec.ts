import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeletedContactDialogComponent } from './deleted-contact-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { of } from 'rxjs';
import { Contact } from 'app/shared/models/contact.model';

describe('DeletedContactDialogComponent', () => {
  let component: DeletedContactDialogComponent;
  let fixture: ComponentFixture<DeletedContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastModule, TableModule, DialogModule, ConfirmDialogModule, HttpClientTestingModule],
      declarations: [DeletedContactDialogComponent],
      providers: [ConfirmationService, MessageService, provideMockStore(testMockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletedContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable restore', () => {
    spyOn(component.itemService, 'getTableData').and.returnValue(
      of({
        count: 2,
        pageNumber: 1,
        next: 'https://next',
        previous: 'https://previous',
        results: [Contact.fromJSON({ id: 1, first_name: 'first', last_name: 'last' }), Contact.fromJSON({ id: 2 })],
      })
    );
    component.onSelectionChange([Contact.fromJSON({ id: 1, first_name: 'first', last_name: 'last' })]);
    expect(component.restoreControl.enabled).toBeTrue();
  });
});
