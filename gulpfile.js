const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const fontmin = require('gulp-fontmin');
const rename = require("gulp-rename");
const newer = require('gulp-newer');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminSvgo = require('imagemin-svgo');


const jsFiles = [
    './src/js/lib.js',
    './src/js/some.js'
]

function concatCss() {
    return gulp.src('./src/css/*.css')
                .pipe(cleanCSS({
                    level: 2
                }))
                .pipe(gulp.dest('./build/css/'))
}

function styles() {
    return gulp.src('./src/sass/style.sass')
                .pipe(sass({
                    includePaths: require('node-normalize-scss').includePaths
                }).on('error', sass.logError))
                .pipe(autoprefixer({
                    browsers: ['> 0.1%'],
                    cascade: false
                }))
                .pipe(cleanCSS({
                    level: 2
                }))
                .pipe(gulp.dest('./build/css/'))
                .pipe(browserSync.stream());
}

function watch(){
    browserSync.init({
        server: {
            baseDir: "./build/"
        },
        // tunnel: true
    });

    gulp.watch('./src/sass/**/*.sass', styles);
    gulp.watch('./src/*.html', htmlminify);
    gulp.watch('./src/css/*.css', concatCss);
    gulp.watch('./src/js/*.js', scripts);
} 

function htmlminify(){
    return gulp.src('./src/*.html')
                .pipe(htmlmin({ collapseWhitespace: true }))
                .pipe(gulp.dest('./build/'))
                .pipe(browserSync.stream());
}

function clean(){
    return del(['build/*']);
}

function imageMinify(){
    return gulp.src('./src/img/**/*.{jpg,jpeg,png,gif,svg,JPG}')
                .pipe(newer('./build/img/'))
                .pipe(imagemin([
                    imageminJpegRecompress({
                        method: 'smallfry'
                    }),
                ]))
                .pipe(gulp.dest('./build/img/'))
                .pipe(browserSync.stream());
}

function fontsMinify(){
    return gulp.src('./build/fonts/*')
                .pipe(fontmin({
                    text: '天地玄黄 宇宙洪荒',
                }))
                .pipe(gulp.dest('./build/img/'))
                .pipe(browserSync.stream());
}

function scripts(){
    return gulp.src('./src/js/*.js')
                .pipe(uglify())
                .pipe(gulp.dest('./build/js/'))
                .pipe(browserSync.stream());
}

gulp.task('styles', styles);
gulp.task('htmlmin', htmlminify);
gulp.task('imagemin', imageMinify);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, 
                    gulp.parallel(styles, concatCss, htmlminify, scripts, imageMinify, fontsMinify)
                    ));
gulp.task('dev', gulp.series('build', 'watch'));
gulp.task('gulp-concat', concatCss);
gulp.task('scripts', scripts);