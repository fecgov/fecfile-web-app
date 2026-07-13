import { Component, computed, input, model, output, signal } from '@angular/core';
import { Contact, isEntity } from 'app/shared/models/contact.model';
import { StatePipe } from '../../../pipes/state.pipe';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-duplicate-contact',
  imports: [StatePipe, ButtonModule, ProgressSpinnerModule],
  templateUrl: './duplicate-contact.component.html',
  styleUrl: './duplicate-contact.component.scss',
})
export class DuplicateContactComponent {
  readonly hideDuplicateWarning = model.required<boolean>();
  readonly existingContacts = input.required<Contact[]>();
  readonly useContact = output<Contact>();

  readonly potentialDuplicates = computed(() => {
    const name = this.name().toLowerCase();
    return this.existingContacts().filter(
      (c) => name === (isEntity(c.type) ? c.name : `${c.last_name}, ${c.first_name}`)?.toLowerCase(),
    );
  });
  readonly validName = computed(() => {
    const name = this.name();
    const splitName = name.split(',').map((item) => item.trim());
    return !splitName.includes('');
  });

  readonly closeDuplicateWarning = () => this.hideDuplicateWarning.set(true);

  readonly checkingName = signal(false);
  private currentInputValues: [string, string] = ['', ''];
  private readonly personName = signal<[string, string]>(['', '']);
  readonly name = computed(() => {
    const [last, first] = this.personName();
    return `${last ?? ''}, ${first ?? ''}`;
  });

  private debounceTimer: string | number | NodeJS.Timeout | undefined = undefined;
  updateName(event: Event, fieldName: 'last_name' | 'first_name') {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (fieldName === 'last_name') {
      this.currentInputValues[0] = value;
    } else {
      this.currentInputValues[1] = value;
    }

    const [last, first] = this.currentInputValues;
    // don't mark checkingName unless we would end up with a valid name (both first and last)
    if (last.trim() !== '' && first.trim() !== '') {
      this.checkingName.set(true);
    }

    this.debounceTimer = setTimeout(() => {
      this.personName.set([last, first]);
      this.checkingName.set(false);
    }, 600);
  }
}
