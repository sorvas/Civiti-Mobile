/** Basic email format check — not RFC 5322 compliant but catches common typos. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
