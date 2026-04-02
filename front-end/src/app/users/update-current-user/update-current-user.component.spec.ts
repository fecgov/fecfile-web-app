import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { UsersService } from 'app/shared/services/users.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { UpdateCurrentUserComponent } from './update-current-user.component';
import { provideHttpClient } from '@angular/common/http';

describe('UpdateCurrentUserComponent', () => {
  let component: UpdateCurrentUserComponent;
  let fixture: ComponentFixture<UpdateCurrentUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastModule, TableModule, ToolbarModule, DialogModule, ConfirmDialogModule, UpdateCurrentUserComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
        FormBuilder,
        provideMockStore(testMockStore()),
        UsersService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCurrentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', async () => {
    const updateSpy = vi
      .spyOn(component['usersService'], 'updateCurrentUser')
      .mockResolvedValue({ first_name: 'test', last_name: 'test', email: 'test@test.com' });
    const navigateSpy = vi.spyOn(component['router'], 'navigate');

    component.form.get('last_name')?.setValue('testLastName');
    component.form.get('first_name')?.setValue('testFirstName');
    component.form.get('email')?.setValue('testEmail');

    component.form.updateValueAndValidity();
    await component.submitForm();

    expect(component.form.valid).toBe(true);
    expect(component.formSubmitted).toBe(true);
    expect(updateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['reports']);
  });
});
