AFRAME.registerComponent('collada-animation-mixer', {
    init: function () {
        this.el.addEventListener('model-loaded', function(e) {
            e.detail.model.traverse( function ( child ) {
                if ( child instanceof THREE.SkinnedMesh ) {
                    var animation = new THREE.Animation( child, child.geometry.animation );
                    animation.play();
                }
            });
        });
    },

    tick: function (t, dt) {
        THREE.AnimationHandler.update( dt / 1000 );
    }
});