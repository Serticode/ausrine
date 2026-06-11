export interface OnboardingConfig {
  readonly id: string;
  readonly isComplete: boolean;
  readonly autoArchiveHour: number;
  readonly autoArchiveMinute: number;
  readonly reviewReminderTimes: readonly number[];
  readonly soundEnabled: boolean;
  readonly darkMode: boolean;
  readonly newTabPageEnabled: boolean;
}

export function onboardingConfigToJSON(config: OnboardingConfig): OnboardingConfigJSON {
  return {
    id: config.id,
    isComplete: config.isComplete,
    autoArchiveHour: config.autoArchiveHour,
    autoArchiveMinute: config.autoArchiveMinute,
    reviewReminderTimes: config.reviewReminderTimes,
    soundEnabled: config.soundEnabled,
    darkMode: config.darkMode,
    newTabPageEnabled: config.newTabPageEnabled,
  };
}

export function onboardingConfigFromJSON(json: OnboardingConfigJSON): OnboardingConfig {
  return { ...json };
}

export type OnboardingConfigJSON = Omit<OnboardingConfig, never>;
