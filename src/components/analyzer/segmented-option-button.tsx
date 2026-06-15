import type { ReactNode } from 'react';

type Props = {
  active: boolean;
  children: ReactNode;
  onSelect: () => void;
};

export function SegmentedOptionButton({ active, children, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={active}
      className={`flex flex-col items-center gap-1 rounded-md px-2 py-1.5 transition ${
        active
          ? 'bg-white font-bold text-[#0b5c30] shadow-sm dark:bg-[#3a3d42] dark:text-[#4ade80]'
          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}
