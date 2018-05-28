import * as fs from 'fs';
import * as path from 'path';

const CACHE_DIR = path.join(__dirname, 'cache');

export function write(filename: string, json: object): void {
  const filepath = path.join(CACHE_DIR, `${filename}.json`);
  const data = JSON.stringify(json);

  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
  }

  fs.writeFileSync(filepath, data);
}

export function read(filename: string): string {
  const filepath = path.join(CACHE_DIR, `${filename}.json`);
  const content = fs.readFileSync(filepath, 'utf8');

  return content;
}

export function upToDate(filename: string, lifespan: number): boolean {
  const filepath = path.join(CACHE_DIR, `${filename}.json`);

  if (!fs.existsSync(filepath)) {
    return false;
  }
  
  const lastModified = fs.statSync(filepath).mtime;
  const deltaTime =
    Math.floor(Date.now() / 1000) -
    Math.floor(Number(lastModified) / 1000);

  return deltaTime < lifespan;
}