AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        this.cactus = document.querySelector('a-entity#cactus');

        var self = this;

        this.cactus.addEventListener('model-loaded', function(e) {

            setTimeout(function(){
                self.cactus.components['collada-animation-mixer'].playAnim();
            },0);

        });

        $('#instructions-modal').modal();
    },
    tick: function () {

        //do stuff here every tick

        TWEEN.update();
    }
    // Other handlers and methods.
});