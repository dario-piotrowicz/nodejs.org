'use strict';

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { glob } from 'glob';

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
