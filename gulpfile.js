var gulp = require("gulp"),
    gutil = require("gulp-util"),
    coffee = require("gulp-coffee"),
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

gulp.task('coffee', function() {
    gulp.src(coffeeSrc)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task("js", function() {
    gulp.src(jsSrc)
        .pipe(concat('script.js'))
        .pipe(gulp.dest("builds/development/js"))
});