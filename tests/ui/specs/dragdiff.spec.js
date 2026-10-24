// dragdiff.js: on the history page, dragging one revision onto another
// opens the diff between them (jQuery UI draggable/droppable).
const { test, expect } = require('@playwright/test');
const { failOnPageErrors } = require('./helpers');

const historyUrl = '/_history/History%20Test';

async function drag(page, source, target) {
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  await page.mouse.move(from.x + 10, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + 10, to.y + to.height / 2, { steps: 10 });
  await page.mouse.up();
}

test('history page explains drag-to-diff', async ({ page }) => {
  const checkErrors = failOnPageErrors(page);
  await page.goto(historyUrl);

  await expect(page.locator('#content > p').first())
    .toHaveText('Drag one revision onto another to see differences.');
  await expect(page.locator('li.difflink')).toHaveCount(3);

  checkErrors();
});

for (const direction of ['newer onto older', 'older onto newer']) {
  test(`dragging ${direction} revision opens the diff from older to newer`, async ({ page }) => {
    const checkErrors = failOnPageErrors(page);
    await page.goto(historyUrl);

    // The list is newest first.
    const links = page.locator('li.difflink');
    const newest = links.first();
    const oldest = links.last();
    const newRev = await newest.getAttribute('data-revision');
    const oldRev = await oldest.getAttribute('data-revision');

    if (direction === 'newer onto older') {
      await drag(page, newest, oldest);
    } else {
      await drag(page, oldest, newest);
    }

    await page.waitForURL(/\/_diff\//);
    const url = new URL(page.url());
    expect(url.pathname).toBe('/_diff/History%20Test');
    expect(url.searchParams.get('from')).toBe(oldRev);
    expect(url.searchParams.get('to')).toBe(newRev);

    checkErrors();
  });
}
