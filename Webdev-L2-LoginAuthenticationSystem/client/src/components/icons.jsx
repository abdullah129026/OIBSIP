const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function MailIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function LockIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function UserIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function UserPlusIcon(props) {
  return (
    <svg {...base} {...props} viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21a7 7 0 0 1 14 0" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  );
}

export function LoginIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  );
}

export function EyeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeSlashIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 8 10 8a18 18 0 0 1-2.16 3.19" />
      <path d="M6.6 6.6A18 18 0 0 0 2 12s3.5 8 10 8a9 9 0 0 0 5.4-1.6" />
      <path d="m2 2 20 20" />
      <path d="M9.5 9.5a3 3 0 0 0 4.24 4.24" />
    </svg>
  );
}

export function ArrowMarkIcon(props) {
  return (
    <svg {...base} {...props} width="12" height="12">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function GoogleIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C36 8.2 30.3 6 24 6 14.6 6 7 13.6 7 23s7.6 17 17 17 17-7.6 17-17c0-1.1-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M9 15.8l6.6 4.8C17.4 16.1 20.4 14 24 14c3.1 0 5.9 1.2 8 3.1l5.7-5.7C36 8.2 30.3 6 24 6 16.3 6 9.7 10.3 6.3 16.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 42c6.2 0 11.8-2.1 15.7-6.9l-6.2-5.2C31.4 32 27.9 33.4 24 33.4c-5.2 0-9.6-3.3-11.2-7.9L6.2 30.5C9.5 37 16.2 42 24 42z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.2C41 34.6 44 29.2 44 23c0-1.1-.1-2.3-.4-2.5z"
      />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877f2" {...props}>
      <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7v-3.5h3.1V9.4c0-3.1 1.8-4.8 4.6-4.8 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
    </svg>
  );
}

export function AppleIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#000000" {...props}>
      <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7 1.9-1.1 2.6-2.1c.8-1.2 1.2-2.4 1.2-2.4-.1 0-2.3-.9-2.3-3.6zM14.2 5.9c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.3-.6.7-1.1 1.7-.9 2.7 1 .1 2-.5 2.6-1.1z" />
    </svg>
  );
}
