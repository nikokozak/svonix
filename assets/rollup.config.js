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
const svelteComponentsConfig = svelteComponentFiles.length > 0 ?  
    [{
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
    }] : []

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
        // ADD OTHER NON-PROCESSED ASSETS HERE, SEE:
        // https://www.npmjs.com/package/rollup-plugin-copy
        copy({
            targets: [{
                src: ["css/**/*", "!css/app.css"],
                dest: "../priv/static/assets"
            }]
        }),
        svonix({}),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}

export default [...svelteComponentsConfig, phoenixAppConfig]
