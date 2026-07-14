import { Component, computed, input, output, signal } from '@angular/core';
import { Contact, ContactTypes, isEntity } from 'app/shared/models/contact.model';
import { StatePipe } from '../../../pipes/state.pipe';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface Names {
  first_name: string;
  last_name: string;
  name: string;
}

@Component({
  selector: 'app-duplicate-contact',
  imports: [StatePipe, ButtonModule, ProgressSpinnerModule],
  templateUrl: './duplicate-contact.component.html',
  styleUrl: './duplicate-contact.component.scss',
})
export class DuplicateContactComponent {
  readonly existingContacts = input.required<Contact[]>();
  readonly type = input.required<ContactTypes>();
  readonly isEntity = computed(() => isEntity(this.type()));
  readonly useContact = output<Contact>();

  readonly hideDuplicateWarning = signal(false);
  readonly potentialDuplicates = computed(() => {
    const name = this.name().toLowerCase();
    const type = this.type();
    return this.existingContacts().filter(
      (c) => type === c.type && name === (isEntity(c.type) ? c.name : `${c.last_name}, ${c.first_name}`)?.toLowerCase(),
    );
  });
  readonly validName = computed(() => {
    const name = this.name();
    const splitName = name.split(',').map((item) => item.trim());
    return !splitName.includes('');
  });

  readonly closeDuplicateWarning = () => this.hideDuplicateWarning.set(true);

  readonly checkingName = signal(false);
  private currentInputValues: Names = { first_name: '', last_name: '', name: '' };
  private readonly names = signal<Names>({ first_name: '', last_name: '', name: '' });
  readonly name = computed(() => {
    const { last_name, first_name, name } = this.names();
    return this.isEntity() ? name : `${last_name ?? ''}, ${first_name ?? ''}`;
  });

  private debounceTimer: string | number | NodeJS.Timeout | undefined = undefined;
  updateName(event: Event, fieldName: keyof Names) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.currentInputValues[fieldName] = value;
    const { last_name, first_name, name } = this.currentInputValues;
    // don't mark checkingName unless we would end up with a valid name
    if (this.isEntity() ? name.trim() !== '' : last_name.trim() !== '' && first_name.trim() !== '') {
      this.checkingName.set(true);
    }

    this.debounceTimer = setTimeout(() => {
      this.names.set({ last_name, first_name, name });
      this.checkingName.set(false);
    }, 400);
  }

  refresh() {
    this.names.set({ first_name: '', last_name: '', name: '' });
    this.currentInputValues = { first_name: '', last_name: '', name: '' };
    this.checkingName.set(false);
    this.hideDuplicateWarning.set(false);
  }
}
