import { FiStar } from 'react-icons/fi';

export default function Rating({ value = 0, count, size = 13 }) {
  const rating = Number.isFinite(Number(value)) ? Number(value) : 0;
  return (
    <span className="rating" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: size }}>
      <FiStar size={size + 1} fill="var(--gold)" color="var(--gold)" />
      <strong style={{ color: 'var(--ink)' }}>{rating.toFixed(1)}</strong>
      {count != null && <span className="muted">({count})</span>}
    </span>
  );
}

export function StarInput({ value, onChange, size = 26 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <FiStar
          key={n}
          size={size}
          fill={n <= value ? 'var(--gold)' : 'none'}
          color="var(--gold)"
          style={{ cursor: 'pointer' }}
          onClick={() => onChange(n)}
        />
      ))}
    </span>
  );
}
