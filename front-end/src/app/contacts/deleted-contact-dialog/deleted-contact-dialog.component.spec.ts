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
import { DeletedContactService } from 'app/shared/services/contact.service';
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [DeletedContactDialogComponent],
  standalone: true,
  template: `<app-deleted-contact-dialog [(visible)]="visible" (contactsRestored)="contactsRestored()" />`,
})
class TestHostComponent {
  component = viewChild.required(DeletedContactDialogComponent);
  visible = false;

  contactsRestored() {
    console.log('Contacts restored');
  }
}

describe('DeletedContactDialogComponent', () => {
  let component: DeletedContactDialogComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let service: DeletedContactService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastModule, TableModule, DialogModule, ConfirmDialogModule, DeletedContactDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        ConfirmationService,
        MessageService,
        provideMockStore(testMockStore()),
        DeletedContactService,
      ],
    }).compileComponents();
    service = TestBed.inject(DeletedContactService);
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable restore', () => {
    component.visible.set(true);
    component.selectedItems.set([Contact.fromJSON({ id: 1, first_name: 'first', last_name: 'last' })]);
    component.visible.set(false);
    fixture.detectChanges();
    expect(component.selectedItems()).toEqual([]);
  });

  it('should restore', async () => {
    spyOn(service, 'restore').and.returnValue(Promise.resolve(['1']));
    component.visible.set(true);
    component.selectedItems.set([Contact.fromJSON({ id: 1, first_name: 'first', last_name: 'last' })]);
    await component.restoreSelected();
    fixture.detectChanges();
    expect(component.selectedItems()).toEqual([]);
  });

  it('should display name', () => {
    const label = component.displayName(Contact.fromJSON({ id: 1, first_name: 'first', last_name: 'last' }));
    expect(label).toEqual('last, first');
    const orglabel = component.displayName(Contact.fromJSON({ id: 1, name: 'name', type: ContactTypes.ORGANIZATION }));
    expect(orglabel).toEqual('name');
  });
});
