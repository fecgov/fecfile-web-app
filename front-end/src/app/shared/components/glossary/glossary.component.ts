import {
  afterRenderEffect,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { GlossaryService } from './glossary.service';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';
import * as jsonData from './glossary.json';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-glossary',
  imports: [DrawerModule, FormsModule, PanelModule, ButtonModule],
  providers: [],
  templateUrl: './glossary.component.html',
  styleUrl: './glossary.component.scss',
})
export class GlossaryComponent {
  readonly glossaryService = inject(GlossaryService);
  readonly searchTerm = signal('');
  readonly found = computed(() => (this.data() ? this.searchTerm() : undefined));
  readonly shown = signal(true);

  readonly content = viewChild.required<ElementRef<HTMLDivElement>>('content');

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

    afterRenderEffect(() => {
      const isShown = this.shown();
      this.data();
      const contentEl = this.content().nativeElement;

      if (isShown) {
        contentEl.style.height = contentEl.children[0].scrollHeight + 'px';
      } else {
        contentEl.style.height = '0px';
      }
    });
  }

  toggle() {
    this.shown.update((h) => !h);
  }
}
