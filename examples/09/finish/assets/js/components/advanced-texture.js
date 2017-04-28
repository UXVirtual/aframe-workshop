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
        src:         { type: 'asset'},
        crossorigin: { default: '' },
        shininess: { type: 'int', default: 0 },
        specular: {type: 'color', default: "#ffffff"},
        color: {type: 'color', default: "#ffffff"},
        reflectivity: {type: 'float', default: 0},
        refractionRatio: {type: 'float', default: 0},
        smoothShading: { default: true },
        envMap: {type: 'asset'}
    },
    /**
     * `init` used to initialize material. Called once.
     */
    init: function () {

        var self = this;

        this.el.addEventListener('model-loaded',function(e){

            e.target.object3D.traverse(function(child){

                if(child instanceof THREE.Mesh){

                    //child.geometry.mergeVertices();
                    //child.geometry.computeFaceNormals();
                    //child.geometry.computeVertexNormals();

                    self.updateMaterial(child);



                    //child.material = material;

                }
            });



            if(self.data.src){
                var texUrl = self.convertToAbsoluteURL(document.baseURI,self.data.src);

                var texloader = new THREE.TextureLoader();
                if (self.data.crossorigin) texloader.setCrossOrigin(self.data.crossorigin);
                texloader.load(texUrl, function ( texture ) {

                    //var material = new THREE.MeshPhongMaterial({map: texture});
                    //material.shading = THREE.SmoothShading;
                    //material.shininess = self.data.shininess;
                    e.target.object3D.traverse(function(child){

                        if(child instanceof THREE.Mesh){

                            //child.geometry.mergeVertices();
                            //child.geometry.computeFaceNormals();
                            //child.geometry.computeVertexNormals();


                            child.material.map = texture;
                            child.material.needsUpdate = true;



                            //child.material = material;

                        }
                    });
                });
            }

            if(self.data.envMap){

                var path = self.convertToAbsoluteURL(document.baseURI,self.data.envMap)+'/';
                var format = '.jpg';

                var files = [
                    'px' + format, 'nx' + format,
                    'py' + format, 'ny' + format,
                    'pz' + format, 'nz' + format
                ];

                var envMap = new THREE.CubeTextureLoader().setPath(path);

                if (self.data.crossorigin) envMap.setCrossOrigin(self.data.crossorigin);
                envMap.load(files, function ( envMap ) {

                    console.log('Loaded envmap',envMap);

                    //var material = new THREE.MeshPhongMaterial({map: texture});
                    //material.shading = THREE.SmoothShading;
                    //material.shininess = self.data.shininess;
                    e.target.object3D.traverse(function(child){

                        if(child instanceof THREE.Mesh){

                            //child.geometry.mergeVertices();
                            //child.geometry.computeFaceNormals();
                            //child.geometry.computeVertexNormals();


                            child.material.envMap = envMap;
                            child.material.needsUpdate = true;


                            //child.material = material;

                        }
                    });
                });
            }





        });




    },

    update: function(){

        var self = this;

        self.el.object3D.traverse(function(child){

            if(child instanceof THREE.Mesh){
                self.updateMaterial(child);
            }
        });
    },

    updateMaterial: function(mesh){
        if(this.data.smoothShading){
            mesh.material.shading = THREE.SmoothShading;
        }else{
            mesh.material.shading = THREE.FlatShading;
        }

        mesh.material.color = new THREE.Color(this.data.color);
        mesh.material.combine = THREE.MixOperation;
        mesh.material.reflectivity = this.data.reflectivity;
        mesh.material.refractionRatio = this.data.refractionRatio;
        mesh.material.specular = new THREE.Color(this.data.specular);
        mesh.material.shininess = this.data.shininess;
        mesh.material.needsUpdate = true;
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

