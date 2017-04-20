AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        this.$modal = $('#hotspot-modal');
        this.$originalModal = this.$modal.clone();
        this.lastInspectorState = 'closed';

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
            show: false,
            backdrop: false
        });

        setInterval(this.onInspector,1000);
    },

    tick: function (t, dt) {


    },
    // Other handlers and methods.

    onInspector: function() {
        if(AFRAME.INSPECTOR && AFRAME.INSPECTOR.opened){
            if(this.lastInspectorState !== 'opened'){
                this.$modal.remove();
                this.lastInspectorState = 'opened';
            }

        }else{
            if(this.lastInspectorState !== 'closed'){

                var $body = $('body');

                if($body.length > 0) {

                    //$('head style').remove();
                    var hs = document.querySelectorAll('style');
                    for (var i = 0, max = hs.length; i < max - 1; i++) {
                        hs[i].parentNode.removeChild(hs[i]);
                    }
                    $body.append(this.$originalModal);
                    this.$modal = $('#hotspot-modal');
                    this.lastInspectorState = 'closed';
                }
            }

        }
    }
});

