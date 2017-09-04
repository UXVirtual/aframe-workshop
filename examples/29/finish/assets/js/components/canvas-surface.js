/**
 * noise component example
 */
AFRAME.registerComponent('canvas-surface', {
    dependencies: [ ],
    schema: { },
    init: function() {
        this.el.addEventListener('draw-render', this.render.bind(this))
        this.idata = null;
        this.ctx = null;

        console.log('Canvas el: ',this.origCanvasEl);

        this.origCanvasEl = document.querySelector('#fullscreen');
        this.ctx2 = this.origCanvasEl.getContext("2d");

    },
    update: function() { },
    remove: function() { },
    pause: function() { },
    play: function() { },
    render: function(e) {


        //


        //console.log('2d context: ',this.ctx2);

        if(this.ctx2){
            this.ctx = e.detail.ctx;
            var texture = e.detail.texture;
            var w = this.ctx.canvas.width;
            var h = this.ctx.canvas.height;

            this.idata = this.ctx2.getImageData(0, 0, w, h);

            this.ctx.putImageData(this.idata, 0, 0);
            // texture upate
            texture.needsUpdate = true;
        }


    }
});