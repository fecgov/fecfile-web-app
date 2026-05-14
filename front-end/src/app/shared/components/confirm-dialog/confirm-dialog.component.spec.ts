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

  it('should update when confirmation is emitted', () => {
    const conf: Confirmation = {
      message: 'Are you sure?',
    };

    confirmation$.next(conf);
    fixture.detectChanges();

    expect(component.visible()).toBe(true);
    expect(component.message()).toBe('Are you sure?');
    expect(component.confirmation()).toEqual(conf);
  });

  it('should call reject on cancel', () => {
    const rejectSpy = vi.fn();

    confirmation$.next({
      message: 'rejectSpy',
      reject: rejectSpy,
    });

    fixture.detectChanges();

    expect(component.visible()).toBe(true);

    component.cancelOption();

    expect(rejectSpy).toHaveBeenCalled();
    expect(component.visible()).toBe(false);
  });

  it('should call accept on confirm', () => {
    const acceptSpy = vi.fn();

    confirmation$.next({
      message: 'acceptSpy',
      accept: acceptSpy,
    });

    fixture.detectChanges();

    expect(component.visible()).toBe(true);

    component.confirmOption();

    expect(acceptSpy).toHaveBeenCalled();
    expect(component.visible()).toBe(false);
  });

  it('should not be visible when there is no confirmation', () => {
    confirmation$.next(null);
    fixture.detectChanges();

    expect(component.visible()).toBe(false);
    expect(component.confirmation()).toBeNull();
  });
});
