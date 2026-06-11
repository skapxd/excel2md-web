type Props = {
  sheets: string[];
  active: string;
  onSelectSheet: (sheet: string) => void;
};

export function SheetTabs({ active, onSelectSheet, sheets }: Props) {
  return (
    <div className="flex overflow-x-auto border-t border-[var(--chrome-border)] bg-[var(--chrome-bg)] px-1">
      {sheets.map((sheet) => (
        <button
          key={sheet}
          onClick={() => onSelectSheet(sheet)}
          className={`whitespace-nowrap border-b-[3px] px-4 py-1.5 text-sm transition ${
            sheet === active
              ? 'border-[var(--accent)] bg-[var(--cell-bg)] font-bold text-[color:var(--cell-formula-text)]'
              : 'border-transparent text-[color:var(--header-text)] hover:bg-[var(--cell-hover)]'
          }`}
        >
          {sheet}
        </button>
      ))}
    </div>
  );
}
