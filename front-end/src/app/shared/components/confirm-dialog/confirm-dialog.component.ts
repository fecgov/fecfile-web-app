import { Component, computed, effect, inject, input, signal } from '@angular/core';
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
  readonly header = computed(() => this.confirmation()?.header ?? 'Are you sure?');

  readonly key = input<string>();

  visible = signal(false);

  private confirmationService = inject(ConfirmationService);

  private readonly _confirmation = toSignal(this.confirmationService.requireConfirmation$);
  readonly confirmation = computed(() => (this._confirmation()?.key === this.key() ? this._confirmation() : undefined));
  readonly message = computed(() => this.confirmation()?.message);

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
