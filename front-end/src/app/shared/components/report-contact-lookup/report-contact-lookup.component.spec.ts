import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportContactLookupComponent } from './report-contact-lookup.component';

describe('ReportContactLookupComponent', () => {
  let component: ReportContactLookupComponent;
  let fixture: ComponentFixture<ReportContactLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportContactLookupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportContactLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
