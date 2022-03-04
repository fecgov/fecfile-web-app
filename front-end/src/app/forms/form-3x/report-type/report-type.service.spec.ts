import { TestBed, inject } from '@angular/core/testing';

import { ReportTypeService } from './report-type.service';

xdescribe('ReportTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportTypeService],
    });
  });

  xit('should be created', inject([ReportTypeService], (service: ReportTypeService) => {
    expect(service).toBeTruthy();
  }));
});
