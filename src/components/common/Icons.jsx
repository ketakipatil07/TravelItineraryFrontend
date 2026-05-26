const base = {
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function PlaneIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M10.5 19.5 12 14l7.5 6 1.5-1.5L15 9l6-6-1.5-1.5-6 6L4.5 3 3 4.5l6 7.5-5.5 1.5L2 15l6 1 1 6 1.5-2.5Z" />
    </svg>
  );
}

export function UploadIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M20 16.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5" />
    </svg>
  );
}

export function FileIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}

export function ImageIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  );
}

export function CheckIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function AlertIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="m21.7 18-8.6-15a1.3 1.3 0 0 0-2.2 0L2.3 18a1.3 1.3 0 0 0 1.1 2h17.2a1.3 1.3 0 0 0 1.1-2Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function ClockIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function MapPinIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function CalendarIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

export function ListIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

export function LinkIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
      <path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
    </svg>
  );
}

export function CopyIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <rect width="14" height="14" x="8" y="8" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export function MailIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

export function MessageIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.8 8.8 0 0 1-3.7-.8L3 21l1.9-5.1a8.4 8.4 0 1 1 16.1-4.4Z" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
