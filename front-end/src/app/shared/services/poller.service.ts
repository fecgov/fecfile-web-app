import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PollerService {
  private readonly http = inject(HttpClient);
  private readonly deploymentUrl = signal<string | null>(null);
  private readonly currentMainScript = signal<string | null>(null);
  private readonly remoteMainScript = signal<string | null>(null);

  readonly isNewVersionAvailable = computed(() => {
    const current = this.currentMainScript();
    const remote = this.remoteMainScript();
    return !!current && !!remote && current !== remote;
  });

  constructor() {
    this.initCurrentMainScript();

    effect((onCleanup) => {
      const url = this.deploymentUrl();
      if (!url) return;

      const intervalId = setInterval(() => {
        this.fetchRemoteMainScript(url);
      }, 5000);

      onCleanup(() => {
        clearTimeout(intervalId);
      });
    });
  }

  startPolling(deploymentUrl: string) {
    this.deploymentUrl.set(deploymentUrl);
  }

  stopPolling() {
    this.deploymentUrl.set(null);
  }

  private initCurrentMainScript() {
    const scriptTags = document.getElementsByTagName('script');
    for (const scriptTag of Array.from(scriptTags)) {
      const match = /^.*\/(main.*\.js).*$/gim.exec(scriptTag.src);
      if (match) {
        this.currentMainScript.set(match[1]);
        return;
      }
    }
    this.currentMainScript.set(null);
  }

  private async fetchRemoteMainScript(deploymentUrl: string) {
    try {
      const loadedText = await firstValueFrom(this.http.get(deploymentUrl, { responseType: 'text' }));
      const mainScriptRegex = /<script\s+src="(main\.[^"]+\.js)"\s+type="module"><\/script>/gim;
      const matchResponses = mainScriptRegex.exec(loadedText);
      const remoteScript = matchResponses && matchResponses.length > 0 ? matchResponses[1] : null;
      this.remoteMainScript.set(remoteScript);
    } catch (error) {
      console.error('Error fetching deployment URL', error);
      this.remoteMainScript.set(null);
    }
  }
}
