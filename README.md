# UCT Intelligent Connectivity Group

Official website of the Intelligent Connectivity Group at the University of Cape Town.

Website: https://UCT-Intelligent-Connectivity-Group.github.io

## Publish with GitHub Pages

1. In this repository on GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Commit and push the website files to `main`.
3. Open the **Actions** tab and wait for **Deploy to GitHub Pages** to succeed.

The workflow installs the locked dependencies, builds the site and uploads only `dist/`. It checks that the local CMS files and links are absent from the public build. Later pushes to `main` redeploy the website automatically. CMS saves are still local until committed and pushed.

The site is configured for https://uct-intelligent-connectivity-group.github.io/ at the domain root. No repository-name URL prefix is required.

Astro website for the Intelligent Connectivity Group, Department of Electrical Engineering, University of Cape Town. Adapted from IntelliSensing / SpaceLab, with the supplied blue Neural Orbit identity and Sora typography.

## Run the website and local CMS

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

- Website: http://127.0.0.1:4321/
- Content manager: http://127.0.0.1:8082/

Click **Login** in the content manager. In this local mode no account is needed. **Publish → Publish now** writes changes to local files; it does not publish anything to the internet or push a Git commit. The website preview updates after a save. The editor refreshes its current record after saving; the website preview updates separately.

`npm run dev` starts the website and the separate local CMS. `npm run dev:cms` is an alias. Use Ctrl+C to stop both. To run them independently, use `npm run dev:site` for the website or `npm run cms` for the editor. The CMS lives in `local-cms/`; its files, API and navigation link are excluded from the public website.

GitHub Pages is configured for this organisation repository. See the publishing steps below. The CMS runs locally; automatic content commits and pushes are not enabled.

## What can be edited

- **Members:** names, titles, leadership/postgraduate categories, ordering, biographies, portraits, public profile links and draft visibility. Data lives in `src/data/members/*.json`.
- **Website → Identity & homepage:** group identity, affiliation, logo, hero text, research introduction and contact email in `src/data/site.json`.
- **Website → Research themes:** the four research descriptions, images, supervisors and source links in `src/data/research.json`.
- **Publications:** authors, venue, date, research themes, paper/code URLs, text and draft state.
- **News:** date, summary, rich text, image, research themes and draft state.
- **Media:** upload general images to `public/assets/uploads/`. Portrait, logo and research image fields open their corresponding asset folders.

New publications and news default to draft. Switch **Draft (hide from website)** off and save to include an item on the local site. Titles become page URLs; use the profile URL field when creating a member. Research IDs are fixed because publication and news records refer to them.

The original lab's archived content and paper microsites remain in the earlier `IntelliSensing.github.io` workspace and are not included in this repository.

## Design and sources

The hero is an animated neural constellation drawn locally in canvas. It requires no map token or external animation service, pauses offscreen or in background tabs, respects reduced-motion preferences, and has a manual pause control.

UCT's crest is displayed with navy lettering on a transparent background. The supervisors' portraits and Associate Professor titles come from UCT's Electrical Engineering staff pages. Research themes were checked against their public ORCID publication records. Sources are documented in [docs/research-sources.md](docs/research-sources.md).

The Sora variable font and its licence are included in `public/assets/fonts/`. Other members use initials until portraits are supplied.

## Validation

```sh
npm run check
npm run build
```

The build produces `dist/` and checks that no CMS files or links are included. Browser checks cover 320px, 390px, 768px and desktop widths, navigation, research tabs, images, animation pause, and saving CMS edits into the rendered homepage.

## CMS dependencies

The file system proxy uses `decap-server` 3.9.0 from npm. The browser editor is the official prebuilt `decap-cms` 3.8.3 npm distribution, vendored at `local-cms/editor/vendor/` with its licence notices. It is served locally, so editing does not depend on a CDN. See [docs/cms.md](docs/cms.md) for maintenance and verification details.

Original website template: [SpaceLab](https://github.com/choucisan/SpaceLab).
