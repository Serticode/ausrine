import type { TourStep } from '@/presentation/core/useTour.ts';

interface TourOverlayProps {
  readonly step: TourStep;
  readonly stepIndex: number;
  readonly total: number;
  readonly onNext: () => void;
  readonly onSkip: () => void;
}

export function TourOverlay({ step, stepIndex, total, onNext, onSkip }: TourOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 animate-fade-in">
      <div className="glass-popover p-6 max-w-[320px] text-center animate-scale-in">
        {/* Step indicator */}
        <div className="flex justify-center gap-1 mb-3">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === stepIndex ? 'bg-ausrine-accent' : 'bg-gold-300'
              }`}
            />
          ))}
        </div>

        <h3 className="text-[16px] font-medium tracking-[-0.01em] text-gold-900 mb-1">{step.title}</h3>
        <p className="text-[13px] leading-relaxed tracking-[-0.01em] text-gold-600 mb-5">{step.body}</p>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onSkip}
            className="text-[11px] tracking-[0.04em] uppercase text-gold-400 hover:text-gold-600 transition-colors cursor-pointer"
          >
            Skip tour
          </button>
          <button
            type="button"
            onClick={onNext}
            className="glass-btn px-4 py-1.5 text-[12px] font-medium text-gold-800 cursor-pointer"
          >
            {stepIndex === total - 1 ? 'Got it' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
