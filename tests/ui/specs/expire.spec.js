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

test('other keys do not expire the page', async ({ page }) => {
  await page.goto('/Footnotes');

  // Without the hotkeys plugin, bind("keydown", "ctrl+r", ...) would treat
  // "ctrl+r" as event data and fire on every key press.
  const expires = [];
  page.on('request', (r) => {
    if (r.url().includes('/_expire/')) expires.push(r.url());
  });
  await page.keyboard.press('r');
  await page.keyboard.press('Control+e');
  await page.waitForTimeout(500);
  expect(expires).toEqual([]);
});
