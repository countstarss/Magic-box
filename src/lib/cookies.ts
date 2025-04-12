/**
 * Set a cookie with the given name, value, and optional options
 */
export function setCookie(
  name: string,
  value: string,
  options: { days?: number; path?: string; domain?: string } = {}
) {
  const { days = 365, path = "/", domain } = options;

  // Calculate expiration date
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Construct cookie string
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${path}`;

  // Add domain if provided
  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  // Add SameSite and Secure attributes for better security in production
  if (process.env.NODE_ENV === "production") {
    cookieString += "; SameSite=Lax; Secure";
  }

  // Set the cookie
  document.cookie = cookieString;
}

/**
 * Get the value of a cookie by name
 * @returns The cookie value or undefined if not found
 */
export function getCookieValue(name: string): string | undefined {
  // Only run on client side
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) =>
    c.startsWith(`${encodeURIComponent(name)}=`)
  );

  if (cookie) {
    return decodeURIComponent(cookie.split("=")[1]);
  }

  return undefined;
}

/**
 * Remove a cookie by setting its expiration to the past
 */
export function removeCookie(name: string, path = "/") {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}
