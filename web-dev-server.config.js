import {legacyPlugin} from '@web/dev-server-legacy';


export default {
  nodeResolve: {exportConditions: ['development'] },
  preserveSymlinks: true,
  plugins: [
    legacyPlugin({

      polyfills: {
        // Manually imported in index-e2e.html file
        webcomponents: false,
      },
    }),
  ],
};
