import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesDisabledComponent } from './cookies-disabled.component';

describe('CookiesDisabledComponent', () => {
  let component: CookiesDisabledComponent;
  let fixture: ComponentFixture<CookiesDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiesDisabledComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CookiesDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
