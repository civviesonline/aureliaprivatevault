/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              [
                "default-src 'self'",
                "base-uri 'self'",
                "object-src 'none'",
                "frame-ancestors 'none'",
                "form-action 'self'",
                "frame-src 'none'",
                "img-src 'self' data: blob:",
                // Compatible CSP for this repo style (inline scripts may exist)
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                // Compatible CSP for this repo style (inline styles may exist)
                "style-src 'self' 'unsafe-inline'",
                "connect-src 'self' https: http:",
                "font-src 'self' data:",
                'upgrade-insecure-requests',
              ].join('; '),
          },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), vr=()',
          },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

