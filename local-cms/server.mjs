import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createEditorServer } from './http-server.mjs';

const repo = fileURLToPath(new URL('../', import.meta.url));
const backend = spawn(process.execPath, [resolve(repo, 'node_modules/decap-server/dist/index.js')], {
  cwd: repo, stdio: 'inherit',
  env: { ...process.env, MODE: 'fs', BIND_HOST: '127.0.0.1', PORT: '8081', ORIGIN: 'http://127.0.0.1:8082' }
});
const server = createEditorServer({ editorRoot: resolve(repo, 'local-cms/editor'), assetsRoot: resolve(repo, 'public/assets') });
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  backend.kill('SIGTERM');
  server.close();
  server.closeAllConnections();
  setTimeout(() => process.exit(code), 300).unref();
}
backend.on('error', error => { console.error(error.message); stop(1); });
backend.on('exit', code => stop(code ?? 0));
server.on('error', error => { console.error(`Local CMS: ${error.message}`); stop(1); });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => stop());
server.listen(8082, '127.0.0.1', () => console.log('Local content manager: http://127.0.0.1:8082/\nContent saves to this repository. Nothing is pushed or deployed.'));
