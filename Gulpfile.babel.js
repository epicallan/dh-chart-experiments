import { watch, parallel, series } from 'gulp';
import { browsersync } from './tasks/browsersync';
import clean from './tasks/clean';
import stylesheets from './tasks/stylesheets';
import javascripts from './tasks/javascripts';
import html from './tasks/html';
import copy from './tasks/copy';

// Build task
export const build = series(
	clean, parallel(javascripts, html, stylesheets, copy)
);

// Development task
export const development = series(
	clean, parallel(javascripts, stylesheets, html), function run() {
		// Start browserSync
		browsersync.init({
			open: false,
			server: {
				baseDir: 'dest',
				routes: {
					'/node_modules': 'node_modules',
				},
			},
		});

		// Watch files, run compliers
		watch('src/stylesheets/**/*.scss', stylesheets);
		watch('src/**/*.jade', series(html, browsersync.reload));
		watch('src/javascripts/**/*.js', javascripts);
	}
);
