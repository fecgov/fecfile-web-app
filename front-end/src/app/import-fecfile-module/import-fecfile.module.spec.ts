import { ImportFecFile1Module } from './import-fecfile.module';

describe('ImportFecfileModuleModule', () => {
  let importFecfileModuleModule: ImportFecFile1Module

  beforeEach(() => {
    importFecfileModuleModule = new ImportFecFile1Module();
  });

  it('should create an instance', () => {
    expect(importFecfileModuleModule).toBeTruthy();
  });
});
