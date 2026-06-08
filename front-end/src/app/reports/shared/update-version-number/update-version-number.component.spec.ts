import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVersionNumberComponent } from './update-version-number.component';

describe('UpdateVersionNumberComponent', () => {
  let component: UpdateVersionNumberComponent;
  let fixture: ComponentFixture<UpdateVersionNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateVersionNumberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateVersionNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
