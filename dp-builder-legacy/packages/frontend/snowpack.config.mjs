/** @type {import("snowpack").SnowpackUserConfig } */

import proxy from 'http2-proxy';

export default {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    'snowpack-plugin-svgr',
    [
      '@snowpack/plugin-typescript',
      {
        ...(process.versions.pnp ? { tsc: 'yarn pnpify tsc' } : {}),
      },
    ],
  ],
  routes: [
    {
      src: '/api/.*',
      dest: (req, res) => {
        req.url = req.url.replace(/^\/api/g, '');
        return proxy.web(req, res, {
          hostname: process.env.API_URL || '127.0.0.1',
          port: parseInt(process.env.API_PORT) || 80
        });
      },
    },
    {
      match: 'routes',
      src: '.*',
      dest: '/index.html',
    },
  ],
  optimize: {},
  packageOptions: {},
  devOptions: {
    port: parseInt(process.env.WEB_PORT) || 8080
  },
  buildOptions: {},
};
