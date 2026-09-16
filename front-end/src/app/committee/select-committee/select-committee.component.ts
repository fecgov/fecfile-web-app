import { afterRenderEffect, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { UsersService } from 'app/shared/services/users.service';
import { userLoginDataRetrievedAction } from 'app/store/user-login-data.actions';
import { derivedAsync } from 'ngxtension/derived-async';
import { AccordionModule } from 'primeng/accordion';
import { CommitteeStore } from '../committee.store';

@Component({
  selector: 'app-select-committee',
  templateUrl: './select-committee.component.html',
  styleUrls: ['./select-committee.component.scss'],
  imports: [RouterLink, AccordionModule],
})
export class SelectCommitteeComponent {
  protected readonly committeeAccountService = inject(CommitteeAccountService);
  private readonly committeeStore = inject(CommitteeStore);
  private readonly store = inject(Store);
  protected readonly router = inject(Router);
  private readonly userService = inject(UsersService);
  readonly committees = derivedAsync(
    async () => {
      this.isLoading.set(true);
      const committees = await this.committeeAccountService.getCommittees();
      this.isLoading.set(false);
      return committees;
    },
    { initialValue: [] },
  );
  readonly activeCommittees = computed(() => this.committees().filter((c) => !c.disabled));
  readonly disabledCommittees = computed(() => this.committees().filter((c) => !!c.disabled));
  readonly disabledShown = signal(false);
  readonly content = viewChild<ElementRef<HTMLDivElement>>('content');
  readonly hasDisabledCommittees = computed(() => this.disabledCommittees().length > 0);
  readonly isLoading = signal(true);

  constructor() {
    this.committeeStore.clearCommittee();
    afterRenderEffect(() => {
      const isShown = this.disabledShown();
      const contentEl = this.content()?.nativeElement;
      if (!contentEl) return;
      if (isShown) {
        contentEl.style.height = contentEl.children[0].scrollHeight + 20 + 'px';
      } else {
        contentEl.style.height = '0px';
      }
    });
  }

  async activateCommittee(committee: CommitteeAccount): Promise<void> {
    const activatedCommittee = await this.committeeAccountService.activateCommittee(committee.id);
    this.committeeStore.setCommittee(activatedCommittee);
    this.userService.getCurrentUser().then((userLoginData) => {
      this.store.dispatch(userLoginDataRetrievedAction({ payload: userLoginData }));
    });
    await this.router.navigateByUrl(``);
  }

  toggle() {
    this.disabledShown.update((s) => !s);
  }
}
