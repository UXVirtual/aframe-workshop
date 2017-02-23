var collada2gltf = require('collada2gltf');

var args = process.argv.slice(2);

console.log('Converting: ',args);

collada2gltf(args[0], function(err) {


    if(err){
        console.log('Whoops! Something went wrong!');
        console.error(err);
    }else{
        console.log('Conversion finished');
    }


    //Now you have a set of gltf files in your current directory;)
    //source.bin, source.json + shader files (source.0FS.glsl, source.0VS.glsl)
});