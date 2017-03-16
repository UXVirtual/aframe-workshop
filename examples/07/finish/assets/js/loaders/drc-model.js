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
var fileDisplayArea = {innerText:''};

AFRAME.registerComponent('drc-model', {
    schema: {
        src:         { type: 'asset' },
        crossorigin: { default: '' }
    },

    init: function () {
        this.model = null;
    },

    update: function () {
        var loader,
            data = this.data;
        if (!data.src) return;

        this.remove();
        loader = new THREE.DRACOLoader();
        loader.setVerbosity(1);
        if (data.crossorigin) loader.setCrossOrigin(data.crossorigin);

        var url = this.convertToAbsoluteURL(document.baseURI,data.src);

        loader.load(url, function(object) {
            this.load(object);
        }.bind(this),function(progress){
            //console.log('Progress ',progress);
        },function(error){
            console.log('There was an error loading Draco model: ',error);
        });
    },

    load: function (model) {

        const bufferGeometry = model;
        const material = new THREE.MeshStandardMaterial({vertexColors: THREE.VertexColors});
        var geometry;
        // Point cloud does not have face indices.
        if (bufferGeometry.index == null) {
            geometry = new THREE.Points(bufferGeometry, material);
        } else {
            bufferGeometry.computeVertexNormals();
            geometry = new THREE.Mesh(bufferGeometry, material);
        }
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

        this.model = geometry;
        this.el.setObject3D('mesh', geometry);
        this.el.emit('model-loaded', {format: 'draco', model: geometry});
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