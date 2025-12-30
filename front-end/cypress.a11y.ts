/// <reference types="cypress" />

type A11ySummary = {
  durationMs: number;
  violations: number;
  unwaivedViolations: number;
  waivedViolations: number;
  ruleIds: string[];
  nodesAffected: number;
  timestamp: string;
  scope?: string;
};

type PluginEvents = Cypress.PluginEvents;

const isA11ySpec = (spec: any): boolean => {
  const name =
    spec?.name ||
    spec?.relative ||
    spec?.fileName ||
    spec?.path ||
    '';
  return /a11y/i.test(String(name));
};

const registerA11yNodeEvents = (on: PluginEvents, isEnabled: () => boolean) => {
  on('task', {
    log(message: string) {
      if (!isEnabled()) return null;
      // eslint-disable-next-line no-console
      console.log(message);
      return null;
    },
    'a11y:record'(payload: { testId?: string; summary?: A11ySummary }) {
      if (!isEnabled()) return null;
      if (!payload?.testId || !payload?.summary) return null;
      return null;
    },
  });
};

export const setupA11yNodeEvents = (on: PluginEvents) => {
  const state = { enabled: false };

  on('before:spec', (spec: any) => {
    state.enabled = isA11ySpec(spec);
  });

  registerA11yNodeEvents(on, () => state.enabled);
};
