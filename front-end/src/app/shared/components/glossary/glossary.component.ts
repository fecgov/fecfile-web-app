import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { GlossaryService } from './glossary.service';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';
import * as jsonData from './glossary.json';

@Component({
  selector: 'app-glossary',
  imports: [DrawerModule, FormsModule],
  providers: [],
  templateUrl: './glossary.component.html',
  styleUrl: './glossary.component.scss',
})
export class GlossaryComponent {
  readonly glossaryService = inject(GlossaryService);
  readonly searchTerm = signal('');
  readonly found = computed(() => (this.data() ? this.searchTerm() : undefined));

  readonly data = computed(() => {
    const searchTerm = this.searchTerm();
    if (Object.hasOwn(jsonData, searchTerm)) return jsonData[searchTerm as keyof typeof jsonData];
    return '';
  });

  constructor() {
    effect(() => {
      const searchTerm = this.glossaryService.searchTerm();
      untracked(() => {
        if (searchTerm != this.searchTerm()) this.searchTerm.set(searchTerm);
      });
    });
  }
}
