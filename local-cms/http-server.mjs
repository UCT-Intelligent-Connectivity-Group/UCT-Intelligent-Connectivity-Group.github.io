import { createServer, request as requestHTTP } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };

export function createEditorServer({ editorRoot, assetsRoot, backendPort = 8081 }) {
  return createServer(async (req, res) => {
    const fail = (code, message) => { res.writeHead(code, { 'Content-Type': 'text/plain' }); res.end(message); };
    const port = req.socket.localPort;
    const allowedHosts = [`127.0.0.1:${port}`, `localhost:${port}`];
    if (!allowedHosts.includes(req.headers.host)) return fail(403, 'Local editor only.');
    if (req.headers.origin && !allowedHosts.map(host => `http://${host}`).includes(req.headers.origin)) return fail(403, 'Unexpected origin.');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname); }
    catch { return fail(400, 'Invalid path.'); }
    if (pathname === '/api/v1') {
      if (req.method !== 'POST') return fail(405, 'Use POST.');
      const upstream = requestHTTP({ hostname: '127.0.0.1', port: backendPort, path: '/api/v1', method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:8082' } }, response => {
        res.writeHead(response.statusCode ?? 502, { 'Content-Type': response.headers['content-type'] ?? 'application/json' });
        response.pipe(res);
      });
      upstream.on('error', () => { if (!res.headersSent) fail(503, 'Local content service unavailable. Restart npm run cms.'); else res.destroy(); });
      req.pipe(upstream);
      return;
    }
    if (!['GET', 'HEAD'].includes(req.method)) return fail(405, 'Read-only assets.');
    let root, relative;
    if (pathname.startsWith('/assets/')) { root = assetsRoot; relative = pathname.slice('/assets/'.length); }
    else if (['/', '/index.html', '/config.json', '/start.js'].includes(pathname) || pathname.startsWith('/vendor/')) {
      root = editorRoot; relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    } else return fail(404, 'Not found.');
    try {
      const base = await realpath(root);
      const file = await realpath(resolve(base, relative));
      if (!file.startsWith(base + sep)) return fail(403, 'Invalid asset path.');
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch { fail(404, 'Not found.'); }
  });
}
