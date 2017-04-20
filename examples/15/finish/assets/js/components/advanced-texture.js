/**
 * Advanced Texture component
 *
 * Use this in place of loading in a model's UV texture. It will replace the uv texture on all the materials in the
 * model with the one specified via the texture property of this component.
 *
 * e.g: advanced-texture="src: RELATIVE_PATH_TO_TEXTURE"
 *
 * Note that src cannot be a cached ID reference to an asset in the scene
 *
 *
 */
AFRAME.registerComponent('advanced-texture', {
    schema: {
        src:         { type: 'asset', required: true },
        crossorigin: { default: '' },
        shininess: { default: 30 }
    },
    /**
     * `init` used to initialize material. Called once.
     */
    init: function () {

        var self = this;

        this.el.addEventListener('model-loaded',function(e){

            var url = self.convertToAbsoluteURL(document.baseURI,self.data.src);

            var loader = new THREE.TextureLoader();
            loader.load(url, function ( texture ) {
                //var material = new THREE.MeshLambertMaterial({map: texture, vertexColors: THREE.VertexColors});
                //material.shading = THREE.SmoothShading;
                e.target.object3D.traverse(function(child){

                    if(child instanceof THREE.Mesh){
                        child.material.shading = THREE.SmoothShading;
                        child.material.map = texture;
                        child.material.needsUpdate = true;
                        child.material.shininess = self.data.shininess;


                        //child.material = material;

                    }
                });
            });



        });


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

