import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { ValidateService } from 'app/shared/services/validate.service';
import { FecIntlTelInputComponent } from './fec-intl-tel-input.component';

describe('ErrorMessagesComponent', () => {
  let component: FecIntlTelInputComponent;
  let fixture: ComponentFixture<FecIntlTelInputComponent>;
  let validateService: ValidateService;

  const testSchema: JsonSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://unit-test',
    type: 'object',
    required: [],
    properties: {
      in_between: {
        type: 'string',
        minLength: 10,
        maxLength: 20,
      },
      low_high: {
        type: 'number',
        minimum: 0,
        maximum: 10,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FecIntlTelInputComponent],
      providers: [ValidateService],
      imports: [ FormsModule ]
    }).compileComponents();
  });

  beforeEach(() => {
    validateService = TestBed.inject(ValidateService);
    fixture = TestBed.createComponent(FecIntlTelInputComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
