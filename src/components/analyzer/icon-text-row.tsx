import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  as?: 'p' | 'span';
  children: ReactNode;
  icon: LucideIcon;
  iconClassName?: string;
};

const ROW_CLASS = 'flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200';
const DEFAULT_ICON_CLASS = 'h-4 w-4 text-slate-400';

export function IconTextRow({ as = 'span', children, icon: Icon, iconClassName = DEFAULT_ICON_CLASS }: Props) {
  const needsParagraphSemantics = as === 'p';
  if (needsParagraphSemantics) {
    return (
      <p className={ROW_CLASS}>
        <Icon className={iconClassName} aria-hidden="true" />
        {children}
      </p>
    );
  }

  return (
    <span className={ROW_CLASS}>
      <Icon className={iconClassName} aria-hidden="true" />
      {children}
    </span>
  );
}
