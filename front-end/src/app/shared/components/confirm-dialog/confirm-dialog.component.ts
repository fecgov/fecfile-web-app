import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Subscription } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [DialogComponent, ButtonDirective],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  readonly key = input<string>();

  visible = signal(false);
  message = '';
  confirmation?: Confirmation;

  private subscription?: Subscription;

  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    this.subscription = this.confirmationService.requireConfirmation$.subscribe((conf) => {
      if (conf && conf.key === this.key()) {
        this.confirmation = conf;
        this.message = conf.message ?? '';
        this.visible.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  cancelOption() {
    this.confirmation?.reject?.();
    this.visible.set(false);
  }

  confirmOption() {
    this.confirmation?.accept?.();
    this.visible.set(false);
  }
}
