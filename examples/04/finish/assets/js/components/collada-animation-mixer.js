AFRAME.registerComponent('collada-animation-mixer', {
    init: function () {

        var data = this.data;

        var self = this;

        self.el.addEventListener('model-loaded', function(e) {

            self.model = e.detail.model;

            if(data.autoplay){
                self.playAnim();
            }

        });
    },

    playAnim: function () {

        var self = this;

        this.model.traverse( function ( child ) {
            if ( child instanceof THREE.SkinnedMesh ) {
                var animation = new THREE.Animation( child, child.geometry.animation );

                animation.reset();

                if(self.data.loop) {
                    animation.loop = true;
                    animation.clampWhenFinished = false;
                }else{
                    animation.loop = false;
                    animation.clampWhenFinished = true;
                }
                animation.play();
            }
        });
    },

    stopAnim: function () {

        this.model.traverse( function ( child ) {
            if ( child instanceof THREE.SkinnedMesh ) {
                var animation = new THREE.Animation( child, child.geometry.animation );
                animation.stop();
            }
        });
    },

    tick: function (t, dt) {
        THREE.AnimationHandler.update( dt / 1000 );
    },

    schema: {
        autoplay: {type: 'boolean', default: true},
        loop: {type: 'boolean', default: true}
    },

    multiple: true
});