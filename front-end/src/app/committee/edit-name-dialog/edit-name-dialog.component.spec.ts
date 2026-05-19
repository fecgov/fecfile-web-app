import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Component, viewChild } from '@angular/core';
import { EditNameDialogComponent } from './edit-name-dialog.component';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMember } from 'app/shared/models';

const johnSmith = CommitteeMember.fromJSON({
  first_name: 'John',
  last_name: 'Smith',
  email: 'JS_Test@test.com',
  role: 'COMMITTEE_ADMINISTRATOR',
  is_active: true,
  id: 'TEST',
});

@Component({
  imports: [EditNameDialogComponent],
  standalone: true,
  template: `<app-edit-name-dialog [(visible)]="visible" [member]="member" />`,
})
class TestHostComponent {
  component = viewChild.required(EditNameDialogComponent);
  visible = false;
  member: CommitteeMember = johnSmith;
}

describe('EditNameDialogComponent', () => {
  let component: EditNameDialogComponent;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testCommitteeService: CommitteeMemberService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, EditNameDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore(testMockStore()),
        CommitteeMemberService,
      ],
    }).compileComponents();

    testCommitteeService = TestBed.inject(CommitteeMemberService);
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;

    fixture.detectChanges();
    component = host.component();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Prepopulation and Synchronization', () => {
    it('should pre-populate the nameModel when visible turns true', () => {
      component.nameModel.set({ first: '', last: '' });

      host.visible = true;
      fixture.detectChanges();

      expect(component.nameModel().first).toBe('John');
      expect(component.nameModel().last).toBe('Smith');
    });

    it('should not update nameModel if visible remains false', () => {
      component.nameModel.set({ first: 'Custom', last: 'Value' });

      host.member = CommitteeMember.fromJSON({ first_name: 'Jane', last_name: 'Doe' });
      fixture.detectChanges();

      expect(component.nameModel().first).toBe('Custom');
    });
  });

  describe('Validation & Submission', () => {
    it('should mark fields as touched and stop submission if form is invalid', async () => {
      host.visible = true;
      fixture.detectChanges();

      component.nameModel.set({ first: '', last: '' });
      fixture.detectChanges();

      const updateSpy = vi.spyOn(testCommitteeService, 'update');

      await component.submit();

      expect(component.nameForm.first().touched()).toBe(true);
      expect(component.nameForm.last().touched()).toBe(true);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should update member names and close dialog when form is valid', async () => {
      host.visible = true;
      fixture.detectChanges();

      component.nameModel.set({ first: 'Johnny', last: 'Smithson' });
      fixture.detectChanges();

      const updateSpy = vi.spyOn(testCommitteeService, 'update').mockResolvedValue(johnSmith);

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

      const error = new Error('Database disconnected');
      const updateSpy = vi.spyOn(testCommitteeService, 'update').mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, 'error');

      await component.submit();

      expect(consoleSpy).toHaveBeenCalledWith('Error updating member', error);
      expect(updateSpy).toHaveBeenCalled();
      expect(host.visible).toBe(true);
    });
  });
});
