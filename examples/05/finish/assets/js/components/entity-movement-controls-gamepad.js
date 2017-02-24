//port of https://stemkoski.github.io/Three.js/Model-Animation-Control.html
AFRAME.registerComponent('entity-movement-controls-gamepad', {
    init: function () {

        var data = this.data;

        this.keyboard = new THREEx.KeyboardState();

        console.log('Keyboard: ',this.keyboard);

        this.object3D = this.el.object3D;
        this.object3DChild = document.querySelector('#'+this.data.animatableEntityID).object3D;

        // the following code is from
        // http://catchvar.com/threejs-animating-blender-models
        this.animOffset       = 0,   // starting frame of animation
        this.walking         = false,
        this.duration        = 8333, // milliseconds to complete animation
        this.keyframes       = 250,   // total number of animation frames
        this.interpolation   = this.duration / this.keyframes, // milliseconds per frame
        this.lastKeyframe    = 0,    // previous keyframe
        this.currentKeyframe = 0;
        this.velocityFactor = 0.6;

        this.quat = new THREE.Quaternion();
        this.velocity = null;

        this.inputVelocity = new THREE.Vector3();
        this.euler = new THREE.Euler();

        this.defaultXRot = this.el.getAttribute('rotation').x;



        //EVENTS

        console.log('Initialized movement controls');

        this.object3D.addEventListener('collide', function (e) {
            console.log('Character has collided with body #' + e.detail.body.id);

            console.log(e.detail.target.el);  // Original entity (playerEl).
            console.log(e.detail.body.el);    // Other entity, which playerEl touched.
            console.log(e.detail.contact);    // Stats about the collision (CANNON.ContactEquation).
            console.log(e.detail.contact.ni); // Normal (direction) of the collision (CANNON.Vec3).
        });

    },




    tick: function (t, dt) {

        // delta = change in time since last call (seconds)
        var delta = dt/1000;

        this.velocity = this.el.body.velocity;

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

        var pos = this.el.getAttribute('position');
        var rot = this.el.getAttribute('rotation');

        var velocity = this.el.body.velocity;

        var rotationQuaternion;

        this.inputVelocity.set(0,0,0);

        // move forwards / backwards
        if ( this.keyboard.pressed("k") ){
            //console.log('down');
            //pos.z-=moveDistance;
            //this.el.body.position = new CANNON.Vec3().copy(pos);
            //this.object3D.position.z -= moveDistance;
            this.inputVelocity.z = -this.velocityFactor * (dt * 0.01);
        }


        if ( this.keyboard.pressed("i") ) {
            //console.log('up');
            //pos.z += moveDistance;
            //this.el.body.position = new CANNON.Vec3().copy(pos);
            //this.object3D.position.z += moveDistance;
            // rotate left/right
            this.inputVelocity.z = +this.velocityFactor * (dt * 0.01);
        }
        if ( this.keyboard.pressed("j") ) {
            //console.log('left');
            rot.y += delta;
            //console.log(this.el.body);
            //console.log(this.el.body.quaternion);
            //console.log(rot);

            rotationQuaternion = new CANNON.Quaternion();
            rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1), rot.y);
            this.el.body.quaternion = this.el.body.quaternion.mult(rotationQuaternion);

            //this.el.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),this.defaultXRot); //fix the model because it's upside down
           // this.el.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),90);
            //this.el.body.rotation.y+=delta;
            //this.object3D.rotation.y += delta;
        }
        if ( this.keyboard.pressed("l") ) {
            //console.log('right');
            rot.y -= delta;

            rotationQuaternion = new CANNON.Quaternion();
            rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1), rot.y);
            this.el.body.quaternion = this.el.body.quaternion.mult(rotationQuaternion);

            //this.el.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),this.defaultXRot); //fix the model because it's upside down
            //this.el.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),-90);
            //this.el.body.rotation.y-=delta;
            //this.object3D.rotation.y -= delta;
        }

        // Convert velocity to world coordinates
        this.euler.x = rot.x;
        this.euler.y = rot.y;
        this.euler.order = "XYZ";
        this.quat.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quat);
        //this.quat.multiplyVector3(this.inputVelocity);

        // Add to the object
        this.velocity.x += this.inputVelocity.x;
        this.velocity.z += this.inputVelocity.z;

        //this.el.body.position = new CANNON.Vec3().copy(pos);

        //this.el.body.position.copy(this.el.body.position);

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