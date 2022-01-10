# Svonix

Svonix is a small library that allows you to easily create and use [Svelte](https://svelte.dev/) components in [Phoenix](https://www.phoenixframework.org/).

Svonix is loosely based on the ideas behind [Sveltex](https://github.com/virkillz/sveltex), but is written from the ground up to support [Phoenix](https://www.phoenixframework.org/) `> 1.6`, as well as dynamic loading of individual Svelte components to save bandwidth.

Svonix adds [Rollup](https://rollupjs.org/guide/en/) to your Phoenix project, replacing [ESBuild](https://esbuild.github.io/) which is included by default. Rollup is Svelte's default bundler.

## Installation

1. Add `svonix` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:svonix, git: "https://github.com/nikokozak/svonix", tag: "v0.1.0"}
  ]
end
```

2. Next, run `mix svonix.setup` from your Phoenix application's root folder. 

**Svonix will copy over the following files into your `assets` folder, will create a `assets/svelte` folder, and will run `npm install`**:
- `package.json` (listing svelte's dependencies)
- `rollup.config.js` (configuration for the Rollup bundler)
- `svonix_rollup_plugin.js` (a Rollup plugin that injects a small handler into your `app.js`, allowing Svelte components to be dynamically loaded)

3. In your `config/dev.exs` file, add a watcher:

```elixir
config :my_app, MyApp.Endpoint,
    # other options
    watchers: [
        node: [
            "node_modules/rollup/dist/bin/rollup",
            "--config",
            "--watch",
            cd: Path.expand("../assets", __DIR__) 
        ]
    ]
```

4. Finally, in your `assets/app.js` file, add the following line at the top:

```javascript
import 'sveltex'
```

## Usage

1. Add new components to the `assets/svelte` folder. For example, we'll add a `test.svelte` component:
```html
<script>
  export let name;
</script>

<h1>Hey {name}, Phoenix and Svelte setup is working!</h1>
```

2. Next, add a Svonix tag where desired, and pass in the arguments you like:
```elixir
// lib/myapp_web/templates/page/index.html.heex
<%= Sveltex.render "test", %{ name: "Nikolai" } %>
```

You should see the component rendered in the view.


