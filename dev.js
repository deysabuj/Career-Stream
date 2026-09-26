import { spawn } from 'child_process';
import path from 'path';

const rootDir = process.cwd();

console.log('🚀 Starting Career Stream (Backend: 5001 | Frontend: 5173)...');

const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'backend'),
  stdio: 'inherit',
  shell: true,
});

const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'frontend'),
  stdio: 'inherit',
  shell: true,
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
