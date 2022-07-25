import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDotFecComponent } from './test-dot-fec.component';

describe('TestDotFecComponent', () => {
  let component: TestDotFecComponent;
  let fixture: ComponentFixture<TestDotFecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestDotFecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDotFecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
