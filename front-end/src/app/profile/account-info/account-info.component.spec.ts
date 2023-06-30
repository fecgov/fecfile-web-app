import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { AccountInfoComponent } from './account-info.component';
import { DividerModule } from 'primeng/divider';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AccountInfoComponent', () => {
  let component: AccountInfoComponent;
  let fixture: ComponentFixture<AccountInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore(testMockStore)],
      declarations: [AccountInfoComponent],
      imports: [DividerModule, DropdownModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
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
