// import { AsyncLocalStorage } from 'node:async_hooks';
// import { Buffer } from 'node:buffer';

// export const als = new AsyncLocalStorage();

export function readFileSync(path) {
  return globalThis.PAGES.fetch(path);
}

export function readdir(params) {
  console.log('claudio', params);
}
