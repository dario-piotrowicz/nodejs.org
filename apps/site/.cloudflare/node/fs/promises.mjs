export async function readFile(path) {
  return env.PAGES.fetch(path);
}
