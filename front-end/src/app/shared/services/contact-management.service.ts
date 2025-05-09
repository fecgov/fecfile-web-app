import { Injectable, signal, computed, effect } from '@angular/core';
import { Contact } from '../models/contact.model'; // Adjust the import path

@Injectable({
  providedIn: 'root',
})
export class ContactManagementService {
  private readonly contactsMap = new Map<string, ReturnType<typeof signal<Contact | null>>>();

  // Get the signal for a specific contact key (e.g., 'contact_1', 'contact_2')
  getContactSignal(key: string) {
    if (!this.contactsMap.has(key)) {
      this.contactsMap.set(key, signal<Contact | null>(null));
    }
    return this.contactsMap.get(key)!;
  }

  // Set the contact value for a specific key
  setContact(key: string, contact: Contact | null): void {
    this.getContactSignal(key).set(contact);
  }

  // Get the current contact value for a specific key
  getCurrentContact(key: string): Contact | null {
    return this.getContactSignal(key)();
  }
}