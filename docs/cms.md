# Local CMS

The editor is a separate local application in `local-cms/`. It is not part of Astro's pages or public assets and is excluded from the website build.

## Start

- `npm run dev`: website on http://127.0.0.1:4321/ and editor on http://127.0.0.1:8082/.
- `npm run cms`: editor and content service only. This works even when the website preview is stopped.
- `npm run dev:site`: website preview only.
- `npm run dev:cms`: alias for the combined startup.

Click **Login** if shown. No account is needed locally. Select an entry and use **Publish → Publish now** to save it. Publish writes files on this computer; it does not commit, push, or deploy. This repository's Pages workflow deploys after a push to main. CMS saves still require a separate Git commit and push; automatic pushing is not enabled.

Both services bind to loopback. The editor serves its files, reads website image assets, and forwards its own `/api/v1` requests to the Decap file-system service on port 8081. The website has no CMS API proxy. The editor's link to the website preview requires `npm run dev:site` or `npm run dev` to be running.

## Files and media

- Editor HTML, configuration and scripts: `local-cms/editor/`.
- Local server and backend startup: `local-cms/server.mjs` and `local-cms/http-server.mjs`.
- Members: `src/data/members/*.json`.
- Website and research settings: `src/data/site.json` and `src/data/research.json`.
- Publications and news: `src/content/`.
- General uploads: `public/assets/uploads/`.
- Image fields open their own folders: `public/assets/team/`, `public/assets/logo/`, and `public/assets/research/`.

The CMS and website share these content files. No copying between applications is necessary. After a successful save, the editor reloads the current record so its next change is compared with the saved file. Unrelated website changes do not reload the editor. The website preview refreshes when content changes. A static build updates only when rebuilt.

## Checks and troubleshooting

`npm run test:cms` checks serving, API forwarding, and local request/file boundaries. `npm run build` verifies the generated website has no editor files or CMS links. The GitHub Pages workflow uploads only `dist/`.

If the editor cannot connect, restart `npm run cms` or `npm run dev` and select Retry connection. Stop an earlier combined process before starting another. Ports 4321, 8081 and 8082 must be free for combined startup.

## Dependencies

The browser editor is the unchanged official `decap-cms@3.8.3` prebuilt npm distribution in `local-cms/editor/vendor/`, including its licence notices. The file-system service uses `decap-server@3.9.0`. The editor needs no CDN or GitHub credentials.

To refresh the frontend, select and test a compatible release, run `npm pack decap-cms@VERSION`, and extract `package/dist/decap-cms.js`, `package/dist/decap-cms.js.LICENSE.txt`, and `package/LICENSE` into `local-cms/editor/vendor/`. The vendored build avoids unsupported `catalog:` metadata in the frontend's transitive dependency graph.

Official documentation: https://decapcms.org/docs/decap-proxy/ and https://decapcms.org/docs/configuration-options/.
