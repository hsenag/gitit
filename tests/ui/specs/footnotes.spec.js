// footnotes.js: hovering a footnote reference pops up the footnote text.
const { test, expect } = require('@playwright/test');
const { failOnPageErrors } = require('./helpers');

test('hovering a footnote reference shows and then hides the footnote', async ({ page }) => {
  const checkErrors = failOnPageErrors(page);
  await page.goto('/Footnotes');

  const ref = page.locator('a[href="#fn1"]');
  await expect(ref).toBeVisible();

  await ref.hover();
  const popup = page.locator('#footnotediv');
  await expect(popup).toBeVisible();
  await expect(popup).toContainText('The footnote text appears here.');
  await expect(popup).toHaveCSS('position', 'absolute');

  // Moving away starts a 100ms timeout and then a 600ms fade before removal.
  await page.mouse.move(0, 0);
  await expect(popup).toHaveCount(0, { timeout: 3000 });

  checkErrors();
});

test('moving from the reference into the popup keeps it open', async ({ page }) => {
  await page.goto('/Footnotes');

  await page.locator('a[href="#fn1"]').hover();
  const popup = page.locator('#footnotediv');
  await expect(popup).toBeVisible();

  await popup.hover();
  await page.waitForTimeout(1000);
  await expect(popup).toBeVisible();
});
