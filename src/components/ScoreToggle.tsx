import type { Score } from '../types';

const ACTIVE_CLASSES: Record<Score, string> = {
  [-1]: 'bg-red-500 text-white',
  0: 'bg-gray-400 text-white',
  1: 'bg-green-500 text-white',
};

export function ScoreToggle({
  value,
  onChange,
  options,
  disabled = false,
  className = '',
}: {
  value: Score;
  onChange: (value: Score) => void;
  options: { value: Score; label: string }[];
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex gap-1.5 ${disabled ? 'opacity-30 pointer-events-none' : ''} ${className}`.trim()}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`min-w-11 h-11 flex-1 rounded-lg text-sm font-semibold transition-colors active:scale-95 ${
            value === opt.value ? ACTIVE_CLASSES[opt.value] : 'bg-gray-100 text-gray-500'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
