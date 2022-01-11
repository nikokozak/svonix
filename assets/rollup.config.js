import svelte from 'rollup-plugin-svelte';
import svonix from './svonix_rollup_plugin';
import copy from 'rollup-plugin-copy';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import glob from 'glob';

const production = !process.env.MIX_ENV == "prod";
console.log("Production:", production);

const svelteComponentFiles = glob.sync('*.svelte', {cwd: 'js/svelte'});
const svelteComponentsConfig;

if (svelteComponentFiles.length > 0) {
    svelteComponentsConfig = [{
        input: svelteComponentFiles.map(fileName => `js/svelte/${fileName}`),
        output: {
            sourcemap: true,
            format: 'es',
            dir: '../priv/static/assets/svelte_components/'
        },
        plugins: [
            resolve({
                browser: true,
                dedupe: ['svelte']
            }),
            svelte({
                compilerOptions: {
                    // enable run-time checks when not in production
                    dev: !production
                }
            }),
            commonjs(),
            production && terser(),
            production && filesize()
        ]
    }]
} else {
    svelteComponentsConfig = [];
}

const phoenixAppConfig = {
	input: 'js/app.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: '../priv/static/assets/app.js',
	},
	plugins: [
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		css({ output: 'app.css' }),
		commonjs(),
        copy({
            targets: [{
            src: "static/*",
            dest: "../priv/static"
            },
            {
            src: "images/*",
            dest: "../priv/static/images"
            }],
        }),
        svonix({}),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}

export default [...svelteComponentsConfig, phoenixAppConfig]
