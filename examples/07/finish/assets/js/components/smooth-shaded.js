AFRAME.registerComponent('smooth-shaded', {
    schema: {
    },
    /**
     * `init` used to initialize material. Called once.
     */
    init: function (data) {

        this.el.addEventListener('model-loaded',function(e){

            e.target.object3D.traverse(function(child){
                if(child instanceof THREE.Mesh){
                    console.log(child);
                    child.material.shading = THREE.SmoothShading;
                }
            });
        });


    }
});

