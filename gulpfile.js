const { src, dest, watch, series, parallel }= require('gulp');

//CSS Y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

//Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css( done ){
    //compilar sass
    //pasos: 1- identificar archivos, 2- Compilarla, 3- Guardar el .css
    src('src/scss/app.scss')
    //comprime la hoja de estilos  outputStyle: 'compressed'//'expanded'  la coloca de forma normal
        .pipe( sourcemaps.init() )
        .pipe( sass() )                                      
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/css') )

    done();
}

function versionAvif(){
    const opciones = {
        quality:50
    }
    return  src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('build/img'));
}

function versionWebp(){
    const opciones = {
        quality:50
    }
    return  src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img'));
}

function image (){
    return src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest('build/img') );
}

function dev(  ){

    watch( 'src/scss/**/*.scss', css);
    watch( 'src/img/**/*',image );

}



exports.css = css;
exports.dev = dev;
exports.image = image;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(  image, versionWebp, versionAvif, css, dev );

//series - Se inicia una tarea, y hasta que finaliza, inicia la siguiente
//parallel - Todas inician al mismo tiempo