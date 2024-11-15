'use strict';

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { glob } from 'glob';

import generateBlogData from '../next-data/generators/blogData.mjs'
import { getRelativePath } from '../next.helpers.mjs';

const __dirname = getRelativePath(import.meta.url);
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

const blogData = await generateBlogData();

const outputBlogDataMjs = blogDataMjs.replace(
    /const result = \{\s*\/\* generated at build time \*\/\s*\};/,
    `const result = ${JSON.stringify(blogData)};`
).replace(" from '../../.next.helpers.mjs';", " from './.next.helpers.mjs';");

writeFileSync(
    resolve(__dirname, '..', '.blogData.mjs'),
    outputBlogDataMjs
);
