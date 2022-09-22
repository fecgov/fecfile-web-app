import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionGroupAgComponent } from './transaction-group-ag.component';

describe('TransactionGroupAgComponent', () => {
  let component: TransactionGroupAgComponent;
  let fixture: ComponentFixture<TransactionGroupAgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionGroupAgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionGroupAgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
