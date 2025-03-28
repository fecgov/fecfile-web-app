import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F3MenuComponent } from './f3-menu.component';

describe('F3MenuComponent', () => {
  let component: F3MenuComponent;
  let fixture: ComponentFixture<F3MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [F3MenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(F3MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
