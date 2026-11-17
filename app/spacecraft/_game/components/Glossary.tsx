import { useState } from 'react';
import { GLOSSARY } from '../data/glossary';

interface Props {
  terms: string[];
  /** 用語の説明を開いたとき（分析用に回数を数える） */
  onOpen?: (term: string) => void;
}

export function Glossary({ terms, onOpen }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="glossary">
      <span className="small muted">用語：</span>
      {terms.map((t) => (
        <button
          key={t}
          className={`term ${open === t ? 'active' : ''}`}
          aria-expanded={open === t}
          onClick={() => {
            const next = open === t ? null : t;
            setOpen(next);
            if (next) onOpen?.(next);
          }}
        >
          {t}
        </button>
      ))}
      {open && (
        <p className="term-desc" role="note">
          <strong>{open}</strong>：{GLOSSARY[open]}
        </p>
      )}
    </div>
  );
}
