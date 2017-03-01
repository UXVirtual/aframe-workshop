//port of https://stemkoski.github.io/Three.js/Model-Animation-Control.html
AFRAME.registerComponent('entity-movement-controls-gamepad', {
    init: function () {

        var data = this.data;

        this.keyboard = new THREEx.KeyboardState();

        console.log('Keyboard: ',this.keyboard);

        this.object3D = this.el.object3D;
        this.object3DChild = this.object3D.children[0];

        // the following code is from
        // http://catchvar.com/threejs-animating-blender-models
        this.animOffset       = 0,   // starting frame of animation
        this.walking         = false,
        this.duration        = 8333, // milliseconds to complete animation
        this.keyframes       = 250,   // total number of animation frames
        this.interpolation   = this.duration / this.keyframes, // milliseconds per frame
        this.lastKeyframe    = 0,    // previous keyframe
        this.currentKeyframe = 0;



        //EVENTS

        console.log('Initialized movement controls');

    },




    tick: function (t, dt) {

        // delta = change in time since last call (seconds)
        var delta = dt/1000;

        var moveDistance = 1 * delta;
        this.walking = false;

        if (Gamepad.supported)
        {
            var pads = Gamepad.getStates();
            var pad = pads[0]; // assume only 1 player.
            if (pad)
            {

                // adjust for deadzone.
                if (Math.abs(pad.leftStickX + pad.rightStickX) > 0.3)
                {
                    this.object3D.rotation.y -= delta * (pad.leftStickX + pad.rightStickX);
                    this.walking = true;
                }
                if (Math.abs(pad.leftStickY + pad.rightStickY) > 0.2)
                {
                    this.object3D.translateZ( -moveDistance * (pad.leftStickY + pad.rightStickY) );
                    this.walking = true;
                }
                if ( pad.faceButton0 || pad.faceButton1 || pad.faceButton2 || pad.faceButton3 || pad.select || pad.start )
                {
                    this.object3D.position.set(0,0,0);
                    this.object3D.rotation.set(0,0,0);
                }

            }
        }

        // move forwards / backwards
        if ( this.keyboard.pressed("k") )
            //console.log('down');
        this.object3D.translateZ( -moveDistance );
        if ( this.keyboard.pressed("i") )
            //console.log('up');
        this.object3D.translateZ(  moveDistance );
        // rotate left/right
        if ( this.keyboard.pressed("j") )
            //console.log('left');
        this.object3D.rotation.y -= delta;
        if ( this.keyboard.pressed("l") )
            //console.log('right');
        this.object3D.rotation.y += delta;


        var walkingKeys = ["i", "k", "j", "l"];
        for (var i = 0; i < walkingKeys.length; i++)
        {
            if ( this.keyboard.pressed(walkingKeys[i]) )
                this.walking = true;
        }
        this.render(delta);
    },

    render: function(delta)
    {
       // console.log('Walking: ',this.walking);

        this.animationMixer = this.object3DChild.el.components['collada-animation-mixer'];

        var animation = this.animationMixer.animation;

        if ( this.object3DChild && this.walking ) // exists / is loaded
        {

            animation.timeScale = delta * 100;

            if(!animation.isPlaying){
                animation.play();
            }

        }else if(this.object3DChild && !this.walking) {

            this.animationMixer.stopAnim();
        }
    },

    schema: {
        animatableEntityID: {type: 'string'} //ID of animatable entity to animate (don't include the hash before the ID)
    },

    multiple: true
});