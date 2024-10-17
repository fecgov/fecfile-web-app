import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { CashOnHandOverrideComponent } from './cash-on-hand-override.component';

describe('CashOnHandOverrideComponent', () => {
  let component: CashOnHandOverrideComponent;
  let fixture: ComponentFixture<CashOnHandOverrideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore(testMockStore)],
      declarations: [CashOnHandOverrideComponent],
      imports: [DividerModule, DropdownModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule, SharedModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashOnHandOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
