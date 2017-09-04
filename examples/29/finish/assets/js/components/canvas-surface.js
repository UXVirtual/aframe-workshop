/**
 * noise component example
 */
AFRAME.registerComponent('canvas-surface', {
    dependencies: [ ],
    schema: { },
    init: function() {
        this.el.addEventListener('draw-render', this.render.bind(this))
        this.origCanvasEl = document.querySelector('#fullscreen');
        this.ctx2 = this.origCanvasEl.getContext("2d");
        this.idata = null;
        this.ctx = null;
    },
    update: function() { },
    remove: function() { },
    pause: function() { },
    play: function() { },
    render: function(e) {
        this.ctx = e.detail.ctx;
            var texture = e.detail.texture;
            var w = this.ctx.canvas.width;
            var h = this.ctx.canvas.height;
            //buffer32 = new Uint32Array(idata.data.buffer),
            //len = buffer32.length,
            //i = 0;
        //for(; i < len;)
            //buffer32[i++] = ((255 * Math.random())|0) << 24


        this.idata = this.ctx2.getImageData(0, 0, w, h);

        this.ctx.putImageData(this.idata, 0, 0);
        // texture upate
        texture.needsUpdate = true
    }
});