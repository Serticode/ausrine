import type { Result } from '@/domain/models/Result.ts';
import type { OnboardingConfig } from '@/domain/models/OnboardingConfig.ts';

export interface ConfigRepository {
  get(): Promise<Result<OnboardingConfig | null>>;
  save(config: OnboardingConfig): Promise<Result<void>>;
}
