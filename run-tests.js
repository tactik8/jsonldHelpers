
import { spawn } from 'child_process';

const jest = spawn('npx', ['jest', '--verbose'], {
  stdio: 'inherit',
  shell: true
});

jest.on('close', (code) => {
  console.log(`Tests finished with exit code ${code}`);
  process.exit(code);
});

jest.on('error', (error) => {
  console.error('Error running tests:', error);
  process.exit(1);
});
