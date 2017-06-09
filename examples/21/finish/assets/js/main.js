AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        var scene = document.querySelector('a-scene');

        scene.addEventListener('loaded',function(){

            var cursor = document.querySelector('#cursor');

            // On mobile remove elements that are resource heavy
            var isMobile = AFRAME.utils.device.isMobile();
            var isGearVR = AFRAME.utils.device.isGearVR();
            if (!isMobile && !isGearVR) {
                //fuse only works on mobile as desktop supports click events
                cursor.setAttribute('cursor', 'fuse', false);
            }

        }.bind(this));
    },



    tick: function (t, dt) {
        //console.log(self.camera.getAttribute('position'));

    }
    // Other handlers and methods.
});

