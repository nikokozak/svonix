// ARGS

const esbuild = require('esbuild')

const args = process.argv.slice(2)
const watch = args.includes('--watch')
const deploy = args.includes('--deploy')

// PLUGINS

const svonix_file_array = (svonix_files) => {
    let arr = ["["];
    svonix_files.forEach(file => { arr.push(`"${file}",`) });
    arr.push("]");
    return arr.join("");
}

const svonix_source = (svonix_files, outputDir) => {
return `
window.onload = async function() {
  ${svonix_file_array(svonix_files)}.forEach(async (file) => {
    const componentName = file.replace(/\\.\\/|\\.svelte/g, "");
    const targetId = 'svonix-' + componentName;
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    // see: https://stackoverflow.com/questions/65484019/how-can-i-manually-compile-a-svelte-component-down-to-the-final-javascript-and-c
    const componentURL = '${outputDir}' + componentName + '.js';

    const { default: SvelteComponent } = await import(componentURL);

    const props = target.getAttribute("data-props");
    let parsedProps = {};
    if (props) {
      parsedProps = JSON.parse(props);
    }
    
    const component = new SvelteComponent({ target, props: parsedProps });
  });
};
`;
}

const sveltePlugin = {
  name: 'svelte',
  setup(build) {
    let svelte = require('svelte/compiler')
    let path = require('path')
    let fs = require('fs')

    build.onLoad({ filter: /\.svelte$/ }, async (args) => {
      // This converts a message in Svelte's format to esbuild's format
      let convertMessage = ({ message, start, end }) => {
        let location
        if (start && end) {
          let lineText = source.split(/\r\n|\r|\n/g)[start.line - 1]
          let lineEnd = start.line === end.line ? end.column : lineText.length
          location = {
            file: filename,
            line: start.line,
            column: start.column,
            length: lineEnd - start.column,
            lineText,
          }
        }
        return { text: message, location }
      }

      // Load the file from the file system
      let source = await fs.promises.readFile(args.path, 'utf8')
      let filename = path.relative(process.cwd(), args.path)

      // Convert Svelte syntax to JavaScript
      try {
        let { js, warnings } = svelte.compile(source, { filename })
        let contents = js.code + `//# sourceMappingURL=` + js.map.toUrl()
        return { contents, warnings: warnings.map(convertMessage) }
      } catch (e) {
        return { errors: [convertMessage(e)] }
      }
    })
  }
}

const glob = require('glob');

const svonixPlugin = {
    name: 'svonix',
    setup(build) {
        let path = require('path')

        build.onResolve({ filter: /^svonix$/ }, args => ({
            path: args.path,
            namespace: 'svonix-ns'
        }))
        
        build.onLoad({ filter: /.*/, namespace: 'svonix-ns' }, async () => { 
            const svelte_files = glob.sync('js/svelte/**/*.svelte', { ignore: 'js/svelte/**/_*.svelte' });
            const svelte_filenames = svelte_files.map(el => path.relative('js/svelte', el).replace('.svelte', ''))
           
            await esbuild.build({
                entryPoints: svelte_files,
                bundle: true,
                write: true,
                format: 'esm',
                watch: watch,
                outdir: '../priv/static/assets/svelte_components/',
                plugins: [sveltePlugin],
            }).catch(() => process.exit(1))

            return {
                contents: svonix_source(svelte_filenames, '/assets/svelte_components/')
            }
        })
    }
}
// BUILD SCRIPT

const loader = {
  // Add loaders for images/fonts/etc, e.g. { '.svg': 'file' }
}

const plugins = [
    svonixPlugin
]

let opts = {
  entryPoints: ['js/app.js'],
  bundle: true,
  target: 'es2017',
  outdir: '../priv/static/assets',
  logLevel: 'info',
  loader,
  plugins
}

if (watch) {
  opts = {
    ...opts,
    watch,
    sourcemap: 'inline'
  }
}

if (deploy) {
  opts = {
    ...opts,
    minify: true
  }
}

const promise = esbuild.build(opts)

if (watch) {
  promise.then(_result => {
    process.stdin.on('close', () => {
      process.exit(0)
    })

    process.stdin.resume()
  })
}
