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
        shininess: { default: 30 },
        smoothShading: { default: true }
    },
    /**
     * `init` used to initialize material. Called once.
     */
    init: function () {

        var self = this;

        this.el.addEventListener('model-loaded',function(e){

            var url = self.convertToAbsoluteURL(document.baseURI,self.data.src);

            var loader = new THREE.TextureLoader();
            if (self.data.crossorigin) loader.setCrossOrigin(self.data.crossorigin);
            loader.load(url, function ( texture ) {

                console.log(texture);

                //var material = new THREE.MeshPhongMaterial({map: texture});
                //material.shading = THREE.SmoothShading;
                //material.shininess = self.data.shininess;
                e.target.object3D.traverse(function(child){

                    if(child instanceof THREE.Mesh){

                        //child.geometry.mergeVertices();
                        //child.geometry.computeFaceNormals();
                        //child.geometry.computeVertexNormals();

                        if(self.data.smoothShading){
                            child.material.shading = THREE.SmoothShading;
                        }else{
                            child.material.shading = THREE.FlatShading;
                        }

                        child.material.map = texture;
                        child.material.shininess = self.data.shininess;
                        child.material.needsUpdate = true;



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

