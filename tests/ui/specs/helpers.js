// Shared helpers for the UI tests.

// Fail the test if the page throws an uncaught JavaScript error. Call this
// before navigating.
function failOnPageErrors(page) {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err));
  return () => {
    if (errors.length > 0) {
      throw new Error('Uncaught page errors:\n' + errors.map(String).join('\n'));
    }
  };
}

module.exports = { failOnPageErrors };
