import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, HostListener, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Form3Service } from 'app/shared/services/form-3.service';
import { LoginService } from 'app/shared/services/login.service';
import { environment } from 'environments/environment';
import { Popover, PopoverModule } from 'primeng/popover';
import { PopoverLinkDirective } from '../popover-link.directive';
import { ElectionCycleStore } from 'app/tools/election-cycle/election-cycle.store';

@Component({
  selector: 'app-default-header-links',
  imports: [PopoverModule, NgOptimizedImage, RouterLink, PopoverLinkDirective],
  templateUrl: './default-header-links.component.html',
  styleUrl: '../header-links.component.scss',
  providers: [ElectionCycleStore, Form3Service],
})
export class DefaultHeaderLinksComponent {
  private readonly el = inject(ElementRef);
  readonly electionCycleStore = inject(ElectionCycleStore);
  readonly loginService = inject(LoginService);
  readonly showAllTransactionsPage = environment.showAllTransactionsPage;
  readonly showForm3 = environment.showForm3;

  readonly toolsOp = viewChild.required<Popover>('toolsOp');
  readonly accountOp = viewChild.required<Popover>('accountOp');

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const toolsWrapper = target.closest('#tools-menu-link');
    if (!toolsWrapper) {
      this.toolsOp().hide();
    }

    const accountWrapper = target.closest('#account-menu-link');
    if (!accountWrapper) {
      this.accountOp().hide();
    }
  }

  toggleTools(event: Event) {
    this.accountOp().hide();
    this.toolsOp().toggle(event);
  }

  toggleAccount(event: Event) {
    this.toolsOp().hide();
    this.accountOp().toggle(event);
  }
}
