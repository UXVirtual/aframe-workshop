AFRAME.registerComponent('selected', {
    init: function () {
        this.oldColor = this.el.getAttribute('material').color;
        this.el.setAttribute('material','color','#48F');
    },
    remove: function () {
        if (!this.oldColor) { return; }
        this.el.setAttribute('material', 'color', this.oldColor);
    }
});