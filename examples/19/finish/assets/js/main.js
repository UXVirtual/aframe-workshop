AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.

    init: function () {

        var scene = document.querySelector('a-scene');

        // Make the grid of clickbait boxes
        for (var x=-5; x<=5; x++) {
            for (var y=-5; y<=5; y++) {
                var el = document.createElement('a-box');
                el.setAttribute('color', '#484');
                el.setAttribute('position', (x*4) + ' ' + (y*4) + ' ' + -(10));
                scene.appendChild(el);
                el.setAttribute('clickbait', '');
            }
        }

        var isGearVR = AFRAME.utils.device.isGearVR();
        var isOculusSamsungBrowser = navigator.userAgent.match(/OculusBrowser|SamsungBrowser/i);

        if (isGearVR || isOculusSamsungBrowser){
            console.log('Browsing in mobile mode on GearVR');
        }else{
            console.log('Browsing on desktop');
        }



    },

    tick: function (t, dt) {


    }
});


