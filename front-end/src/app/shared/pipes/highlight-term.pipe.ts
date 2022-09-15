import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightTerm',
})
export class HighlightTermPipe implements PipeTransform {
  transform(value?: string, term?: string): string | undefined {
    if (value && term) {
      const searchRegex = term.split(
        /[\W+]/).filter(x => x).join('|');
      value = value.replace(new RegExp(searchRegex, 'gi'), match =>
        `<mark>${match}</mark>`);
    }
    return value;
  }
}
