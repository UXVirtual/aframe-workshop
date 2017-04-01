const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

var args = process.argv.slice(2);

console.log('Converting: ',args);

imagemin([args[0]], args[1], {
    plugins: [
        imageminMozjpeg({targa: true}),
        imageminPngquant({quality: '65-80'})
    ]
}).then(files => {
    console.log(files);
//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
});