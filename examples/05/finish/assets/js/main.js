AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        var box = document.createElement('a-box')
        document.querySelector('a-scene').appendChild(box);
        box.setAttribute('width',10);
        box.setAttribute('height',10);
        box.setAttribute('depth',10);
        box.setAttribute('scale','0.1 0.1 0.1');
        box.setAttribute('rotation','90 0 0');
        box.setAttribute('position','0 0.5 -4');
        box.setAttribute('kinematic-body', '');
        box.setAttribute('collada-animation-mixer','autoplay: false; loop: false;');
        box.setAttribute('collada-model','src: url(assets/dae/cactus/cactus-walk.dae)');
        box.setAttribute('entity-movement-controls-gamepad2','');

        console.log('Components: ',box.components);

        document.querySelector('a-scene').addEventListener('render-target-loaded', function () {

            //see https://github.com/donmccurdy/aframe-physics-system/issues/6#issuecomment-257596345





            /*box.addEventListener('model-loaded', function(e) {
                console.log('Model loaded');
                setTimeout(function(){
                    console.log('Adding controls...');

                },1000)


            });*/
        });





        //$('#instructions-modal').modal();
    },

    tick: function (t, dt) {


    }
    // Other handlers and methods.
});

