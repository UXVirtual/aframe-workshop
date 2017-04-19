AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        this.$modal = $('#hotspot-modal');

        var self = this;

        var camera = document.querySelector('#camera');

        camera.addEventListener('click',function(e){

            var targetEl = e.detail.target;

            var targetElClass = targetEl.getAttribute('class');

            if(targetElClass === 'hotspot'){
                console.log(targetEl);

                console.log('Clicked hotspot');

                self.$modal.modal('show');
            }


        });

        this.$modal.modal({
            show: false
        });
    },

    tick: function (t, dt) {


    }
    // Other handlers and methods.
});

