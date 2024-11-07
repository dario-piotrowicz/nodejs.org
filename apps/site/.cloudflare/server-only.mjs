// In our aliased fs code: apps/site/.cloudflare/node/fs/promises.mjs we are importing `getCloudflareContext`
// from `@opennextjs/cloudflare`, this in turn imports from `server-only`, this aliasing maxes it so that
// server-only is not actually removed from the final bundle as it should causing an incorrect server internal
// error, so here we're also mocking out the server-only module as well
