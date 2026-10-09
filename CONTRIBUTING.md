# Contributing

Anyone can contribute to Backlog Power Ups.

If you want to add a new plugin, change the documentation, or fix a bug, please fork the repository and open a Pull Request.

For significant changes or implementing new features, you can also discuss them by creating an Issue first.

## Prerequisites

- Node.js v20 or higher

## Setup

Backlog Power Ups uses `npm`. Please ensure you have the project's specified version installed.

To do this, enable `corepack` to use the version of `npm` specified in the project.

```shell
corepack enable
```

Next, install the dependencies.

```shell
npm install
```

## Development

You can start a development server with Google Chrome using the following command.

```shell
npm run dev
```

Sign in to any Backlog space in the launched Google Chrome window to start your development.

## Adding a Plugin

To add a plugin, create a new file under the /plugins directory.  
The file or directory name should be the same as the exported plugin name (which will be its ID).

### Add an Entry Point

> [!TIP]
> Variables exported from `/utils`, such as `definePowerUpsPlugin`, can be used without importing them.  
> See: https://wxt.dev/guide/essentials/config/auto-imports

First, define an entry point in `plugins/{plugin_id}.ts` or `plugins/{plugin_id}/index.ts` using `definePowerUpsPlugin()`.

```ts
// file: plugin/myPlugin.ts
// The variable name 'myPlugin' becomes the plugin ID.
export const myPlugin = definePowerUpsPlugin({
    // Used for grouping in the popup menu.
    // e.g., issue, document, git...
    group: 'issue',
    // A minimatch pattern to determine where the plugin runs.
    // e.g., /view/**, /wiki/*/*, /**
    matches: ["/view/**"],
    // The main function that runs when the plugin is activated.
    main() {
        
    },
});
```

Next, export the defined plugin from `plugins/index.ts`.

```ts
// file: plugins/index.ts
export * from './myPlugin';
```

### Define the Plugin's Name

Define the plugin's name in the locale file as `{plugin_id}.name`.

```yaml
# locales/en.yaml
myPlugin:
  name: Awesome issue plugin
```

Any other text used by the plugin should also be defined under `{plugin_id}`.

### Implement the Plugin

The plugin's implementation is primarily written inside the `main()` function.

The `main()` function provides a context containing the following helper functions, defined in [helper/plugin/context.ts](helper/plugin/context.ts):

- `observeQuerySelector`: Executes a callback whenever an element matching the selector appears.
- `asyncQuerySelector`: Waits for an element matching the selector to appear and then returns it.
- `addEventListener`
- `setTimeout` 
- `setInterval`

These handlers are automatically unregistered when the plugin is deactivated (e.g., when navigating away from a page that matches the `matches` pattern).

```ts
definePowerUpsPlugin({
    main({ observeQuerySelector, addEventListener }) {
        observeQuerySelector('#my-element', (el) => {
            el.classList.add('modified');
            
            addEventListener(el, 'click', () => {
               /* Handle the click event for #my-element */ 
            });
            
            // Returning a function will execute it when the plugin is deactivated.
            return () => {
                el.classList.remove('modified');
            }
        })
    }
})
```

## Releasing Updates

Releases are handled via GitHub Actions.

- Start the workflow from [submit.yaml](https://github.com/nulab/backlog-power-ups/actions/workflows/submit.yaml)
    - Environment: `production`
    - Version: Select one of `patch` / `minor` / `major`
- The job for submitting the extension to the web stores requires approval from a maintainer.

## Translating Backlog's UI

The `translateUi` plugins translate Backlog's own screen text, which is a
different thing from `locales/` — that one translates this extension's popup.

Backlog renders its UI from a server-side catalog and does not put the message
keys in the DOM, so the plugin can only match on the text it finds on screen. A
dictionary is therefore keyed by message key for editing, and flattened into a
`rendered text -> translation` map for the runtime.

Only whole labels are replaced, never substrings, so that an issue subject that
happens to contain a label is left alone. Editable regions (`textarea`, `pre`,
`code`, `[contenteditable]`) are skipped.

### Adding a language

1. Add `plugins/translateUi/dictionaries/<lang>.json`, mapping message keys from
   `backlog-web/conf/messages.ja` in the `backlog-scala` repository to their
   translation.
2. Regenerate the runtime dictionary. The catalog lives outside this repository,
   so pass the checkout:

   ```sh
   npm run build:dictionary -- --scala ../path/to/backlog-scala
   ```

   The script fails if a key is missing from the catalog, is not a plain label
   (placeholders, markup and HTML entities never render as written), or if two
   keys that render the same text disagree on the translation — the DOM cannot
   tell those apart, so one of them has to go.

   What the script cannot catch is a key whose rendered text is a bare generic
   word in one of the two catalogs, because the entry then fires far outside the
   screen the key belongs to. `btn.new` is `新規作成` but `News` in English, so
   including it would rewrite every genuine "News" label. Leave those out.

Plugins that recognise an element by Backlog's own wording stop matching once a
translation is active, and the rewrite leaves no trace in the DOM. Such a plugin
should test the rendered text *and* `getUntranslatedTexts()` from
`plugins/translateUi/original-text.ts`, the way `plugins/autoResolution.ts`
does.
3. Export one more plugin from `plugins/translateUi/index.ts` and add its
   `name` to `locales/en.yaml` and `locales/ja.yaml`. Each language is its own
   toggle, because the plugin list is a flat list of booleans.
