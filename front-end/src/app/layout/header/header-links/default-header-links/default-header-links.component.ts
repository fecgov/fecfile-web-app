import { NgOptimizedImage } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Form3Service } from 'app/shared/services/form-3.service';
import { LoginService } from 'app/shared/services/login.service';
import { environment } from 'environments/environment';
import { ElectionCycleStore } from 'app/tools/election-cycle/election-cycle.store';

@Component({
  selector: 'app-default-header-links',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './default-header-links.component.html',
  styleUrl: '../header-links.component.scss',
  providers: [ElectionCycleStore, Form3Service],
})
export class DefaultHeaderLinksComponent {
  readonly router = inject(Router);
  readonly electionCycleStore = inject(ElectionCycleStore);
  readonly loginService = inject(LoginService);
  readonly showAllTransactionsPage = environment.showAllTransactionsPage;
  readonly showForm3 = environment.showForm3;

  readonly toolsHidden = signal(true);
  readonly accountHidden = signal(true);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const toolsWrapper = target.closest('#tools-menu-link');
    if (!toolsWrapper) this.toolsHidden.set(true);

    const accountWrapper = target.closest('#account-menu-link');
    if (!accountWrapper) this.accountHidden.set(true);
  }

  clickLink(route: string) {
    this.accountHidden.set(true);
    this.toolsHidden.set(true);
    this.router.navigateByUrl(route);
  }
}
