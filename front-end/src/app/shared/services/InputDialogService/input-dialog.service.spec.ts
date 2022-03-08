import { TestBed, inject } from '@angular/core/testing';

import { InputDialogService } from './input-dialog.service';

xdescribe('InputDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputDialogService]
    });
  });

  xit('should be created', inject([InputDialogService], (service: InputDialogService) => {
    expect(service).toBeTruthy();
  }));
});
