AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        var box = document.createElement('a-entity')
        document.querySelector('a-scene').appendChild(box);
        box.setAttribute('width',1);
        box.setAttribute('height',1);
        box.setAttribute('depth',1);

        box.setAttribute('rotation','0 0 0');
        box.setAttribute('position','0 0.6 -4');
        box.setAttribute('custom-kinematic-body', 'height:0.5; radius: 0.5; enableSlopes: false;');

        box.setAttribute('entity-movement-controls-gamepad2','');

        var cactus = document.createElement('a-entity');
        cactus.setAttribute('rotation','90 0 0');
        cactus.setAttribute('position','0 -0.6 0');
        cactus.setAttribute('scale','0.1 0.1 0.1');
        cactus.setAttribute('collada-animation-mixer','autoplay: true; loop: false;');
        cactus.setAttribute('collada-model','src: url(assets/dae/cactus/cactus-walk.dae)');
        box.appendChild(cactus);

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

