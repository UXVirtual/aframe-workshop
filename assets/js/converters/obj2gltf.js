var obj2gltf = require('obj2gltf');
var convert = obj2gltf.convert;
var options = {
    embedImage : false // Don't embed image in the converted glTF
};

var args = process.argv.slice(2);

convert(args[0], args[0]+'.gltf', options)
    .then(function() {
        console.log('Conversion finished');
    },function(err){
        console.log('Whoops! Something went wrong!');
        console.error(err);
    });