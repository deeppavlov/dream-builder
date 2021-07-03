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
        return proxy.web(req, res, {
          hostname: '127.0.0.1',
          port: 8000,
        });
      },
    },
  ],
  optimize: {},
  packageOptions: {},
  devOptions: {},
  buildOptions: {},
};
