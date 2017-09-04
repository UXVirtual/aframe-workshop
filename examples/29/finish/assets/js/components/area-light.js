/**
 * A-Frame Wrapper for THREE.JS RectAreaLight
 * @author Mo Kargas (DEVLAD) mo@devlad.com
 */

/* global AFRAME */
/* global THREE */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

if (typeof THREE === 'undefined') {
    throw new Error('Component attempted to register before THREE was available.')
}

AFRAME.registerComponent('area-light', {
    schema: {
        intensity:{
            type: 'number',
            default: 1.0
        },
        color: {
            type: 'color',
            default: '#FFFFFF'
        },
        width:{
            type:'number',
            default: 2
        },
        height:{
            type: 'number',
            default: 2
        },
        showHelper:{
            type: 'boolean',
            default: true
        }
    },

    init: function(){

        const rectLight = new THREE.RectAreaLight( this.data.color, this.data.intensity, this.data.width, this.data.height )
        rectLight.position.set(this.data.width/2, 0, 0)
        this.el.object3D.add(rectLight)


        if(this.data.showHelper){
            const rectLightHelper = new THREE.RectAreaLightHelper( rectLight )
            rectLightHelper.position.set(this.data.width/2, 0, 0)
            this.el.object3D.add(rectLightHelper)
        }

    },
});