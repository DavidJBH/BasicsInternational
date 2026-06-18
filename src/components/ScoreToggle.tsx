import type { Score } from '../types';

const OPTIONS: { value: Score; label: string }[] = [
  { value: -1, label: '−1' },
  { value: 0, label: '0' },
  { value: 1, label: '+1' },
];

const ACTIVE_CLASSES: Record<Score, string> = {
  [-1]: 'bg-red-500 text-white',
  0: 'bg-gray-400 text-white',
  1: 'bg-green-500 text-white',
};

export function ScoreToggle({
  value,
  onChange,
}: {
  value: Score;
  onChange: (value: Score) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {OPTIONS.map((opt) => (
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
