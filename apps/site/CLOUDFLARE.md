# nodejs.org on OpenNext for Cloudflare

## Getting started

To develop, build, preview, and deploy nodejs.org, execute the following commands to get started:

```
nvm use
npm install
cd apps/site
```

As some of the commands use [turborepo](https://turbo.build/repo/docs), we recommend you install it globally:

```
npm install turbo --global
```

## Developing locally

To develop locally, run the usual:

```
npm run dev
```

or with turbo:

```
turbo dev
```

## Build nodejs.org production distribution using OpenNext

To build you need connection to the Internet because the build system will try to fetch the following files:

- https://nodejs.org/dist/index.json
- https://raw.githubusercontent.com/nodejs/Release/master/schedule.json

```
npm run build:cloudflare
```

or you can build with turborepo:

```
turbo build:cloudflare
```

## Preview a production build locally

You can preview production build locally using [wrangler](https://developers.cloudflare.com/workers/wrangler/):

```
turbo preview:cloudflare
```

## Deploying a build to production

To build and deploy the application run:

```
turbo deploy:cloudflare
```

The build is currently deployed to a dedicated "nodejs.org" (Cloudflare account id: fb4a2d0f103c6ff38854ac69eb709272).

You can monitor and configure the project at https://dash.cloudflare.com/fb4a2d0f103c6ff38854ac69eb709272/workers/services/view/nodejs-website/production

## TODOs

The following is an incomplete list of tasks and problems that still need to be resolved:

- [ ] sort out issues with `eval` and MDX and undo edits in `./app/[locale]/[[...path]]/page.tsx`
- [ ] reimplement `getMarkdownFiles` in `next.helpers.mjs` to be generated at build time
  - this can be accomplished either via a npm/turbo prebuild task, or possibly as part of next.js SSG/staticProps (but we need to ensure that we don't end up accidentaly downloading this big file to the client as part of hydration)
  - [ ] once we have easy access to the list of files, we should roll back changes to `next-data/providers/blogData.ts`
- [ ] back out most changes from `next.dynamic.mjs`
  - [ ] instead of using runtime detection via `globalThis.navigator?.userAgent`, we should instead use `alias` feature in `wrangler.toml` to override the implementation of `node:fs` calls but only when running in workerd as we need the build to keep on running in node.js for SSG to work
  - [ ] could we reimplement the `existsAsync` call as sync `exists` which consults `getMarkdownFiles` from the task above? alternatively
  - [ ] properly implement the rest of `.cloudflare/node/*` polyfills
- [ ] remove symlink hack in `package.json#build:cloudflare`
  - would it be possible to make the pages directory part of assets in a less hacky way?
  - [ ] move these files under `.open-next/assets/cdn-cgi/pages` so that these raw md files are not publicly accessible as that could become a maintenance burden down the road.
- [ ] review and improve `/apps/site/turbo.json` changes
- [ ] reenable minification in `next.config.mjs`
