export default function TrashButton({
  label = 'Delete',
  showLabel = false,
  className = '',
  ...props
}) {
  const sizeClasses = showLabel ? 'px-4 py-2 gap-2' : 'w-9 h-9';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-md border border-red-200 bg-white text-red-500 shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${sizeClasses} ${className}`}
      {...props}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
      {showLabel && <span className="font-medium text-red-600">{label}</span>}
    </button>
  );
}
