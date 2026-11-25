import { useEffect, useState } from 'react';
import { scanService } from '@/services/scanService';

interface LoadingOverlayProps {
  isVisible: boolean;
  steps?: readonly string[];
  subtitle?: string;
}

export function LoadingOverlay({
  isVisible,
  steps,
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return <LoadingOverlayContent steps={steps} />;
}

function LoadingOverlayContent({ steps }: { steps?: readonly string[] }) {
  const activeSteps =
    steps && steps.length > 0 ? steps : scanService.getAnalysisSteps();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % activeSteps.length);
    }, 1050);

    return () => clearInterval(interval);
  }, [activeSteps.length]);

  const progressPercent = Math.round(
    ((currentStep + 1) / activeSteps.length) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-sky-lighter to-surface px-6">
      {/* Blueprint Animation SVG (Sesuai Prototipe HTML) */}
      <div className="relative mb-8 h-40 w-40 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#0F3A7D 1px, transparent 1px)',
            backgroundSize: '10px 10px',
          }}
        />
        <svg viewBox="0 0 100 100" className="relative z-10 h-full w-full">
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            rx="8"
            fill="none"
            stroke="#3B9FD9"
            strokeWidth="2"
            className="animate-blueprint-line"
          />
          <path
            d="M 10 50 L 90 50 M 50 10 L 50 90"
            fill="none"
            stroke="#3B9FD9"
            strokeWidth="1.5"
            strokeDasharray="4"
            className="animate-blueprint-line"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="#0F3A7D"
            strokeWidth="2"
            className="animate-blueprint-line"
          />
          <path
            d="M 36 36 L 64 64 M 36 64 L 64 36"
            fill="none"
            stroke="#0F3A7D"
            strokeWidth="1.5"
            className="animate-blueprint-line"
          />
        </svg>
        <div className="animate-scan-beam absolute inset-x-0 h-10 rounded bg-gradient-to-b from-transparent via-sky/30 to-transparent" />
      </div>

      {/* Progress Text & Bar */}
      <div className="flex w-full max-w-[240px] flex-col items-center">
        <h2 className="mb-2 min-h-7 text-center text-lg font-bold text-navy">
          {activeSteps[currentStep]}
        </h2>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-sky transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
