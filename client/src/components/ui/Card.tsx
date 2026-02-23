import clsx from 'clsx';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps): React.JSX.Element {
  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
