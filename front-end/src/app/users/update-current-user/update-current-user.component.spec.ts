import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UsersService } from 'app/shared/services/users.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { UpdateCurrentUserComponent } from './update-current-user.component';

describe('UpdateCurrentUserComponent', () => {
  let component: UpdateCurrentUserComponent;
  let fixture: ComponentFixture<UpdateCurrentUserComponent>;
  let router: Router;
  let store: Store;

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
      declarations: [UpdateCurrentUserComponent],
      providers: [ConfirmationService, MessageService,
        FormBuilder, provideMockStore(testMockStore), UsersService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCurrentUserComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', fakeAsync(() => {
    component.form.get('last_name')?.setValue('testLastName');
    component.form.get('first_name')?.setValue('testFirstName');
    component.form.get('email')?.setValue('testEmail');

    component.continue();
    expect(component.form.valid).toBeTrue();
    expect(component.formSubmitted).toBeTrue();
  }));
});
