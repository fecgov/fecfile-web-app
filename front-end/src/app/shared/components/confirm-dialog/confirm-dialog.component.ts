import { Component, computed, effect, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogComponent } from '../dialog/dialog.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-confirm-dialog',
  imports: [DialogComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  private readonly confirmationService = inject(ConfirmationService);
  readonly visible = signal(false);
  readonly confirmation = toSignal(this.confirmationService.requireConfirmation$);
  readonly header = computed(() => this.confirmation()?.header ?? 'Are you sure?');
  readonly message = computed(() => this.confirmation()?.message);
  readonly submitLabel = computed(() => this.confirmation()?.acceptLabel ?? 'Confirm');

  constructor() {
    effect(() => {
      if (this.confirmation()) this.visible.set(true);
    });
  }

  cancelOption() {
    this.confirmation()?.reject?.();
    this.visible.set(false);
  }

  confirmOption() {
    this.confirmation()?.accept?.();
    this.visible.set(false);
  }
}
