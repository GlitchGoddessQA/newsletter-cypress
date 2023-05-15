import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl:
      'https://app.daily.ai/v2/dashboard/30-Testim-Test-2/30-Your-Newsletter557417/361a77810be6f59c8e16839fc44b090de9576a94ec14f3fd0198758af011af09',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
