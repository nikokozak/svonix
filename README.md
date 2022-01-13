# Svonix

Svonix is a small library that allows you to easily create and use [Svelte](https://svelte.dev/) components in [Phoenix](https://www.phoenixframework.org/).

Svonix is loosely based on the ideas behind [Sveltex](https://github.com/virkillz/sveltex), but is written to support [Phoenix](https://www.phoenixframework.org/) `> 1.6`, as well as dynamic loading of individual Svelte components to reduce filesizes.

Svonix works with [ESBuild](https://rollupjs.org/guide/en/) which is the default bundler for Phoenix.

## Installation

1. Add `svonix` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:svonix, git: "https://github.com/nikokozak/svonix", tag: "v0.4.0"}
  ]
end
```

2. Next, run `mix svonix.setup` from your Phoenix application's root folder. 

**Svonix will copy over the following files into your `assets` folder, will create a `assets/js/svelte` folder, and will run `npm install`**:
- `package.json` (listing svelte's dependencies)
- `build.js` (custom ESBuild build script)

3. In your `config/dev.exs` file, add a watcher (you can replace the ESBuild watcher already there):

```elixir
config :my_app, MyApp.Endpoint,
    # other options
    watchers: [
        node: ["build.js", "--watch", cd: Path.expand("../assets", __DIR__)]
    ]


```

4. Finally, in your `assets/js/app.js` file, add the following line at the top:

```javascript
import 'svonix'
```

## Usage

1. Add new components to the `assets/js/svelte` folder. For example, we'll add a `test.svelte` component:
```html
<script>
  export let name;
</script>

<h1>Hey {name}, Phoenix and Svelte setup is working!</h1>
```

2. Next, add a Svonix tag where desired (the tag name **must** match the filename of the component), and pass in the arguments you like:
```elixir
# lib/myapp_web/templates/page/index.html.heex

<%= Svonix.render "test", %{ name: "Nikolai" } %>
```

You should see the component rendered in the view.


