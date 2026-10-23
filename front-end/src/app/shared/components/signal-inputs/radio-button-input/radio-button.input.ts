import { Component, computed, input } from '@angular/core';
import { BaseInput } from '../base.input';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio-button-input',
  imports: [RadioButtonModule, FormsModule],
  templateUrl: './radio-button.input.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class RadioButtonInput<T> extends BaseInput<T | null> {
  readonly options = input.required<T[]>();
  readonly columnCount = input<number>(1);
  readonly labelFunction = input.required<(value: T) => string>();
  readonly disabledOptions = input<Set<T>>(new Set<T>());
  readonly hideTitle = input(false);

  readonly columns = computed(() => {
    const result: T[][] = [];
    let startIndex = 0;
    const numColumns = this.columnCount();
    const options = this.options();

    for (let i = 0; i < numColumns; i++) {
      const baseSize = Math.floor(options.length / numColumns);
      const extra = i < options.length % numColumns ? 1 : 0;
      const colSize = baseSize + extra;
      const chunk = options.slice(startIndex, startIndex + colSize);
      result.push(chunk);
      startIndex += colSize;
    }
    return result;
  });
}
