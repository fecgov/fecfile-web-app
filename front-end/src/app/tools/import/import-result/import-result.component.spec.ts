import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportResultComponent } from './import-result.component';

describe('ImportResultComponent', () => {
  let component: ImportResultComponent;
  let fixture: ComponentFixture<ImportResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
