import { ComponentLoader } from 'adminjs';
import path from 'path';

const componentLoader = new ComponentLoader();

// Normalize to POSIX-style path so AdminJS bundler doesn't prepend 'file:' incorrectly on Windows.
const toPosix = (p) => p.split(path.sep).join('/');
const dashboardPath = toPosix(path.resolve(process.cwd(), 'src/adminjs/components/dashboard.jsx'));

const Components = {
  Dashboard: componentLoader.add('Dashboard', dashboardPath),
};

export { componentLoader, Components };
