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
> Variables exported from /utils, such as definePowerUpsPlugin, can be used without importing them.  
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
