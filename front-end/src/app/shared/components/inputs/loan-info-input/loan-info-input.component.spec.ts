import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'app/shared/shared.module';
import { LoanInfoInputComponent } from './loan-info-input.component';

describe('LoanInfoInputComponent', () => {
  let component: LoanInfoInputComponent;
  let fixture: ComponentFixture<LoanInfoInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [LoanInfoInputComponent],
    });
    fixture = TestBed.createComponent(LoanInfoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
