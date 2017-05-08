/**
 * draco-model
 *
 * Loader for THREE.js Google Draco format (.drc).
 *
 * Requires the following to be loaded: https://cdn.rawgit.com/google/draco/e648e1bde5d9a90572bb0866bbfa0ec71e65009a/javascript/example/DRACOLoader.js
 *
 * See: https://github.com/google/draco/tree/master/javascript/example
 */

//var dracoDecoder = DracoModule();
//const DracoModule = Module;
//var fileDisplayArea = {innerText:''};

AFRAME.registerComponent('drc-model', {
    schema: {
        src:         { type: 'asset', required: true }, //you must set CORS headers if loading the model from a different domain to what the page is running on
        texture:         { type: 'asset' },
        crossorigin: { type: 'string', default: '' },
        dracoDecoderPath: {type: 'string', default: 'https://cdn.rawgit.com/google/draco/ecdd29e44ba3649f692a00a937893c5580fb5284/javascript/draco_decoder.js' },
        dracoWASMWrapperPath: {type: 'string', default: 'https://cdn.rawgit.com/google/draco/ecdd29e44ba3649f692a00a937893c5580fb5284/javascript/draco_wasm_wrapper.js'},
        dracoWASMPath: {type: 'string', default: 'https://cdn.rawgit.com/google/draco/ecdd29e44ba3649f692a00a937893c5580fb5284/javascript/draco_decoder.wasm'}
    },

    init: function () {
        this.model = null;

        // Global Draco decoder type.
        this.dracoDecoderType = {};
        this.dracoLoader = undefined;
    },

    update: function () {

        var data = this.data;
        if (!data.src) return;

        this.remove();

        this.loadDracoDecoder();
    },

    initDraco: function() {

        var data = this.data;

        this.dracoLoader.setVerbosity(1);

        var url;

        var pattern = /^((http|https|ftp):\/\/)/;

        if(!pattern.test(data.src)) {
            url = this.convertToAbsoluteURL(document.baseURI,data.src);
        }else{
            url = data.src;
        }

        this.dracoLoader.load(url, function(object) {
            console.log('Loaded');
            this.load(object,data.texture);
        }.bind(this),function(progress){
            console.log('Progress ',progress);
        },function(error){
            console.log('There was an error loading Draco model: ',error);
        });
    },

    load: function (model,texture) {

        var loader = new THREE.TextureLoader();

        var self = this;

        var bufferGeometry = model;
        var geometry, material;

        if(texture){
            loader.load(texture, function ( texture ) {
                // Point cloud does not have face indices.
                if (bufferGeometry.index == null) {
                    material = new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors});
                    material.shading = THREE.SmoothShading;
                    geometry = new THREE.Points(bufferGeometry, material);
                } else {
                    bufferGeometry.computeVertexNormals();
                    material = new THREE.MeshLambertMaterial({map: texture, vertexColors: THREE.VertexColors});
                    geometry = new THREE.Mesh(bufferGeometry, material);
                }
                self.computeGeometry(bufferGeometry,geometry);
            });
        }else{
            // Point cloud does not have face indices.
            if (bufferGeometry.index == null) {
                material = new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors});
                material.shading = THREE.SmoothShading;
                geometry = new THREE.Points(bufferGeometry, material);
            } else {
                bufferGeometry.computeVertexNormals();
                material = new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors});
                geometry = new THREE.Mesh(bufferGeometry, material);
            }
            self.computeGeometry(bufferGeometry,geometry);
        }
    },

    // This function loads a JavaScript file and adds it to the page. "path"
    // is the path to the JavaScript file. "onLoadFunc" is the function to be
    // called when the JavaScript file has been loaded.
    loadJavaScriptFile: function(path, onLoadFunc) {
        const head = document.getElementsByTagName('head')[0];
        const element = document.createElement('script');
        element.type = 'text/javascript';
        element.src = path;
        if (onLoadFunc !== null)
            element.onload = onLoadFunc;
        head.appendChild(element);
    },
    loadWebAssemblyDecoder: function() {

        var self = this;

        this.dracoDecoderType['wasmBinaryFile'] = self.data.dracoWASMPath;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', self.data.dracoWASMPath, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            // draco_wasm_wrapper.js must be loaded before DracoModule is
            // created. The object passed into DracoModule() must contain a
            // property with the name of wasmBinary and the value must be an
            // ArrayBuffer containing the contents of the .wasm file.
            self.dracoDecoderType['wasmBinary'] = xhr.response;
            self.createDracoDecoder();
        };
        xhr.send(null)
    },
    // This function will test if the browser has support for WebAssembly. If
    // it does it will download the WebAssembly Draco decoder, if not it will
    // download the asmjs Draco decoder.
    // TODO: Investigate moving the Draco decoder loading code
    // over to DRACOLoader.js.
    loadDracoDecoder: function() {
        var self = this;

        if (typeof WebAssembly !== 'object') {
            // No WebAssembly support
            this.loadJavaScriptFile(this.data.dracoDecoderPath, function(){

                self.createDracoDecoder();
            });
        } else {
            this.loadJavaScriptFile(this.data.dracoWASMWrapperPath, function(){
                console.log('Loaded JS file');
                self.loadWebAssemblyDecoder();
            });
        }
    },

    createDracoDecoder: function() {
        this.dracoLoader = new THREE.DRACOLoader();
        this.dracoLoader.setDracoDecoderType(this.dracoDecoderType);
        this.initDraco();
    },


    computeGeometry: function(bufferGeometry,geometry) {
        var self = this;

        // Compute range of the geometry coordinates for proper rendering.
        bufferGeometry.computeBoundingBox();
        const sizeX = bufferGeometry.boundingBox.max.x - bufferGeometry.boundingBox.min.x;
        const sizeY = bufferGeometry.boundingBox.max.y - bufferGeometry.boundingBox.min.y;
        const sizeZ = bufferGeometry.boundingBox.max.z - bufferGeometry.boundingBox.min.z;
        const diagonalSize = Math.sqrt(sizeX * sizeX + sizeY * sizeY + sizeZ * sizeZ);
        const scale = 1.0 / diagonalSize;
        const midX = (bufferGeometry.boundingBox.min.x + bufferGeometry.boundingBox.max.x) / 2;
        const midY = (bufferGeometry.boundingBox.min.y + bufferGeometry.boundingBox.max.y) / 2;
        const midZ = (bufferGeometry.boundingBox.min.z + bufferGeometry.boundingBox.max.z) / 2;
        geometry.scale.multiplyScalar(scale);
        geometry.position.x = -midX * scale;
        geometry.position.y = -midY * scale;
        geometry.position.z = -midZ * scale;
        geometry.castShadow = true;
        geometry.receiveShadow = true;

        self.model = geometry;
        self.el.setObject3D('mesh', geometry);
        self.el.emit('model-loaded', {format: 'draco', model: geometry});
    },

    remove: function () {
        if (this.model) this.el.removeObject3D('mesh');
    },

    convertToAbsoluteURL: function(base, relative) {
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); // remove current file name (or empty string)
                     // (omit if "base" is the current folder without trailing slash)
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
});