import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createEditorServer } from './http-server.mjs';

test('separate editor serves assets and proxies content without exposing repository files', async t => {
  const root = await mkdtemp(join(tmpdir(), 'icg-cms-'));
  const editorRoot = join(root, 'editor'), assetsRoot = join(root, 'assets');
  await mkdir(editorRoot); await mkdir(assetsRoot);
  await writeFile(join(editorRoot, 'index.html'), '<h1>Editor</h1>');
  await writeFile(join(assetsRoot, 'portrait.svg'), '<svg/>');
  await writeFile(join(root, 'private.json'), 'private content');
  await symlink(join(root, 'private.json'), join(assetsRoot, 'escape.json'));
  let calls = 0;
  const backend = createServer(async (req, res) => {
    calls++;
    assert.equal(req.url, '/api/v1');
    let body = ''; for await (const chunk of req) body += chunk;
    assert.deepEqual(JSON.parse(body), { action: 'info' });
    res.setHeader('Content-Type', 'application/json'); res.end('{"type":"local_fs"}');
  });
  await new Promise(resolve => backend.listen(0, '127.0.0.1', resolve));
  const server = createEditorServer({ editorRoot, assetsRoot, backendPort: backend.address().port });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await Promise.all([server, backend].map(s => new Promise(resolve => { s.closeAllConnections(); s.close(resolve); })));
    await rm(root, { recursive: true });
  });
  assert.match(await (await fetch(base)).text(), /Editor/);
  assert.equal(await (await fetch(base + '/assets/portrait.svg')).text(), '<svg/>');
  assert.equal((await fetch(base + '/private.json')).status, 404);
  assert.equal((await fetch(base + '/assets/escape.json')).status, 403);
  assert.equal((await fetch(base + '/assets/..%2Fprivate.json')).status, 403);
  const init = { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base }, body: '{"action":"info"}' };
  assert.deepEqual(await (await fetch(base + '/api/v1', init)).json(), { type: 'local_fs' });
  assert.equal((await fetch(base + '/api/v1', { ...init, headers: { ...init.headers, Origin: 'https://example.com' } })).status, 403);
  assert.equal(calls, 1);
  assert.equal((await fetch(base + '/config.json', { method: 'POST' })).status, 405);
});
