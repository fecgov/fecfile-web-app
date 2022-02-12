import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportFecFileComponent } from './import-fecfile.component';

describe('ImportFecfileComponent', () => {
  let component: ImportFecFileComponent;
  let fixture: ComponentFixture<ImportFecFileComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImportFecFileComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFecFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
