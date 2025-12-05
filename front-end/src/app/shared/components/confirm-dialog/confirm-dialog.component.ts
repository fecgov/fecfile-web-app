import { Component, input, signal } from '@angular/core';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [DialogComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  readonly key = input<string>();

  visible = signal(false);
  message = '';
  confirmation?: Confirmation;

  private subscription?: Subscription;

  constructor(private confirmationService: ConfirmationService) {}

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
    this.visible.set(false);
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
