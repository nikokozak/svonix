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

const glob = require('glob');

export default function svonixPlugin (options) {
    const { 
        staticDir = '/assets/svelte_components/',
        componentDir = 'js/svelte/'
    } = options;

    return {
        name: 'svonix-plugin',
        resolveId ( source ) {
            if (source == 'svonix') {
                return source;
            }
            return null;
        },
        load ( id ) {
            if (id == 'svonix') {
                const svelte_files = glob.sync('*.svelte', { cwd: componentDir });
                return svonix_source(svelte_files, staticDir);
            }
        }
    }

}
