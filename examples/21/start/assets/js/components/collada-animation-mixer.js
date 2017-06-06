AFRAME.registerComponent('collada-animation-mixer', {
    init: function () {

        var data = this.data;

        var self = this;

        var animation;

        self.el.addEventListener('model-loaded', function(e) {

            self.model = e.detail.model;

            self.model.traverse( function ( child ) {
                if ( child instanceof THREE.SkinnedMesh ) {
                    self.animation = new THREE.Animation( child, child.geometry.animation );

                    self.animation.reset();

                    if(self.data.loop) {
                        self.animation.loop = true;
                        self.animation.clampWhenFinished = false;
                    }else{
                        self.animation.loop = false;
                        self.animation.clampWhenFinished = true;
                    }
                }
            });



            if(data.autoplay){
                self.playAnim();
            }



        });
    },

    playAnim: function () {
        this.animation.play();
    },

    stopAnim: function () {
        if(typeof(this.animation) !== 'undefined')
        this.animation.stop();
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