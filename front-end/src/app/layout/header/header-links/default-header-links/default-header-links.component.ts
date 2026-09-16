import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Form3Service } from 'app/shared/services/form-3.service';
import { LoginService } from 'app/shared/services/login.service';
import { environment } from 'environments/environment';
import { PopoverModule } from 'primeng/popover';
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
  readonly electionCycleStore = inject(ElectionCycleStore);
  readonly loginService = inject(LoginService);
  readonly showAllTransactionsPage = environment.showAllTransactionsPage;
  readonly showForm3 = environment.showForm3;
}
