# Third-party JavaScript

This directory holds unmodified upstream sources for the third-party
JavaScript gitit serves. The minified files in `data/static/js` are
generated from them by `build.js`; don't edit those by hand.

| Directory | Upstream | Files taken from the npm package |
|---|---|---|
| `jquery-4.0.0/` | [jQuery](https://jquery.com/) 4.0.0, npm `jquery@4.0.0` | `dist/jquery.js`, `LICENSE.txt`, `AUTHORS.txt` |
| `jquery-ui-1.14.2/` | [jQuery UI](https://jqueryui.com/) 1.14.2, npm `jquery-ui@1.14.2` | the `ui/` modules listed in `build.js`, `LICENSE.txt`, `AUTHORS.txt` |
| `jquery-hotkeys-0.2.2/` | [jQuery Hotkeys](https://github.com/jeresig/jquery.hotkeys) 0.2.2, npm `jquery-hotkeys@0.2.2` | `jquery-hotkeys.js`, `README.md` |

The files keep the paths they have inside each npm package, so they can be
compared directly against `npm pack <package>@<version>`.

gitit only uses jQuery UI's draggable and droppable widgets (for drag-to-diff
on the history page), so only those modules and their dependencies are
vendored and combined into `jquery-ui-1.14.2.custom.min.js`.

## Rebuilding

Requires Node.js.

    cd vendor
    npm ci
    npm run build

`npm run check` regenerates the files in memory and fails if the committed
ones differ.

## Updating a library

1. Replace the directory with the new version's files, keeping the same
   layout, and update the table above.
2. Update the file names in `build.js`, `gitit.cabal`,
   `src/Network/Gitit/Layout.hs` and `data/templates/expire.st`.
3. Run `npm run build`, delete the old minified file from `data/static/js`,
   and run the UI tests in `tests/ui`.
