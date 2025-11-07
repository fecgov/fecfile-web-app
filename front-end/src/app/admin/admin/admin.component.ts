import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/destroyer.component';
import { MessageService } from 'primeng/api';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  imports: [ReactiveFormsModule, Card, RouterLink],
})
export class AdminComponent extends DestroyerComponent implements OnInit {
  public readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  public readonly managementTools = [
    ['Enable User', 'enable-user'],
    ['Disable User', 'disable-user'],
    ['Add User to Committee', 'add-user-to-committee'],
  ];

  public readonly dashboards = [['Registered Committees Overview', 'committees-overview']];

  ngOnInit(): void {
    return;
  }
}
