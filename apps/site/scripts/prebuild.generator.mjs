// @ts-check
'use strict';

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { glob } from 'glob';

import { getRelativePath } from '../next.helpers.mjs';

const __dirname = getRelativePath(import.meta.url);

const generatedDir = resolve(__dirname, '..', '.generated');
mkdirSync(generatedDir, { recursive: true });

const nextHelpersMjs = readFileSync(
  resolve(__dirname, '..', 'next.helpers.mjs'),
  'utf8'
);

const files = await glob('**/*.{md,mdx}', { root: 'pages' });

const outputNextHelpersMjs = nextHelpersMjs.replace(
  /export const files = \[\s*\/\* generated at build time \*\/\s*\];/,
  `export const files = [\n${files
    .map(file => `  ${JSON.stringify(file)},\n`)
    .join('')}];`
);

writeFileSync(
  resolve(__dirname, '..', '.next.helpers.mjs'),
  outputNextHelpersMjs
);

const blogDataMjs = readFileSync(
  resolve(__dirname, '..', 'next-data', 'generators', 'blogData.mjs'),
  'utf8'
);

const { default: generateBlogData } = await import(
  '../next-data/generators/blogData.mjs'
);
const blogData = await generateBlogData();

const outputBlogDataMjs = blogDataMjs
  .replace(
    /const result = \{\s*\/\* generated at build time \*\/\s*\};/,
    `const result = ${JSON.stringify(blogData)};`
  )
  .replace(" from '../../.next.helpers.mjs';", " from '../.next.helpers.mjs';");

writeFileSync(resolve(generatedDir, 'blogData.mjs'), outputBlogDataMjs);

const downloadSnippetsMjs = readFileSync(
  resolve(__dirname, '..', 'next-data', 'generators', 'downloadSnippets.mjs'),
  'utf8'
);

const { generateRawDownloadSnippets } = await import(
  '../next-data/generators/downloadSnippets.mjs'
);
const downloadSnippets = await generateRawDownloadSnippets();

const outputDownloadSnippetsMjs = downloadSnippetsMjs
  .replace(
    /const preGeneratedDownloadSnippets = \[\s*\/\* generated at build time \*\/\s*\];/,
    `const preGeneratedDownloadSnippets = ${JSON.stringify(downloadSnippets)};`
  )
  .replace(" from '../../next.locales.mjs';", " from '../next.locales.mjs';");
writeFileSync(
  resolve(generatedDir, 'downloadSnippets.mjs'),
  outputDownloadSnippetsMjs
);
