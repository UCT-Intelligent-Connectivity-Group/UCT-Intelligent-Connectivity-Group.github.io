(async () => {
  const status = document.getElementById('cms-status');
  const message = status.querySelector('p');
  if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
    message.textContent = 'This editor runs locally. Open the website on your computer to manage its content.';
    return;
  }
  try {
    const response = await fetch('/config.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('The editor configuration could not be loaded.');
    const config = await response.json();
    config.backend.proxy_url = new URL(config.backend.proxy_url, location.origin).href;
    const health = await fetch(config.backend.proxy_url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'info' }), signal: AbortSignal.timeout(8000)
    });
    if (!health.ok) throw new Error('The local content service is unavailable.');
    const info = await health.json();
    if (info.type !== 'local_fs') throw new Error('The local content service returned an unexpected response.');
    message.textContent = 'Loading the content editor…';
    window.CMS_MANUAL_INIT = true;
    const script = document.createElement('script');
    script.src = '/vendor/decap-cms.js';
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => reject(new Error('The editor files could not be loaded.'));
      document.head.appendChild(script);
    });
    // Refresh the saved record so subsequent edits compare with the latest file.
    window.CMS.registerEventListener({ name: 'postSave', handler: () => {
      setTimeout(() => location.reload(), 250);
    } });
    window.CMS.init({ config });
    status.remove();
  } catch (error) {
    message.textContent = `${error.message} Start the local editor with npm run cms in the website folder, then reload this page.`;
    const retry = document.createElement('button');
    retry.textContent = 'Retry connection';
    retry.addEventListener('click', () => location.reload());
    status.appendChild(retry);
    console.error(error);
  }
})();
