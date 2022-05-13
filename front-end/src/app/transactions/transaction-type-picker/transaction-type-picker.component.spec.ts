import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { SharedModule } from 'app/shared/shared.module';
import { AccordionModule } from 'primeng/accordion';

import { TransactionTypePickerComponent } from './transaction-type-picker.component';

describe('TransactionTypePickerComponent', () => {
  let component: TransactionTypePickerComponent;
  let fixture: ComponentFixture<TransactionTypePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionModule, SharedModule, BrowserAnimationsModule],
      declarations: [TransactionTypePickerComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: F3xSummary.fromJSON({}),
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTypePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
