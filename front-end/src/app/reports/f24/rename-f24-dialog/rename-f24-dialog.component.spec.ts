import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { Form24 } from 'app/shared/models';
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

  it('should not call update with no name', async () => {
    spyOn(form24Service, 'update').and.resolveTo(new Form24());
    spyOn(form24Service, 'getAllReports').and.resolveTo([]);
    component.form.get('typeName')?.setValue(null);
    component.form.get('form24Name')?.setValue(null);

    await component.submitForm();
    expect(component.form.invalid).toBeTrue();
    expect(form24Service.update).toHaveBeenCalledTimes(0);
  });

  it('should not call update with duplicate name', async () => {
    spyOn(form24Service, 'update').and.resolveTo(new Form24());
    const testF24Report = new Form24();
    testF24Report.name = '24-Hour: duplicate_name';
    spyOn(form24Service, 'getAllReports').and.resolveTo([testF24Report]);
    component.form.get('typeName')?.setValue('24-Hour: ');
    component.form.get('form24Name')?.setValue('duplicate_name');

    await component.submitForm();
    expect(component.form.invalid).toBeTrue();
    expect(component.formParent.get('form24NameGroup')?.errors).toEqual({
      duplicateName: true,
    });

    expect(form24Service.update).toHaveBeenCalledTimes(0);
  });

  it('should call update name with valid name', async () => {
    spyOn(form24Service, 'update').and.resolveTo(new Form24());
    spyOn(form24Service, 'getAllReports').and.resolveTo([]);
    component.form.get('typeName')?.setValue('24-Hour: ');
    component.form.get('form24Name')?.setValue('valid_value');
    expect(component.form.invalid).toEqual(false);
    await component.submitForm();
    expect(form24Service.update).toHaveBeenCalledTimes(1);
  });
});
