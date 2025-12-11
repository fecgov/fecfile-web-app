import { Component, computed, contentChild, effect, ElementRef, input, model, output, viewChild } from '@angular/core';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-dialog',
  imports: [ButtonDirective],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  readonly visible = model.required<boolean>();
  readonly title = input.required<string>();
  readonly submitLabel = input('Save');
  readonly confirm = output<void>();
  readonly reject = output<void>();

  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  readonly projectedFooter = contentChild('dialogFooterRef');
  readonly hasCustomFooter = computed(() => !!this.projectedFooter());

  close() {
    this.visible.set(false);
    this.reject.emit();
  }

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
