// Scripts loaded on every page (see pgScripts in Network.Gitit.Layout).
const { test, expect } = require('@playwright/test');
const { failOnPageErrors } = require('./helpers');

const pages = [
  '/',
  '/Footnotes',
  '/_history/History%20Test',
  '/_edit/Edit%20Me',
  '/_search?patterns=zebra',
  '/_upload',
  '/_index',
];

for (const path of pages) {
  test(`${path} loads jQuery and jQuery UI without errors`, async ({ page }) => {
    const checkErrors = failOnPageErrors(page);
    await page.goto(path);

    const info = await page.evaluate(() => ({
      jquery: window.jQuery && window.jQuery.fn.jquery,
      draggable: typeof (window.jQuery && window.jQuery.fn.draggable),
      droppable: typeof (window.jQuery && window.jQuery.fn.droppable),
      footnotes: typeof window.Footnotes,
    }));
    expect(info).toEqual({
      jquery: '1.2.6',
      draggable: 'function',
      droppable: 'function',
      footnotes: 'object',
    });

    checkErrors();
  });
}
