import { ImportFecFile1Module } from './import-fecfile.module';

xdescribe('ImportFecfileModuleModule', () => {
  let importFecfileModuleModule: ImportFecFile1Module

  beforeEach(() => {
    importFecfileModuleModule = new ImportFecFile1Module();
  });

  xit('should create an instance', () => {
    expect(importFecfileModuleModule).toBeTruthy();
  });
});
