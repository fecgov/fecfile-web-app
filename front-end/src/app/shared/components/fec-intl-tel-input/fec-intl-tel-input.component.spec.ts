import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ValidateService } from 'app/shared/services/validate.service';
import { FecIntlTelInputComponent } from './fec-intl-tel-input.component';

describe('FecIntlTelInputComponent', () => {
  let component: FecIntlTelInputComponent;
  let fixture: ComponentFixture<FecIntlTelInputComponent>;




  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FecIntlTelInputComponent],
      providers: [ValidateService],
      imports: [ FormsModule ]
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
