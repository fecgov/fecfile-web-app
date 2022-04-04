import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import {DividerModule} from 'primeng/divider';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, ProfileRoutingModule, ButtonModule, DividerModule],
})
export class ProfileModule {}
