AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        this.lastInspectorState = 'closed';

        var self = this;

        var camera = document.querySelector('#camera');

        var sceneEl = document.querySelector('a-scene');

        var modelEl = document.querySelector('#model');

        var rotating = false;

        camera.addEventListener('click',function(e){

            var targetEl = e.detail.target;

            var targetElClass = targetEl.getAttribute('class');

            if(targetElClass === 'hotspot'){

                if(!rotating){

                }
            }
        });

    },

    tick: function (t, dt) {


    }
});

