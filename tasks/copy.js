import { src, dest } from 'gulp';

export default function copy(done) {
	src(['src/images/**/*']).pipe(dest('dest/images'));
	done();
}
