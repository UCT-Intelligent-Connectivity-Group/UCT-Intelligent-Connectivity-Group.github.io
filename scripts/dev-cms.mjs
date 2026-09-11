import { spawn } from 'node:child_process';
const children = [];
let closing = false;
const stop = (code = 0) => { if (closing) return; closing = true; for (const child of children) child.kill('SIGTERM'); setTimeout(() => process.exit(code), 250); };
for (const [script,args] of [['node_modules/astro/bin/astro.mjs',['dev','--host','127.0.0.1','--port','4321']],['local-cms/server.mjs',[]]]) {
  const child = spawn(process.execPath,[script,...args],{stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}});
  children.push(child); child.on('error', error => { console.error(error); stop(1); });child.on('exit', code => stop(code ?? 0));
}
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,() => stop());
