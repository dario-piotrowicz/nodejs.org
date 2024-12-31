'use strict';

import { readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

import { glob } from 'glob';

import { availableLocaleCodes } from '../../next.locales.mjs';

const preGeneratedDownloadSnippets = [
  /* generated at build time */
];

/**
 * This method is used to generate the Node.js Website Download Snippets
 * for self-consumption during RSC and Static Builds
 */
export const generateRawDownloadSnippets = async () => {
  /**
   * This generates all the Download Snippets for each available Locale
   *
   * @type {Array<[string, import('../../types').DownloadSnippet[]]>}
   */
  const downloadSnippets = availableLocaleCodes.flatMap(async locale => {
    // We retrieve the full pathnames of all Blog Posts to read each file individually
    // Note that we get the files original language (Bash/PowerShell, etc)
    const filenames = await glob('**/*.bash', {
      root: process.cwd(),
      cwd: `snippets/${locale}/download`,
    });

    // Creates the base path for the snippets for Node to read from
    const basePath = join(process.cwd(), `snippets/${locale}/download`);

    // Read the raw Markdown snippets for each locale
    const snippets = filenames.map(async filename => ({
      name: basename(filename, extname(filename)),
      language: extname(filename).slice(1),
      content: await readFile(join(basePath, filename), 'utf-8'),
    }));

    return [locale, await Promise.all(snippets)];
  });
  return await Promise.all(downloadSnippets);
};

/**
 * This method is used to generate the Node.js Website Download Snippets
 * for self-consumption during RSC and Static Builds
 */
const generateDownloadSnippets = async () => {
  if (preGeneratedDownloadSnippets) {
    return new Map(preGeneratedDownloadSnippets);
  }

  const downloadSnippets = generateRawDownloadSnippets();

  return new Map(await Promise.all(downloadSnippets));
};

export default generateDownloadSnippets;