const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmail = (value) => EMAIL_RE.test(String(value).trim());

export const validateEmail = (email) => {
  if (!email.trim()) return 'Email is required.';
  if (!isEmail(email)) return 'Enter a valid email address.';
  return null;
};

export const validatePassword = (password, { min = 8 } = {}) => {
  if (!password) return 'Password is required.';
  if (password.length < min) return `Password must be at least ${min} characters.`;
  return null;
};

export const validateRequired = (value, label) => {
  if (!String(value).trim()) return `${label} is required.`;
  return null;
};

export const validateNonNegativeInt = (value, label) => {
  const n = Number(value);
  if (value === '' || Number.isNaN(n)) return `${label} must be a number.`;
  if (n < 0) return `${label} cannot be negative.`;
  if (!Number.isInteger(n)) return `${label} must be a whole number.`;
  return null;
};
