import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

const DEFAULT_LIFE = 3000;
@Injectable()
export class MessageWrapperService {
  private readonly messageService = inject(MessageService);

  success(detail: string, life = DEFAULT_LIFE): void {
    this.messageService.add({ severity: 'success', summary: 'Successful', detail, life });
  }

  error(detail: string, life = DEFAULT_LIFE): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail, life });
  }
}
