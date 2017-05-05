var gulp = require("gulp"),
    gutil = require("gulp-util"),
    coffee = require("gulp-coffee");

// // test gulp
// gulp.task("log", function() {
//     gutil.log("Workflows are awesome");
// });

var coffeeSrc = ['components/coffee/tagline.coffee'];
gulp.task('coffee', function() {
    gulp.src(coffeeSrc)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

