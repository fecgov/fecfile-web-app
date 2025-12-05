import { Component, effect, ElementRef, input, model, output, viewChild } from '@angular/core';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-dialog',
  imports: [ButtonDirective],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  readonly submitDisabled = input<boolean>();
  readonly visible = model.required<boolean>();
  readonly title = input.required<string>();
  readonly submitLabel = input('Save');
  readonly submitForm = output<void>();
  readonly closeDialog = output<void>();

  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.dialog().nativeElement.showModal();
      } else {
        this.dialog().nativeElement.close();
      }
    });
  }
}
