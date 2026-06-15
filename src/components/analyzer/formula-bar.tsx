type Props = {
  address: string;
  content: string;
};

export function FormulaBar({ address, content }: Props) {
  return (
    <div className="flex items-stretch border-b border-[var(--chrome-border)] bg-[var(--chrome-bg)] text-sm">
      <div
        className={`flex w-20 shrink-0 items-center justify-center border-r border-[var(--chrome-border)] bg-[var(--cell-bg)] px-2 py-1.5 font-mono text-sm font-bold ${
          address ? 'text-[color:var(--cell-formula-text)]' : 'text-slate-300 dark:text-slate-600'
        }`}
      >
        {address || '—'}
      </div>
      <div className="flex items-center border-r border-[var(--chrome-border)] px-3 py-1.5 font-serif text-base font-semibold italic text-[#107c41] dark:text-[#6ee7a0]">
        fx
      </div>
      <div className="flex flex-1 items-center overflow-x-auto whitespace-nowrap bg-[var(--cell-bg)] px-3 py-1.5 font-mono text-[color:var(--cell-text)]">
        {content}
      </div>
    </div>
  );
}
