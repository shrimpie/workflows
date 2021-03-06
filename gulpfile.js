var gulp = require("gulp"),
    gutil = require("gulp-util"),
    coffee = require("gulp-coffee"),
    browserify = require("gulp-browserify"),
    compass = require("gulp-compass"),
    connect = require("gulp-connect"),
    gulpif = require("gulp-if"),
    uglify = require("gulp-uglify"),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    jsonMinify = require('gulp-jsonminify'),
    imageMin = require('gulp-imagemin'),
    pngCrush = require('imagemin-pngcrush'),
    concat = require("gulp-concat");

var env,
    coffeeSrc,
    jsSrc,
    sassSrc,
    htmlSrc,
    jsonSrc,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if(env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

coffeeSrc = ['components/coffee/tagline.coffee'];
jsSrc = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js',
];
sassSrc = ['components/sass/style.scss'];
htmlSrc = [outputDir + '*.html'];
jsonSrc = [outputDir + '/js/*.json'];

gulp.task('coffee', function() {
    gulp.src(coffeeSrc)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task("js", function() {
    gulp.src(jsSrc)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulpif(env === "production", uglify()))
        .pipe(gulp.dest(outputDir + "js"))
        .pipe(connect.reload())
});

gulp.task("compass", function() {
    gulp.src(sassSrc)
        .pipe(compass({
            css: outputDir + 'css',
            // this thing removes a duplicated output folder 'css' in the root folder.
            sass: 'components/sass', // sass directory
            image: outputDir + 'images' // image directory
            // style: sassStyle
            // :compressed can be moved to config.rb, 
            // well, after experimenting, you can minify 
            // it using gulp-minify-css to achieve the
            // same result. Great.
        }))
        .on('error', gutil.log)
        .pipe(minifyCSS()) // see what it does, it does what you are expecting.
        .pipe(gulp.dest(outputDir + "css"))
        .pipe(connect.reload())
});

gulp.task("connect", function() {
    connect.server({
        root: outputDir,
        livereload: true
    });
});


gulp.task("watch", function() {
    gulp.watch(coffeeSrc, ['coffee']);
    gulp.watch(jsSrc, ['js']);
    gulp.watch("components/sass/*.scss", ['compass']);
    // gulp.watch(htmlSrc, ['html']);
    gulp.watch("builds/development/*.html", ['html']);
    gulp.watch("builds/development/js/*.json", ['json']);
    gulp.watch("builds/development/images/**/*.*", ['images']);
});

gulp.task("html", function() {
    gulp.src("builds/development/*.html")
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});


gulp.task("images", function() {
    gulp.src("builds/development/images/**/*.*")
        .pipe(gulpif(env === 'production', imageMin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngCrush()]
        })))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + "images")))
        .pipe(connect.reload())
})

gulp.task("json", function() {
    gulp.src("builds/development/js/*.json")
        .pipe(gulpif(env === 'production', jsonMinify()))
        .pipe(gulpif(env === 'production', gulp.dest("builds/production/js")))
        .pipe(connect.reload())
});


gulp.task("default", ["html", "json","coffee", "js", "compass", "images", "connect", "watch"]);








