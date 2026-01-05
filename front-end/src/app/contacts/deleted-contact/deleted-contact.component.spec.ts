import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletedContactComponent } from './deleted-contact.component';
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
  imports: [DeletedContactComponent],
  standalone: true,
  template: `<app-deleted-contact />`,
})
class TestHostComponent {
  component = viewChild.required(DeletedContactComponent);
}

describe('DeletedContactComponent', () => {
  let component: DeletedContactComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let service: DeletedContactService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastModule, TableModule, DialogModule, ConfirmDialogModule, DeletedContactComponent],
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

  it('should restore', async () => {
    spyOn(service, 'restore').and.returnValue(Promise.resolve(['1']));
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
