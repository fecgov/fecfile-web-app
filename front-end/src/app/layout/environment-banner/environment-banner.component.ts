import { Component, computed, model } from '@angular/core';
import { environment } from 'environments/environment';

type BannerType = 'development' | 'stage' | 'test';

@Component({
  selector: 'app-environment-banner',
  templateUrl: './environment-banner.component.html',
  styleUrls: ['./environment-banner.component.scss'],
})
export class EnvironmentBannerComponent {
  readonly dismissed = model(false);
  readonly showBanner = computed(() => !!this.bannerConfig && !this.dismissed());

  readonly subtitle = 'This site is for testing ideas and code.';

  readonly config: Record<BannerType, { title: string; color: string }> = {
    development: {
      title: 'DEVELOPMENT',
      color: '#35BDBB',
    },
    stage: {
      title: 'STAGE',
      color: '#F77B42',
    },
    test: {
      title: 'TEST',
      color: '#0AACFA',
    },
  };

  readonly bannerConfig = environment.environmentBanner ? this.config[environment.environmentBanner] : null;

  dismiss(): void {
    this.dismissed.set(true);
  }
}
