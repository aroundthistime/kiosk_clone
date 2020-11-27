import gulp from 'gulp';
import del from 'del';
import gulpImg from 'gulp-imagemin';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso'; // minify css
import bro from 'gulp-bro';
import babelify from 'babelify';

sass.compiler = require('node-sass');

const routes = {
  img: {
    src: 'src/img/*',
    dest: 'build/img',
  },
  scss: {
    watch: 'src/scss/**/*.scss',
    src: 'src/scss/style.scss',
    dest: 'build/css',
  },
  js: {
    watch: 'src/js/**/*.js',
    src: 'src/js/main.js',
    dest: 'build/js',
  },
};

const img = () => gulp.src(routes.img.src).pipe(gulpImg()).pipe(gulp.dest(routes.img.dest));

const styles = () => gulp.src(routes.scss.src).pipe(sass().on('error', sass.logError)).pipe(autoprefixer({
  overrideBrowerslist: ['cover 99.5%'],
})).pipe(csso())
  .pipe(gulp.dest(routes.scss.dest));

const js = () => gulp.src(routes.js.src).pipe(bro({
  transform: [
    babelify.configure({ presets: ['@babel/preset-env'] }),
    // ['uglifyify', { global: true }],
  ],
})).pipe(gulp.dest(routes.js.dest));

const clean = () => del(['build/']);

const prepare = gulp.series([clean, img]);

const assets = gulp.series([styles, js]);

const watch = () => {
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

export const dev = gulp.series([prepare, assets, watch]);
