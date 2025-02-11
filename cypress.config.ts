import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return {
        ...config,
        env: {
          ...config.env,
          // テスト環境変数をここで設定
          NODE_ENV: 'test',
        },
      };
    },
    screenshotOnRunFailure: true,
    video: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    setupNodeEvents(on, config) {
      return {
        ...config,
        env: {
          ...config.env,
          NODE_ENV: 'test',
        },
      };
    },
    screenshotOnRunFailure: true,
    video: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
  },
});
