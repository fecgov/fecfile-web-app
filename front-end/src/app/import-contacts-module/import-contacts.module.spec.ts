import { ImportContactsModule } from './import-contacts.module';

xdescribe('ImportContactsModule', () => {
  let importContactsModule: ImportContactsModule;

  beforeEach(() => {
    importContactsModule = new ImportContactsModule();
  });

  xit('should create an instance', () => {
    expect(importContactsModule).toBeTruthy();
  });
});
