let gulp = require('gulp')
let coffeelint = require('gulp-coffeelint')
let uglify = require('gulp-uglify')
let cleanCSS = require('gulp-clean-css')
let less = require('gulp-less')
let es = require('event-stream')
let lesshint = require('gulp-lesshint')
let coffee = require('gulp-coffee')
let htmlLint = require('gulp-html-lint')
let csslint = require('gulp-csslint')

gulp.task('html', () => {
    return es.concat(
        gulp.src('./*.html')
            // HTMLLint
            .pipe(htmlLint({
                htmllintrc: "./.htmllintrc",
                useHtmllintrc: true
            }))
            .pipe(htmlLint.format())
            .pipe(htmlLint.failOnError())
    )
})

gulp.task('css', () => {
    return es.concat(
        gulp.src('./src/css/*.css')
            .pipe(csslint('csslintrc.json'))
            .pipe(csslint.formatter()),
        gulp.src('./src/css/*.css')
            .pipe(csslint('csslintrc.json'))
            .pipe(csslint.failFormatter())
            .pipe(gulp.dest('./dest/'))
    )
})

gulp.task('less', () => {
    return es.concat(
        gulp.src('./src/less/*.less')
            // LessLint
            .pipe(lesshint('./.lesshintrc')) // 使用 `.lesshintrc` 文件的配置
            .pipe(lesshint.reporter())
            .pipe(lesshint.failOnError()) // 出现 Error 时中断 Gulp Task
            // Less to CSS
            .pipe(less())
            // minify CSS
            .pipe(cleanCSS())
            .pipe(gulp.dest('./dest/'))
    )
})

gulp.task('coffee', () => {
    return es.concat(
        gulp.src('./node_modules/jquery/dist/jquery.js')
            .pipe(gulp.dest('./dest/')),
        gulp.src('./src/coffee/*.coffee')
            // CoffeeLint
            .pipe(coffeelint())
            .pipe(coffeelint.reporter('fail')) // 出现 Fail 时中断 Gulp Task
            // CoffeeScript to JavaScript
            .pipe(coffee())
            // Uglify JS
            .pipe(uglify())
            .pipe(gulp.dest('./dest/'))
    )
})
