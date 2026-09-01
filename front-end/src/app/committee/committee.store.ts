import { DestroyRef, Injectable, effect, inject, signal } from '@angular/core';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';

const STORAGE_KEY = 'fecfile_online_committeeAccount';

@Injectable({
  providedIn: 'root',
})
export class CommitteeStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly _committee = signal<CommitteeAccount | null>(this.loadFromStorage());
  readonly committee = this._committee.asReadonly();

  private readonly _committeeChangedInOtherTab = signal(false);
  readonly committeeChangedInOtherTab = this._committeeChangedInOtherTab.asReadonly();

  constructor() {
    effect(() => {
      const account = this._committee();

      try {
        if (account) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error saving committeeAccount to localStorage:', error);
      }
    });

    window.addEventListener('storage', this.handleStorageChange);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('storage', this.handleStorageChange);
    });
  }

  setCommittee(committee: CommitteeAccount): void {
    this._committee.set(committee);
  }

  clearCommittee(): void {
    this._committee.set(null);
  }

  reloadFromStorage(): void {
    const updated = this.loadFromStorage();
    this._committee.set(updated);
  }

  private loadFromStorage(): CommitteeAccount | null {
    try {
      const item = localStorage.getItem(STORAGE_KEY);

      return item ? CommitteeAccount.fromJSON(JSON.parse(item)) : null;
    } catch (error) {
      console.error('Error rehydrating committeeAccount:', error);
      return null;
    }
  }

  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key !== STORAGE_KEY) return;

    try {
      if (!event.newValue) return;

      const updatedCommittee = CommitteeAccount.fromJSON(JSON.parse(event.newValue));

      const currentCommitteeId = this._committee()?.id;
      const updatedCommitteeId = updatedCommittee.id;

      if (updatedCommitteeId !== currentCommitteeId) {
        this._committeeChangedInOtherTab.set(true);
      }
    } catch (error) {
      console.error('Error processing committee storage change:', error);
    }
  };
}
