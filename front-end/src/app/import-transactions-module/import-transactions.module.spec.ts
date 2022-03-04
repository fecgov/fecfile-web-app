import { ImportTransactionsModule } from './import-transactions.module';

xdescribe('ImportTransactionsModule', () => {
  let importTransactionsModule: ImportTransactionsModule;

  beforeEach(() => {
    importTransactionsModule = new ImportTransactionsModule();
  });

  xit('should create an instance', () => {
    expect(importTransactionsModule).toBeTruthy();
  });
});
