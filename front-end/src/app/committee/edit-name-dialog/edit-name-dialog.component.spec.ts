import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Component, viewChild } from '@angular/core';
import { EditNameDialogComponent } from './edit-name-dialog.component';
import { UserLoginData } from 'app/shared/models';
import { UsersService } from 'app/shared/services/users.service';

const johnSmith: UserLoginData = {
  first_name: 'John',
  last_name: 'Smith',
};

@Component({
  imports: [EditNameDialogComponent],
  standalone: true,
  template: `<app-edit-name-dialog [(visible)]="visible" />`,
})
class TestHostComponent {
  component = viewChild.required(EditNameDialogComponent);
  visible = false;
}

describe('EditNameDialogComponent', () => {
  let component: EditNameDialogComponent;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testUserService: UsersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, EditNameDialogComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore(testMockStore()), UsersService],
    }).compileComponents();

    testUserService = TestBed.inject(UsersService);
    vi.spyOn(testUserService, 'getCurrentUser').mockResolvedValue(johnSmith);
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;

    fixture.detectChanges();
    component = host.component();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Prepopulation and Synchronization', () => {
    it('should pre-populate the nameModel when visible turns true', async () => {
      component.nameModel.set({ first: '', last: '' });

      host.visible = true;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.nameModel().first).toBe('John');
      expect(component.nameModel().last).toBe('Smith');
    });
  });

  describe('Validation & Submission', () => {
    it('should mark fields as touched and stop submission if form is invalid', async () => {
      host.visible = true;
      fixture.detectChanges();

      component.nameModel.set({ first: '', last: '' });
      fixture.detectChanges();

      const updateSpy = vi.spyOn(testUserService, 'updateCurrentUser');

      await component.submit();

      expect(component.nameForm.first().touched()).toBe(true);
      expect(component.nameForm.last().touched()).toBe(true);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should update user names and close dialog when form is valid', async () => {
      host.visible = true;
      fixture.detectChanges();
      await fixture.whenStable();

      component.nameModel.set({ first: 'Johnny', last: 'Smithson' });
      fixture.detectChanges();

      const updateSpy = vi.spyOn(testUserService, 'updateCurrentUser').mockResolvedValue(johnSmith);

      await component.submit();

      expect(updateSpy).toHaveBeenCalledWith({
        ...johnSmith,
        first_name: 'Johnny',
        last_name: 'Smithson',
      });

      expect(host.visible).toBe(false);
    });

    it('should handle error gracefully and keep dialog open if update service fails', async () => {
      host.visible = true;
      fixture.detectChanges();
      await fixture.whenStable();

      const error = new Error('Database disconnected');
      const updateSpy = vi.spyOn(testUserService, 'updateCurrentUser').mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, 'error');

      await component.submit();

      expect(consoleSpy).toHaveBeenCalledWith('Error updating member', error);
      expect(updateSpy).toHaveBeenCalled();
      expect(host.visible).toBe(true);
    });
  });
});
