import { Component, computed, inject } from '@angular/core';
import { API_CONFIG } from 'environments/tokens/api.config';

type BannerType = 'development' | 'stage' | 'test';

@Component({
  selector: 'app-environment-banner',
  templateUrl: './environment-banner.component.html',
  styleUrls: ['./environment-banner.component.scss'],
})
export class EnvironmentBannerComponent {
  private readonly apiConfig = inject(API_CONFIG);
  readonly showBanner = computed(() => !!this.bannerConfig);

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

  readonly bannerConfig = this.apiConfig.environmentBanner ? this.config[this.apiConfig.environmentBanner] : null;
}
