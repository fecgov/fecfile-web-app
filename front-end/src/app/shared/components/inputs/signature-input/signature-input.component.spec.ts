import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'app/shared/shared.module';
import { SignatureInputComponent } from './signature-input.component';

describe('SignatureInputComponent', () => {
  let component: SignatureInputComponent;
  let fixture: ComponentFixture<SignatureInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [SignatureInputComponent],
    });
    fixture = TestBed.createComponent(SignatureInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
