import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FecIntlTelInputComponent } from './fec-intl-tel-input.component';

describe('FecIntlTelInputComponent', () => {
  let component: FecIntlTelInputComponent;
  let fixture: ComponentFixture<FecIntlTelInputComponent>;




  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FecIntlTelInputComponent],
      providers: [],
      imports: [ FormsModule, ReactiveFormsModule ]
    }).compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FecIntlTelInputComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
