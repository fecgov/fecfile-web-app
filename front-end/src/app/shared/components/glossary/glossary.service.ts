import { effect, Injectable, signal, untracked } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlossaryService {
  readonly visible = signal(false);
  readonly searchTerm = signal('');

  search(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.visible.set(true);
  }

  constructor() {
    effect(() => {
      if (!this.visible()) {
        untracked(() => this.searchTerm.set(''));
      }
    });
  }
}
