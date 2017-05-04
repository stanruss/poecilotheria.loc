var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify");

// Скрипты проекта





gulp.task('browser-sync', function() {
	browserSync({
		proxy: "poecilotheria.loc",
		notify: false
	});
});

gulp.task('sass', function() {
	return gulp.src('assets/templates/Stas/Gulp/sass/**/*.sass')
	.pipe(sass().on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS())
	.pipe(gulp.dest('assets/templates/Stas/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'browser-sync'], function() {
	gulp.watch('assets/templates/Stas/Gulp/sass/**/*.sass', ['sass']);
	gulp.watch(['assets/templates/Stas/libs/**/*.js', 'app/js/common.js'], ['scripts']);
	gulp.watch('assets/templates/Stas/*.php', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('assets/templates/Stas/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('assets/templates/Stas/dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass'], function() {

	var buildFiles = gulp.src([
		'assets/templates/Stas/app/*.php',
		'app/.htaccess',
		]).pipe(gulp.dest('assets/templates/Stas/dist'));

	var buildCss = gulp.src([
		'assets/templates/Stas/css/main.min.css',
		]).pipe(gulp.dest('assets/templates/Stas/dist/css'));

	var buildJs = gulp.src([
		'assets/templates/Stas/app/js/scripts.min.js',
		]).pipe(gulp.dest('assets/templates/Stas/dist/js'));

	var buildFonts = gulp.src([
		'assets/templates/Stas/app/fonts/**/*',
		]).pipe(gulp.dest('assets/templates/Stas/dist/fonts'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'assets/templates/Stas/dist/**',
	'assets/templates/Stas/dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
