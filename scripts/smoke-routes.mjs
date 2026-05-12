const baseUrl = process.env.SMOKE_BASE_URL ?? 'http://localhost:5173';
const routes = ['/', '/fleet', '/incidents', '/regions'];

async function checkRoute(route) {
  const url = new URL(route, baseUrl).toString();
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${route} returned HTTP ${response.status}`);
  }

  const html = await response.text();

  if (!html.includes('<div id="app"></div>')) {
    throw new Error(`${route} did not return the Vite app shell`);
  }

  return `${route} ${response.status}`;
}

try {
  const results = [];

  for (const route of routes) {
    results.push(await checkRoute(route));
  }

  console.log(`Smoke routes passed for ${baseUrl}`);
  results.forEach((line) => console.log(`- ${line}`));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error('Start the dev server with `npm run dev` before running `npm run smoke`.');
  process.exit(1);
}
