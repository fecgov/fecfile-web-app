import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationControlBarComponent } from './navigation-control-bar.component';

describe('NavigationControlBarComponent', () => {
  let component: NavigationControlBarComponent;
  let fixture: ComponentFixture<NavigationControlBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationControlBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationControlBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
