// uploadForm.js: choosing a file fills in the wiki name.
const { test, expect } = require('@playwright/test');
const { failOnPageErrors } = require('./helpers');

test('choosing a file fills in the wiki name from the file name', async ({ page }) => {
  const checkErrors = failOnPageErrors(page);
  await page.goto('/_upload');

  await expect(page.locator('#wikiname')).toHaveValue('');

  // Chrome reports the value as C:\fakepath\<name>; the script strips the path.
  await page.locator('#file').setInputFiles({
    name: 'picture.png',
    mimeType: 'image/png',
    buffer: Buffer.from('not really a png'),
  });
  await expect(page.locator('#wikiname')).toHaveValue('picture.png');

  checkErrors();
});
