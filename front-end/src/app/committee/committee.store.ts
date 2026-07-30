import { Injectable, signal, effect } from '@angular/core';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';

const STORAGE_KEY = 'fecfile_online_committeeAccount';

@Injectable({
  providedIn: 'root',
})
export class CommitteeStore {
  private readonly _committee = signal<CommitteeAccount | null>(this.loadFromStorage());
  readonly committee = this._committee.asReadonly();

  private readonly _committeeChangedInOtherTab = signal<boolean>(false);
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
    this._committeeChangedInOtherTab.set(false);
  }

  private loadFromStorage(): CommitteeAccount | null {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error rehydrating committeeAccount:', error);
      return null;
    }
  }

  private handleStorageChange = (event: StorageEvent): void => {
    // Only handle changes to our key
    if (event.key !== STORAGE_KEY) return;

    const currentSerialized = JSON.stringify(this._committee());
    if (event.newValue !== currentSerialized) {
      this._committeeChangedInOtherTab.set(true);
    }
  };
}
