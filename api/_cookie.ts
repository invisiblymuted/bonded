export function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return header.split(";").reduce((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    acc[key] = rest.join("=");
    return acc;
  }, {} as Record<string, string>);
}

export function sessionCookie(sessionId: string) {
  const secure = process.env.VERCEL === "1";
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  const parts = [
    `bonded_session=${sessionId}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookie() {
  const parts = [
    "bonded_session=",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (process.env.VERCEL === "1") parts.push("Secure");
  return parts.join("; ");
}
