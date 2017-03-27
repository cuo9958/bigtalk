//导入工具包
var gulp = require('gulp'),
    less = require('gulp-less'),                    //less处理插件
    autoprefixer = require('gulp-autoprefixer'),    //css自动补全
    imagemin = require('gulp-imagemin'),            //图片压缩
    cache = require('gulp-cache'),                  //缓存管理
    fileinclude = require('gulp-file-include'),     //文件替换管理
    uglify = require('gulp-uglify'),                //js压缩插件
    cssmin = require('gulp-clean-css'),             //css压缩
    rename = require("gulp-rename"),                //文件重命名
    del = require('del'),                           //删除文件
    jshint = require("gulp-jshint");                //js的语法检测


var version="1.0.0";
//帮助
gulp.task("help", function () {
   
});

function setJavascript(path) {
    gulp.src(path)
        .pipe(jshint())
        .pipe(gulp.dest('www/js'))
}
function setCss(path) {
    gulp.src(path)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'], cascade: true, remove: true
        }))
        .pipe(gulp.dest('www/css'))
        .pipe(cssmin())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('www/css'));
}
function setHtml(path) {
    gulp.src(path)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                version: version
            }
        }))
        .pipe(gulp.dest('src'))
        .pipe(connect.reload());
}
function setImage(path) {
    gulp.src(path)
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('www/images'))
        .pipe(connect.reload());
}
//清空文件夹
gulp.task('clean', function () {
    del('www/*');
});
//使用live reload
gulp.task('connect', function () {
    connect.server({
        //host:'localhost',
        port: 8888,
        root: 'testDecomposing/src/main/dist/',
        livereload: true
    });
});

//监测文件改变
gulp.task('watch', function () {
    //监控less
    gulp.watch('src/css/*.less', function (event) {
        setCss(event.path);
    });
  
});

gulp.task('default', ['watch']); //定义默认任务