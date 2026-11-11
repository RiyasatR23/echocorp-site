import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const projectRoot = process.cwd();
const distIndex = path.join(projectRoot, 'dist', 'index.html');
const ssrBuildDir = path.join(projectRoot, '.prerender');
const ROOT_MARKER = '<div id="root"></div>';

const { renderApp } = await import(pathToFileURL(path.join(ssrBuildDir, 'entry-server.js')).href);

const template = await readFile(distIndex, 'utf8');
if (!template.includes(ROOT_MARKER)) {
  throw new Error('dist/index.html is missing the root element marker');
}

const appHtml = renderApp();
await writeFile(distIndex, template.replace(ROOT_MARKER, () => `<div id="root">${appHtml}</div>`));
await rm(ssrBuildDir, { recursive: true, force: true });
console.log('prerendered dist/index.html');
