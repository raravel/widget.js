import path from 'path';
import { defineConfig } from 'vite';
import typescript2 from 'rollup-plugin-typescript2';

module.exports = defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'WidgetJS',
			fileName: (format) => `widget.${format}.js`,
		},
		sourcemap: true,
		target: 'esnext',
	},
	plugins: [
		{
			...typescript2(),
			apply: 'build',
		},
	],
});
