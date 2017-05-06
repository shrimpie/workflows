var gulp = require("gulp"),
    gutil = require("gulp-util"),
    coffee = require("gulp-coffee"),
    browserify = require("gulp-browserify"),
    compass = require("gulp-compass"),
    connect = require("gulp-connect"),
    concat = require("gulp-concat");

// // test gulp
// gulp.task("log", function() {
//     gutil.log("Workflows are awesome");
// });

var coffeeSrc = ['components/coffee/tagline.coffee'];
var jsSrc = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js',
];
var sassSrc = ['components/sass/style.scss'];

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
        .pipe(gulp.dest("builds/development/js"))
        .pipe(connect.reload())
});

gulp.task("compass", function() {
    gulp.src(sassSrc)
        .pipe(compass({
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'expanded'
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest("builds/development/css"))
        .pipe(connect.reload())
});

gulp.task("connect", function() {
    connect.server({
        root: "builds/development/",
        livereload: true
    });
});


gulp.task("watch", function() {
    gulp.watch(coffeeSrc, ['coffee']);
    gulp.watch(jsSrc, ['js']);
    gulp.watch("components/sass/*.scss", ['compass']);
})

gulp.task("default", ["coffee", "js", "compass", "connect", "watch"]);








