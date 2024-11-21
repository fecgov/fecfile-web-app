import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, interval, Subscription, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PollerService {
  private isNewVersionAvailable = new BehaviorSubject<boolean>(false);
  isNewVersionAvailable$ = this.isNewVersionAvailable.asObservable();
  versionCheckSubscription?: Subscription;
  constructor(private http: HttpClient) {}

  startPolling(deploymentUrl: string) {
    this.versionCheckSubscription = interval(5000)
      .pipe(switchMap(() => this.compareVersions(deploymentUrl)))
      .subscribe();
  }

  async compareVersions(deploymentUrl: string) {
    try {
      const fetchedPage = await firstValueFrom(this.http.get(deploymentUrl, { responseType: 'text' }));
      const loadedText = fetchedPage as string;
      const mainScriptRegex = /<script\s+src="(main\.[^"]+\.js)"\s+type="module"><\/script>/gim;
      const matchResponses = mainScriptRegex.exec(loadedText);
      const remoteMainScript = matchResponses && matchResponses.length > 0 ? matchResponses[1] : undefined;

      if (!remoteMainScript) {
        console.log('Could not find main script in index.html');
        this.isNewVersionAvailable.next(false);
        return;
      }

      const scriptTags = document.getElementsByTagName('script');
      let currentMainScript: string | undefined = undefined;
      for (let i = 0; i < scriptTags.length; i++) {
        const scriptTag = scriptTags[i];
        const match = /^.*\/(main.*\.js).*$/gim.exec(scriptTag.src);
        if (match) {
          currentMainScript = match[1];
          break;
        }
      }

      this.isNewVersionAvailable.next(
        !!currentMainScript && !!remoteMainScript && currentMainScript !== remoteMainScript,
      );
    } catch (error) {
      console.error('Error fetching deployment URL', error);
      this.isNewVersionAvailable.next(false);
    }
  }

  stopPolling() {
    this.versionCheckSubscription?.unsubscribe();
  }
}
