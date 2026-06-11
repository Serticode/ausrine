export interface BrainDumpCandidate {
  readonly text: string;
  readonly isLong: boolean;
}

export function brainDump(raw: string): BrainDumpCandidate[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((text) => ({
      text,
      isLong: text.length > 80,
    }));
}
