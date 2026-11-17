import type { Effect, ValueKey } from '../engine/types';
import { LABELS, LOWER_IS_BETTER, UNITS } from '../engine/values';

export function EffectChips({ effects, hide = [] }: { effects: Effect; hide?: ValueKey[] }) {
  const items = (Object.entries(effects) as [ValueKey, number][]).filter(([k, v]) => v !== 0 && !hide.includes(k));
  if (items.length === 0) return null;
  return (
    <span className="chips">
      {items.map(([k, v]) => {
        const good = LOWER_IS_BETTER.includes(k) ? v < 0 : v > 0;
        return (
          <span key={k} className={`chip ${good ? 'good' : 'bad'}`}>
            {LABELS[k]} {v > 0 ? '+' : ''}
            {v}
            {UNITS[k]}
          </span>
        );
      })}
    </span>
  );
}
