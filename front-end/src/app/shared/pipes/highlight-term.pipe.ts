import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightTerm',
})
export class HighlightTermPipe implements PipeTransform {
  transform(value?: string, term?: string): string | undefined {
    if (value && term) {
      return value.replace(new RegExp(term, 'gi'), match =>
        `<mark>${match}</mark>`)
    }
    return value;
  }
}
