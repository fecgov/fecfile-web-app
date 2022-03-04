import { AppMainLoginModule } from './app-main-login.module';

xdescribe('AppMainLoginModule', () => {
  let appMainLoginModule: AppMainLoginModule;

  beforeEach(() => {
    appMainLoginModule = new AppMainLoginModule();
  });

  xit('should create an instance', () => {
    expect(appMainLoginModule).toBeTruthy();
  });
});
