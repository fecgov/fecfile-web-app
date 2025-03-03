import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletedContactDialogComponent } from './deleted-contact-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Contact, ContactTypes } from 'app/shared/models';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('DeletedContactDialogComponent', () => {
  let component: DeletedContactDialogComponent;
  let fixture: ComponentFixture<DeletedContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastModule, TableModule, DialogModule, ConfirmDialogModule, DeletedContactDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        ConfirmationService,
        MessageService,
        provideMockStore(testMockStore),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletedContactDialogComponent);
    component = fixture.componentInstance;
    spyOn(component.itemService, 'getTableData').and.returnValue(
      Promise.resolve({
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

  it('should restore', async () => {
    spyOn(component.itemService, 'restore').and.returnValue(Promise.resolve(['1']));
    component.visible = true;
    component.onSelectionChange([Contact.fromJSON({ id: 1, first_name: 'first', last_name: 'last' })]);
    await component.restoreSelected();

    expect(component.selectedItems).toEqual([]);
  });

  it('should display name', () => {
    const label = component.displayName(Contact.fromJSON({ id: 1, first_name: 'first', last_name: 'last' }));
    expect(label).toEqual('last, first');
    const orglabel = component.displayName(Contact.fromJSON({ id: 1, name: 'name', type: ContactTypes.ORGANIZATION }));
    expect(orglabel).toEqual('name');
  });
});
