AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.

    init: function () {

        var sceneEl = document.querySelector('a-scene');


        sceneEl.addEventListener('loaded',function(){



        });

        sceneEl.addEventListener('renderstart',function(){

            console.log('Ready');

        }.bind(this));



    },

    tick: function (t, dt) {


    }
});


