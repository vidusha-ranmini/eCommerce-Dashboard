import { ComponentLoader } from 'adminjs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentLoader = new ComponentLoader();

// Use an absolute filesystem path (no file: URL) so AdminJS resolver won't
// attempt to convert a file: URL and produce malformed paths on Windows.
const dashboardAbsPath = path.join(__dirname, 'components', 'dashboard.jsx');

const Components = {
  Dashboard: componentLoader.add('Dashboard', dashboardAbsPath),
};

export { componentLoader, Components };
