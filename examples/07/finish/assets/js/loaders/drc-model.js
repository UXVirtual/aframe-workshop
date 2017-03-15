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
        //loader.setVerbosity(1);
        if (data.crossorigin) loader.setCrossOrigin(data.crossorigin);
        console.log('Loading...');

        console.log(data.src);

        loader.load(data.src, function(object) {

            console.log('Loaded.');
            console.log(object);


            // Enable skinning, if applicable.
            /*object.traverse(function(o) {
                if (o instanceof THREE.SkinnedMesh && o.material) {
                    o.material.skinning = !!((o.geometry && o.geometry.bones) || []).length;
                }
            });*/

            this.load(object);
        }.bind(this),function(progress){
            console.log('Progress ',progress);
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
        const selectedObject = scene.getObjectByName("my_mesh");
        scene.remove(selectedObject);
        geometry.name = "my_mesh";
        scene.add(geometry);

        this.model = model;
        this.el.setObject3D('mesh', model);
        this.el.emit('model-loaded', {format: 'draco', model: model});
    },

    remove: function () {
        if (this.model) this.el.removeObject3D('mesh');
    }
});