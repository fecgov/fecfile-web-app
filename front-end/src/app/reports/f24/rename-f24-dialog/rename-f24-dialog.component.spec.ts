import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { Form24, Report } from 'app/shared/models';
import { Form24Service } from 'app/shared/services/form-24.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { F24UniqueNameValidator } from 'app/shared/utils/validators.utils';
import { MessageService } from 'primeng/api';
import { Dialog, DialogModule } from 'primeng/dialog';
import { RenameF24DialogComponent } from './rename-f24-dialog.component';


describe('RenameF24DialogComponent', () => {
  let component: RenameF24DialogComponent;
  let fixture: ComponentFixture<RenameF24DialogComponent>;
  let form24Service: Form24Service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogModule, Dialog, ReactiveFormsModule, FormsModule, RenameF24DialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Form24Service,
        provideMockStore(testMockStore()),
        MessageService,
        F24UniqueNameValidator,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RenameF24DialogComponent);
    form24Service = TestBed.inject(Form24Service);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('f24Report', new Form24());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call update name with valid name', () => {
    spyOn(form24Service, 'update').and.returnValue(Promise.resolve(new Form24() as Report));

    component.form.get('name')?.setValue(null);
    component.form.updateValueAndValidity();
    expect(component.form.invalid).toBeTrue();
    component.updateName();
    expect(form24Service.update).toHaveBeenCalledTimes(0);

    component.form.get('name')?.setValue('valid_value');
    component.form.updateValueAndValidity();
    expect(component.form.invalid).toEqual(false);
    component.updateName();
    expect(form24Service.update).toHaveBeenCalledTimes(1);
  });
});
