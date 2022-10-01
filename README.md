## Contributors Wanted!

There's a lot to do to further streamline Svelte <~> Svonix goodness. Please feel free to submit pull requests, or add in new features - it's really an easy library to wrap your head around, and quite fun to work with as a first open source project.

# Svonix

Svonix is a small library that allows you to easily create and use [Svelte](https://svelte.dev/) components in [Phoenix](https://www.phoenixframework.org/).

Svonix is loosely based on the ideas behind [Sveltex](https://github.com/virkillz/sveltex), but is written to support [Phoenix](https://www.phoenixframework.org/) `> 1.6`, as well as dynamic loading of individual Svelte components to reduce filesizes.

Svonix works with [ESBuild](https://esbuild.github.io/) which is the default bundler for Phoenix.

Please note that while npm packages can be imported and work as you would expect, **Svelte component libraries** are currently not supported.

## Installation

1. Add `svonix` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:svonix, "~> 0.6"}
  ]
end
```

2. Next, run `mix svonix.setup` from your Phoenix application's root folder. 

**Svonix will create an `assets/js/svelte` folder, and will run `npm install` after copying over the following files into your `assets` folder:**
- `package.json` (listing svelte's dependencies)
- `build.js` (custom ESBuild build script)

**Svonix will also automatically make changes to the following files:**
- In your `config/dev.exs` file, it will add a watcher (and comment out the ESBuild watcher already there):

```elixir
config :my_app, MyApp.Endpoint,
    # other options
    watchers: [
        node: ["build.js", "--watch", cd: Path.expand("../assets", __DIR__)],
    ]
```

- In your `assets/js/app.js` file, it will add the following line at the top:

```javascript
import 'svonix'
```

3. Svonix is ready to use! 

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

## Advanced Usage

**Folder Structure**

Svonix supports nesting components to accommodate whatever structure you might desire. In other words, you can structure your svelte files as follows:

```
assets/js/svelte/
    ARootComponent.svelte
    helpers/
        AHelperComponent.svelte
        AnotherComponent.svelte
            evenMoreHelpers/
                PrettyDeepNesting.svelte
```

In order to render a component that has been nested (say, for example, `AnotherComponent.svelte`), simply pass in the path of the component (**without an extension**) into the `render` function:

```Elixir
<%= Svonix.render "helpers/AnotherComponent" %>
```

**Private Components**

By default, any and all components you declare in your folder structure will generate individual `js` files in your `priv/static/assets/svelte_components` folder. This isn't really a problem given that these files are only loaded by the client on demand. Nonetheless, **to avoid compiling a given file, simply prepend an `_` (underscore) to its name**. You can import the file from other components, but it will not be made available to render.

```
assets/js/svelte/
    ThisWillBeExportedAsAFile.svelte
    _ThisWillNot.svelte
```

## Troubleshooting

**Installation**

If for any reason the installation errors out, you can always try the following:

- Ensure that the following line is present in your "watchers" config option in `config/dev.exs`, and that the default `esbuild: {...}` option is commented out or deleted:

```elixir
config :my_app, MyApp.Endpoint,
    # other options
    watchers: [
        node: ["build.js", "--watch", cd: Path.expand("../assets", __DIR__)],
    ]
```

- Ensure that the following line is included at the top of your `assets/js/app.js` file:

```javascript
import 'svonix'
```

**Installation Fails at any point**

There's no rollback mechanism for the insertions Svonix executes on `dev.exs` and `app.js`. If the install fails at any point, make sure to check for duplicate injections in these files and remove them.

**Umbrella Applications**

Svonix supports being installed in umbrella application apps - you'll probably get an error regarding `npm` not being able to find deps like `phoenix_html`. If this happens, run the following command:

```shell
npm install ../../../deps/phoenix ../../../deps/phoenix_html ../../../deps/phoenix_live_view --save
```

## TODO

- [ ] How to better test a successful integration without having to resort to building containers/etc.
