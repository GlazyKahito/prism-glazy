type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
  );
}

export function Plus(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Search(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  );
}

export function Lock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

export function Doc(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

export function Folder(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h3.6l2 2.2H18a2.5 2.5 0 0 1 2.5 2.5v7.8A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5z" />
    </svg>
  );
}

export function Ticket(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" />
      <path d="M10 9v6" strokeDasharray="1.5 2" />
    </svg>
  );
}

export function Chat(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 12.5a7.5 7.5 0 0 1-11.1 6.6L4 20l1-4.4A7.5 7.5 0 1 1 20 12.5z" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </svg>
  );
}

export function Code(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13" />
    </svg>
  );
}

export function Sheet(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M4 10h16M4 15h16M10 4v16" />
    </svg>
  );
}

export function Sparkle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5c.6 4.3 2.7 6.4 7 7-4.3.6-6.4 2.7-7 7-.6-4.3-2.7-6.4-7-7 4.3-.6 6.4-2.7 7-7z" />
    </svg>
  );
}

export function Shield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 5 6v5.5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  );
}

export function Refresh(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19.5 12a7.5 7.5 0 0 1-13.2 4.9M4.5 12a7.5 7.5 0 0 1 13.2-4.9" />
      <path d="M18 3.5v3.8h-3.8M6 20.5v-3.8h3.8" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Alert(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4 3 19.5h18z" />
      <path d="M12 10v4M12 17v.01" />
    </svg>
  );
}
