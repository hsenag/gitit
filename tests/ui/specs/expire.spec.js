// expire.st + jquery.hotkeys: with use-cache enabled, Ctrl+R expires the
// cached copy of the page before reloading.
const { test, expect } = require('@playwright/test');

test('Ctrl+R posts to the expire handler for the current page', async ({ page }) => {
  await page.goto('/Footnotes');

  const [request] = await Promise.all([
    page.waitForRequest((r) => r.method() === 'POST' && r.url().includes('/_expire/')),
    page.keyboard.press('Control+r'),
  ]);
  expect(new URL(request.url()).pathname).toBe('/_expire/Footnotes');
});
