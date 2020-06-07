const { watch, series, src, dest } = require('gulp');
const fs = require('fs');
const browserSync = require('browser-sync');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const del = require('del');




function server() {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        notify: false
    });
}

function files() {
    return src(['./src/index.html', './src/js/main.js'])
    .pipe(dest('./dist')) 
}

function cleanDist() {
    return del('./dist');
}

/*function cleanDist() {
    return src('./dist', {read: false})
    .pipe(clean());
}*/


function css() {
    return src('./src/less/**/*.less')
      .pipe(less({outputStyle: 'expanded'}))
      .pipe(autoprefixer(['last 15 versions', '> 0.2%'], { cascade: true}))
      .pipe(dest('./dist'))
      .pipe(browserSync.reload({stream: true}));
}
    



function bootstrap(cb) {
    cleanDist();
    files();
    css();
    server();
    cb();
}

function watchFiles(cb) {
    watch('./src/index.html', function() {
        return src('./src/index.html')
            .pipe(dest('./dist'))
            .pipe(browserSync.reload({stream: true}));
    });
    watch('./src/js/main.js', function() {
        return src('./src/js/main.js')
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(dest('./dist'))
            .pipe(browserSync.reload({stream: true}));
    });
    watch('./src/less/**/*.less', css);
    (cb);
}

exports.cleanDist = cleanDist;


exports.default = series(bootstrap, watchFiles);
