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
        src:         { type: 'asset'}, //this should be the URL to the texture file you wish to load. If loading cross-domain do NOT load it via a-asset-item as this will not send the correct headers
        crossorigin: { type: 'string', default: '' },//if the src and texture are loaded from a different domain, then set this to 'anonymous'
        shininess: { type: 'int', default: 0 },
        specular: {type: 'color', default: "#ffffff"},
        color: {type: 'color', default: "#ffffff"},
        reflectivity: {type: 'float', default: 0},
        refractionRatio: {type: 'float', default: 0},
        smoothShading: { type: 'boolean', default: true },
        envMap: {type: 'asset'} //this should be the URL to the environment map file you wish to load. If loading cross-domain do NOT load it via a-asset-item as this will not send the correct headers
    },
    /**
     * `init` used to initialize material. Called once.
     */
    init: function () {

        var self = this;

        var pattern = /^((http|https|ftp):\/\/)/;

        this.el.addEventListener('model-loaded',function(e){

            e.target.object3D.traverse(function(child){
                if(child instanceof THREE.Mesh){
                    self.updateMaterial(child);
                }
            });

            if(self.data.src){

                var texUrl;

                if(!pattern.test(self.data.src)) {
                    texUrl = self.convertToAbsoluteURL(document.baseURI,self.data.src);
                }else{
                    texUrl = self.data.src;
                }

                var texloader = new THREE.TextureLoader();
                if (self.data.crossorigin) texloader.setCrossOrigin(self.data.crossorigin);
                texloader.load(texUrl, function ( texture ) {

                    e.target.object3D.traverse(function(child){

                        if(child instanceof THREE.Mesh){
                            child.material.map = texture;
                            child.material.needsUpdate = true;
                        }
                    });
                });
            }

            if(self.data.envMap){

                var path;

                if(!pattern.test(self.data.envMap)) {
                    path = self.convertToAbsoluteURL(document.baseURI,self.data.envMap)+'/';
                }else{
                    path = self.data.envMap;
                }

                var format = '.jpg';

                var files = [
                    'px' + format, 'nx' + format,
                    'py' + format, 'ny' + format,
                    'pz' + format, 'nz' + format
                ];

                var envMap = new THREE.CubeTextureLoader().setPath(path);

                if (self.data.crossorigin) envMap.setCrossOrigin(self.data.crossorigin);
                envMap.load(files, function ( envMap ) {

                    e.target.object3D.traverse(function(child){

                        if(child instanceof THREE.Mesh){

                            child.material.envMap = envMap;
                            child.material.needsUpdate = true;

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

