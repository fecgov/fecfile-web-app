import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionNavigationComponent } from './transaction-navigation.component';

describe('TransactionNavigationComponent', () => {
  let component: TransactionNavigationComponent;
  let fixture: ComponentFixture<TransactionNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionNavigationComponent]
    });
    fixture = TestBed.createComponent(TransactionNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
