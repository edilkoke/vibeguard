// VibeGuard secure-by-default Next.js config.
// Sets the security header baseline on every response. (VG-018)
// Tighten the CSP to your actual origins before production.

/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Force HTTPS for two years, including subdomains. (HSTS)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Disallow MIME sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking protection (legacy + CSP frame-ancestors below).
  { key: "X-Frame-Options", value: "DENY" },
  // Limit referrer leakage.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser features by default.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Baseline Content-Security-Policy — replace 'self' allowances with your real domains.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // don't advertise the framework
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
