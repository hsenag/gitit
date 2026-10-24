// search.js: show/hide matching lines in search results, with highlighting.
const { test, expect } = require('@playwright/test');
const { failOnPageErrors } = require('./helpers');

test('search results toggle matching lines and highlight the pattern', async ({ page }) => {
  const checkErrors = failOnPageErrors(page);
  await page.goto('/_search?patterns=zebra');

  const item = page.locator('li', { has: page.locator('a', { hasText: 'Search Target' }) });
  const toggle = item.locator('a.showmatch');
  const matches = item.locator('pre.matches');

  // Without JavaScript the toggle is hidden and the matches are shown;
  // search.js reverses that.
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveText('[show matches]');
  await expect(matches).toBeHidden();

  await toggle.click();
  await expect(matches).toBeVisible();
  await expect(toggle).toHaveText('[hide matches]');
  await expect(matches.locator('span.highlighted')).toHaveText(['zebra', 'zebra']);

  await toggle.click();
  await expect(matches).toBeHidden();
  await expect(toggle).toHaveText('[show matches]');

  checkErrors();
});

test.describe('jQuery.fn.highlightPattern', () => {
  // Run highlightPattern on a scratch element in a page that loads search.js.
  async function highlight(page, text, pattern) {
    return page.evaluate(([text, pattern]) => {
      const el = jQuery('<div>').text(text).appendTo(document.body);
      el.highlightPattern(pattern, 'hl');
      const found = el.find('span.hl').map(function () { return jQuery(this).text(); }).get();
      el.remove();
      return found;
    }, [text, pattern]);
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/_search?patterns=zebra');
  });

  test('matches whole words only, case-insensitively', async ({ page }) => {
    expect(await highlight(page, 'Zebra zebras zebra', 'zebra')).toEqual(['Zebra', 'zebra']);
  });

  test('highlights each word of a multi-word pattern', async ({ page }) => {
    expect(await highlight(page, 'the zebra crossed the road', 'zebra road'))
      .toEqual(['zebra', ' road']);
  });

  test('escapes regex metacharacters in the pattern', async ({ page }) => {
    expect(await highlight(page, 'a.b axb', 'a.b')).toEqual(['a.b']);
  });

  test('handles patterns that end in non-word characters', async ({ page }) => {
    expect(await highlight(page, 'I like c++ and c', 'c++')).toEqual(['c++']);
  });
});
