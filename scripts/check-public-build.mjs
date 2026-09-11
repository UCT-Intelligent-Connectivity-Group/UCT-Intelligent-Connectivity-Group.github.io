import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
async function check(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (/^(admin|local-cms)$|decap-cms|cms-server/.test(entry.name)) throw new Error(`Local CMS leaked into public build: ${path}`);
    if (entry.isDirectory()) await check(path);
    else if (entry.name.endsWith('.html') && /Manage content|\/admin\/|\/admin-api/.test(await readFile(path, 'utf8'))) throw new Error(`Local CMS link found in public page: ${path}`);
  }
}
await check('dist');
console.log('Public build verified: no local CMS files or links.');
