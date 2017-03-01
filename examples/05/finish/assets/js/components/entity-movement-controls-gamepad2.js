//port of https://schteppe.github.io/cannon.js/examples/threejs_fps.html
AFRAME.registerComponent('entity-movement-controls-gamepad2', {
    init: function () {

        console.log('Initializing movement controls...')

        var self = this;

        this.velocityFactor = 0.2;
        this.rotationFactor = 0.002;
        this.jumpVelocity = 20;

        var thisObject3D = this.el.object3D;

        this.pitchObject = thisObject3D;
        this.yawObject = thisObject3D;

        this.quat = new THREE.Quaternion();

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.walking = false;
        this.rotating = false;

        var canJump = false;

        var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
        var upAxis = new CANNON.Vec3(0,1,0);

        this.thisEntity = this.el;
        this.thisEntityBody = this.el.body;

        this.thisEntity.addEventListener("collide",function(e){
            var contact = e.detail.contact;

            // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
            // We do not yet know which one is which! Let's check.
            if(contact.bi.id == self.thisEntityBody.id)  // bi is the player body, flip the contact normal
                contact.ni.negate(contactNormal);
            else
                contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

            // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
            if(contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
                canJump = true;
        });

        var onKeyDown = function ( event ) {

            switch ( event.keyCode ) {

                case 73: // i - up
                    self.moveForward = true;
                    self.walking = true;
                    break;

                case 74: // j - left
                    self.rotateLeft = true;
                    self.rotating = true;
                    break;

                case 75: // s - down
                    self.moveBackward = true;
                    self.walking = true;
                    break;

                case 76: // l - right
                    self.rotateRight = true;
                    self.rotating = true;
                    break;

                case 32: // space
                    if ( self.canJump === true ){
                        velocity.y = self.jumpVelocity;
                    }
                    self.walking = false;
                    self.canJump = false;
                    break;
            }

        };

        var onKeyUp = function ( event ) {

            switch( event.keyCode ) {

                case 73: // i - up
                    self.moveForward = false;
                    self.walking = false;
                    break;

                case 74: // j - left
                    self.rotateLeft = false;
                    self.rotating = false;
                    break;

                case 75: // s - down
                    self.moveBackward = false;
                    self.walking = false;
                    break;

                case 76: // l - right
                    self.rotateRight = false;
                    self.rotating = false;
                    break;

            }

        };

        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );

        this.thisEntity.isPlaying = false;

        // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
        this.inputVelocity = new THREE.Vector3();
        this.euler = new THREE.Euler();



    },

    tick: function (t, dt) {

        var delta = dt;

        if ( this.thisEntity.isPlaying === false ) return;

        //reset input velocity - important as this overrides any other physics applying to
        this.inputVelocity.set(0,this.thisEntityBody.velocity.y,0); //need to preserve this.thisEntityBody.velocity.y here so gravity continues to work as expected

        if ( this.moveForward ){
            this.inputVelocity.z = this.velocityFactor * delta;
        }
        if ( this.moveBackward ){
            this.inputVelocity.z = -this.velocityFactor * delta;
        }

        if ( this.rotateLeft ){
            this.yawObject.rotation.y += this.rotationFactor * delta;
        }
        if ( this.rotateRight ){
            this.yawObject.rotation.y -= this.rotationFactor * delta;
        }

        //example showing how to move object: https://github.com/schteppe/cannon.js/blob/master/demos/bodyTypes.html

        // Convert velocity to world coordinates

        this.euler.x = this.pitchObject.rotation.x;
        this.euler.y = this.yawObject.rotation.y;
        this.euler.order = "XYZ";
        this.quat.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quat);
        this.yawObject.position.copy(this.thisEntityBody.position);
        this.thisEntityBody.velocity.copy(this.inputVelocity);

        this.render(delta);
    },

    render: function(delta)
    {
        if(typeof this.thisEntity.children[0] !== 'undefined'){
            this.animationMixer = this.thisEntity.children[0].components['collada-animation-mixer'];

            if(typeof this.animationMixer !== 'undefined'){
                var animation = this.animationMixer.animation;

                if(typeof animation !== 'undefined' ){
                    if (this.walking || this.rotating) // exists / is loaded
                    {
                        animation.timeScale = delta * 0.1;
                        this.animationMixer.playAnim();
                    }else{
                        this.animationMixer.stopAnim();
                    }
                }
            }
        }


    },

    schema: {

    },

    multiple: false
});