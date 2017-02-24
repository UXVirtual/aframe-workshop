AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes


        $('#instructions-modal').modal();
    },
    tick: function () {

        //do stuff here every tick

        TWEEN.update();
    }
    // Other handlers and methods.
});