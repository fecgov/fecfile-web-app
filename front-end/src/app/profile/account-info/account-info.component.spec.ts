import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { FecInternationalPhoneInputComponent } from 'app/shared/components/fec-international-phone-input/fec-international-phone-input.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { AccountInfoComponent } from './account-info.component';

describe('AccountInfoComponent', () => {
  let component: AccountInfoComponent;
  let fixture: ComponentFixture<AccountInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore(testMockStore)],
      declarations: [AccountInfoComponent, FecInternationalPhoneInputComponent],
      imports: [DividerModule, DropdownModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule, SharedModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens FEC form', () => {
    spyOn(window, 'open');
    const f1FormLink = fixture.debugElement.nativeElement.querySelector('#update-form-1-link');
    f1FormLink.click();
    expect(window.open).toHaveBeenCalledWith('https://webforms.fec.gov/webforms/form1/index.htm', '_blank');
  });
});
