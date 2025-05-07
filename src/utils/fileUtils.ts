import fs from 'fs';
import path from 'path';

const POINTER_FILE = path.join(__dirname, '../../emailspointer.json');
const EMAILS_DIR = path.join(__dirname, '../../emails');

export function loadEmailPointer(): Record<string, string> {
  if (!fs.existsSync(POINTER_FILE)) {
    return {};
  }

  const data = fs.readFileSync(POINTER_FILE, 'utf8').trim();

  // Handle empty or malformed file
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn('Warning: Invalid JSON in emailspointer.json. Resetting...');
    return {};
  }
}

export function saveEmailPointer(pointer: Record<string, string>) {
  fs.writeFileSync(POINTER_FILE, JSON.stringify(pointer, null, 2));
}

export function saveEmailFile(hash: string, content: string) {
  const filePath = path.join(EMAILS_DIR, `${hash}.txt`);
  fs.mkdirSync(EMAILS_DIR, { recursive: true });
  fs.writeFileSync(filePath, content);
}
