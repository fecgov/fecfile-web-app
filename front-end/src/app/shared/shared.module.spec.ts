import { SharedModule } from './shared.module';

xdescribe('SharedModule', () => {
  let sharedModule: SharedModule;

  beforeEach(() => {
    sharedModule = new SharedModule();
  });

  xit('should create an instance', () => {
    expect(sharedModule).toBeTruthy();
  });
});
