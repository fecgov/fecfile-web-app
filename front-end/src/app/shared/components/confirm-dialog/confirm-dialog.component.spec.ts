import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let confirmation$: BehaviorSubject<Confirmation | null>;
  let confirmationServiceMock: Partial<ConfirmationService>;

  beforeEach(async () => {
    confirmation$ = new BehaviorSubject<Confirmation | null>(null);

    confirmationServiceMock = {
      requireConfirmation$: confirmation$.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [{ provide: ConfirmationService, useValue: confirmationServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ignore confirmations with a different key', () => {
    fixture.componentRef.setInput('key', 'expected');

    confirmation$.next({
      key: 'wrong',
      message: 'Should not appear',
    });

    expect(component.visible()).toBeFalse();
    expect(component.message).toBe('');
    expect(component.confirmation).toBeUndefined();
  });

  it('should update state when confirmation key matches', () => {
    fixture.componentRef.setInput('key', 'expected');

    const conf: Confirmation = {
      key: 'expected',
      message: 'Are you sure?',
    };

    confirmation$.next(conf);

    expect(component.visible()).toBeTrue();
    expect(component.message).toBe('Are you sure?');
    expect(component.confirmation).toEqual(conf);
  });

  it('should call reject on cancel', () => {
    const rejectSpy = jasmine.createSpy('reject');

    component.confirmation = {
      key: 'x',
      message: 'rejectSpy',
      reject: rejectSpy,
    };

    component.visible.set(true);
    component.cancelOption();

    expect(rejectSpy).toHaveBeenCalled();
    expect(component.visible()).toBeFalse();
  });

  it('should call accept on confirm', () => {
    const acceptSpy = jasmine.createSpy('accept');

    component.confirmation = {
      key: 'x',
      message: 'acceptSpy',
      accept: acceptSpy,
    };

    component.visible.set(true);
    component.confirmOption();

    expect(acceptSpy).toHaveBeenCalled();
    expect(component.visible()).toBeFalse();
  });
});
