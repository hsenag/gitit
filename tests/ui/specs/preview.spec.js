// preview.js: the Preview button on the edit page renders the text via AJAX.
const { test, expect } = require('@playwright/test');
const { failOnPageErrors } = require('./helpers');

test('edit page shows the preview button and focuses the editor', async ({ page }) => {
  const checkErrors = failOnPageErrors(page);
  await page.goto('/_edit/Edit%20Me');

  await expect(page.locator('#previewButton')).toBeVisible();
  await expect(page.locator('#editedText')).toBeFocused();

  checkErrors();
});

test('clicking Preview renders the edited text into the preview pane', async ({ page }) => {
  const checkErrors = failOnPageErrors(page);
  await page.goto('/_edit/Edit%20Me');

  await page.locator('#editedText').fill('Hello **bold** world');

  const [request] = await Promise.all([
    page.waitForRequest((r) => r.method() === 'POST' && r.url().includes('/_preview/')),
    page.locator('#previewButton').click(),
  ]);
  expect(new URL(request.url()).pathname).toBe('/_preview/Edit%20Me');
  expect(request.postData()).toContain('raw=Hello');

  const pane = page.locator('#previewpane');
  await expect(pane.locator('strong')).toHaveText('bold');
  await expect(pane).toBeVisible();
  // Previewing must not save the page.
  await expect(page).toHaveURL(/\/_edit\/Edit%20Me$/);

  checkErrors();
});
