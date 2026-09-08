import { Component, TemplateRef, viewChild } from '@angular/core';
import { TableBodyContext } from 'app/shared/components/table/table.component';
import { LineSummary } from './base-summary.component';
import { NgClass } from '@angular/common';
import { CalculationOverlayComponent } from 'app/shared/components/calculation-overlay/calculation-overlay.component';

@Component({
  selector: 'app-shared-summary-templates',
  template: `
    <ng-template #descriptionTpl let-line="$implicit">
      <div
        class="cell-with-overlay"
        [ngClass]="{
          'indent-1': line.indent === 1,
          'indent-2': line.indent === 2,
          'numeric-line': isNumericLine(line.lineNumber),
          bold: line.bold,
          italic: line.italic,
        }"
      >
        <span class="description-text">
          {{ line.description }}
        </span>
        @if (line.overlay) {
          <app-calculation-overlay>
            <span class="overlay-content">
              {{ line.overlay }}
            </span>
          </app-calculation-overlay>
        }
      </div>
    </ng-template>
  `,
  imports: [NgClass, CalculationOverlayComponent],
  styles: `
    .overlay-content {
      white-space: pre-line;
    }
  `,
})
export class SharedSummaryTemplatesComponent {
  readonly descriptionTpl = viewChild.required<TemplateRef<TableBodyContext<LineSummary>>>('descriptionTpl');

  isNumericLine(lineNumber: string): boolean {
    return !!lineNumber && !lineNumber.includes('(');
  }
}
