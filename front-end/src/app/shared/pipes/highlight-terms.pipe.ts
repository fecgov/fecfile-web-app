import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightTerms',
})
export class HighlightTermsPipe implements PipeTransform {
  transform(value?: string, terms?: string): string | undefined {
    if (value && terms) {
      const searchRegex = terms
        .split(/[\W]/)
        .filter((x) => x)
        .join('|');
      value = value.replace(new RegExp(searchRegex, 'gi'), (match) => `<mark>${match}</mark>`);
    }
    return value;
  }
}
