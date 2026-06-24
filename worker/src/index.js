/**
 * Portfolio failover worker for portfolio.mr-romero.com
 *
 * Strategy:
 * 1. Try origin first (cloudflared tunnel to home server)
 * 2. On success: pass through response, populate cache
 * 3. On failure: serve from cache -> serve static fallback
 */

// Origin: cloudflared tunnel internal endpoint (reachable from Cloudflare Workers)
// The tunnel routes based on the Host header, so we set it to portfolio.mr-romero.com
// which the tunnel already has configured -> localhost:9009
const ORIGIN = 'https://1d2c0fc1-0f47-4e4f-89dd-a35dfc7c9367.cfargotunnel.com';

// Cache TTL: 1 hour for HTML, 24 hours for assets
function cacheTtl(url) {
  const pathname = new URL(url).pathname;
  if (pathname.endsWith('.html') || pathname === '/' || !pathname.includes('.')) {
    return 3600; // 1 hour
  }
  return 86400; // 24 hours for static assets
}

async function serveFromCache(request, cache) {
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  return null;
}

async function serveFallback(env) {
  // Return a clean static page when origin is unreachable
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Abraham Romero Torres — M.Ed. E-Portfolio</title>
<style>
  :root { --navy: #0C2340; --orange: #FFA300; --cream: #f8f7f5; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Segoe UI',system-ui,-apple-system,sans-serif; background:var(--cream); color:#222; line-height:1.7; display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center; }
  .card { background:#fff; padding:3rem 2rem; border-radius:12px; box-shadow:0 4px 24px rgba(0,0,0,0.08); max-width:500px; margin:2rem; }
  .card h1 { font-size:1.5rem; color:var(--navy); margin-bottom:0.5rem; }
  .card .badge { display:inline-block; background:var(--orange); color:#fff; padding:0.25rem 0.75rem; border-radius:20px; font-size:0.85rem; margin-bottom:1rem; }
  .card p { color:#555; margin-bottom:1.5rem; }
  .card a { color:var(--navy); text-decoration:underline; }
</style>
</head>
<body>
<div class="card">
  <div class="badge">Temporarily Unavailable</div>
  <h1>Abraham Romero Torres</h1>
  <p>M.Ed. Curriculum &amp; Instruction — E-Portfolio</p>
  <p>The full portfolio is momentarily unavailable. It will be back online shortly.</p>
  <p style="font-size:0.85rem;color:#888;">If this persists, contact <a href="mailto:aromero@vanguardac.net">aromero@vanguardac.net</a></p>
</div>
</body>
</html>`;

  return new Response(html, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Failover': 'static-fallback',
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cache = caches.default;

    // Try origin
    try {
      const originUrl = ORIGIN + url.pathname + url.search;
      // Pass portfolio.mr-romero.com as Host so the tunnel routes to localhost:9009
      const originHeaders = new Headers(request.headers);
      originHeaders.set('Host', 'portfolio.mr-romero.com');
      const originRequest = new Request(originUrl, {
        method: request.method,
        headers: originHeaders,
        body: request.body,
        redirect: 'follow',
      });

      const originResponse = await fetch(originRequest, {
        cf: { cacheEverything: false },
      });

      if (originResponse.ok || originResponse.status < 500) {
        // Clone and populate cache in background
        const clone = originResponse.clone();
        ctx.waitUntil(
          cache.put(request, clone)
        );

        // Add header so we know it came from origin
        const headers = new Headers(originResponse.headers);
        headers.set('X-Served-By', 'origin');
        return new Response(originResponse.body, {
          status: originResponse.status,
          headers,
        });
      }

      // Origin returned 5xx — try cache
      const cached = await serveFromCache(request, cache);
      if (cached) {
        const headers = new Headers(cached.headers);
        headers.set('X-Served-By', 'cache');
        return new Response(cached.body, { status: cached.status, headers });
      }

      return serveFallback(env);
    } catch (e) {
      // Origin unreachable — try cache
      const cached = await serveFromCache(request, cache);
      if (cached) {
        const headers = new Headers(cached.headers);
        headers.set('X-Served-By', 'cache');
        return new Response(cached.body, { status: cached.status, headers });
      }

      return serveFallback(env);
    }
  },
};
