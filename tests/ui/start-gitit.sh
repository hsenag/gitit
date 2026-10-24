#!/bin/sh
# Start a throwaway gitit instance for the UI tests.
#
# Creates a fresh wiki under tests/ui/.wiki, seeds its git repository with
# pages the tests rely on, then runs gitit in the foreground. Playwright's
# webServer setting starts and stops this script.
#
# Set GITIT to use a specific gitit binary; otherwise the one built by
# `cabal build -fexecutable exe:gitit` is used.

set -e

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
PORT="${GITIT_TEST_PORT:-5099}"
WIKI="$HERE/.wiki"

if [ -z "$GITIT" ]; then
  GITIT="$(cd "$ROOT" && cabal list-bin -fexecutable exe:gitit)"
fi

# Serve templates, static files and default.conf from this checkout, so the
# tests exercise the JavaScript in data/static/js rather than an installed copy.
gitit_datadir="$ROOT"
export gitit_datadir

rm -rf "$WIKI"
mkdir -p "$WIKI/repo"
cd "$WIKI/repo"

git init -q
git config user.name "UI Test"
git config user.email "ui-test@example.com"

commit () {
  git add -A
  git commit -q -m "$1"
}

# Playwright polls the front page to know when the server is up.
printf 'Welcome to the UI test wiki.\n' > 'Front Page.page'
commit 'front page'

# A page with several revisions, for the drag-to-diff history view.
printf 'First version.\n' > 'History Test.page'
commit 'first revision'
printf 'Second version.\n' > 'History Test.page'
commit 'second revision'
printf 'Third version.\n' > 'History Test.page'
commit 'third revision'

# A page with a footnote, for the footnote popup.
cat > 'Footnotes.page' <<'EOF'
Here is a claim that needs a citation.[^1]

[^1]: The footnote text appears here.
EOF
commit 'footnotes page'

# Pages for the search-result highlighting.
cat > 'Search Target.page' <<'EOF'
The zebra crossed the road.
Another zebra followed.
Nothing interesting on this line.
EOF
commit 'search page'

# A page to edit and preview.
printf 'Some *editable* text.\n' > 'Edit Me.page'
commit 'edit page'

cat > "$WIKI/gitit.conf" <<EOF
port: $PORT
address: 127.0.0.1
repository-type: Git
repository-path: $WIKI/repo
require-authentication: none
static-dir: $WIKI/static
templates-dir: $WIKI/templates
user-file: $WIKI/gitit-users
log-file: $WIKI/gitit.log
log-level: WARNING
cache-dir: $WIKI/cache
use-cache: ${GITIT_TEST_USE_CACHE:-no}
math: plain
compress-responses: no
EOF

exec "$GITIT" -f "$WIKI/gitit.conf"
