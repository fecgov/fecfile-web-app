import { PasswordModule } from './password.module';

xdescribe('PasswordModule', () => {
  let passwordModule: PasswordModule;

  beforeEach(() => {
    passwordModule = new PasswordModule();
  });

  xit('should create an instance', () => {
    expect(passwordModule).toBeTruthy();
  });
});
