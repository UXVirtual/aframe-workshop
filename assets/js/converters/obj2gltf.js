var obj2gltf = require('obj2gltf');
var options = {
    separateTextures : true // Don't embed image in the converted glTF
};

var args = process.argv.slice(2);

obj2gltf(args[0], args[0]+'.gltf', options)
    .then(function() {
        console.log('Conversion finished');
    },function(err){
        console.log('Whoops! Something went wrong!');
        console.error(err);
    });