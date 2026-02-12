import { Injectable } from '@angular/core';

@Injectable()
export class IdGeneratorService {
  private static globalCounter = 0;
  private readonly instanceId = IdGeneratorService.globalCounter++;

  getIdLabel(prefix: string): { id: string; label: string } {
    const id = `${prefix}-${this.instanceId}`;
    return { id, label: `${id}-label` };
  }
}
