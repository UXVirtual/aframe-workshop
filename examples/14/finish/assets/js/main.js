
// Define custom schema for syncing avatar color, set by random-color
var avatarSchema = {
    template: '#avatar-template',
    components: [
        'position',
        'rotation',
        {
            selector: '.head',
            component: 'material'
        }
    ]
};
NAF.schemas.add(avatarSchema);

function randomPointOnCircle(radius, angleRad) {
    x = Math.cos(angleRad)*radius;
    y = Math.sin(angleRad)*radius;
    return {x: x, y: y};
}

// Called by Networked-Aframe when connected to server
function onConnect(e) {

    console.log('Client connected.',e );

    // Get random angle
    var angleRad = Math.random()*Math.PI*2;

    // Get position around a circle
    var position = randomPointOnCircle(3, angleRad);
    var positionStr = position.x + ' 1.3 ' + position.y;

    // Get rotation towards center of circle
    var angleDeg = angleRad * 180 / Math.PI;
    var angleToCenter = -1 * angleDeg + 90;
    var rotationStr = '0 ' + angleToCenter + ' 0';

    // Create avatar with this position and rotation
    console.log('Creating avatar...');
    NAF.entities.createAvatar('#avatar-template', positionStr, rotationStr);

    NAF.connection.isConnected();
}

AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        var self = this;

        function checkConnected() {
            return new Promise(function (resolve, reject) {
                (function waitForConnection(){
                    console.log('Waiting for connection...');
                    if (NAF.connection.isConnected()) return resolve();
                    setTimeout(waitForConnection, 500);
                })();
            });
        }

        checkConnected(function(){
            console.log('Connected to server. Can begin') ;
            self.beginNetwork();
        },function(e){
            console.log('An error ocurred',e);
        });

        var scene = document.querySelector('a-scene');

        scene.addEventListener('loaded',function(){


            // On mobile remove elements that are resource heavy
            var isMobile = AFRAME.utils.device.isMobile();
            if (isMobile) {
                var $particles = $('#particles');
                $particles.remove();
            }else{
                //fuse only works on mobile as desktop supports click events
                var cursor = document.querySelector('#cursor');
                console.log(cursor);
                cursor.setAttribute('cursor', 'fuse', false);
            }
        });


    },

    beginNetwork: function() {
        console.log('Beginning network functionality...');
    },

    tick: function (t, dt) {


    }
    // Other handlers and methods.
});

