/* global AFRAME */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

/**
 * Preloader system for A-Frame.
 */
AFRAME.registerSystem('preloader', {
    schema: {
        target: { type: 'selector', default: '#preloader-modal'},
        progressValueAttr:  { type: 'string', default: 'aria-valuenow' },
        progressStyle: { type: 'string', default: 'width'},
        bar: { type: 'selector', default: '#preloader-modal .progress-bar'}, //html class of progress bar in preloader - used to set the width
        label: { type: 'selector', default: '#preloader-modal .progress-label'}, //html class of label in preloader - used to set the percentage
        labelText: { type: 'string', default: 'Loading {0}% Complete'}
    },

    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,

    loadedAssetCount: 0, //total number of assets loaded
    totalAssetCount: 0, //total number of assets to load

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function () {

        console.log('Initialized preloader');

        document.querySelector('a-assets').addEventListener('loaded',function(){
            console.log('All assets loaded');
        });

        var assetItems = document.querySelectorAll('a-asset-item[preload="auto"]');
        this.totalAssetCount = assetItems.length;

        for (var i = 0; i < assetItems.length; ++i) {
            assetItems[i].addEventListener('loaded',function(){
                this.loadedAssetCount++;
                console.log('Loaded '+this.loadedAssetCount+ '/'+assetItems.length+' asset items');
                this.onAssetLoaded();
            }.bind(this));
        }

        //TODO implement preloading sounds. These are currently broken
    },

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     */
    update: function (oldData) { },

    onAssetLoaded: function(){
        if(this.loadedAssetCount === this.totalAssetCount){
            this.drawProgress(100);
            this.el.emit('preloading-complete');
        }else{

            console.log(this.data.label);

            var percentage = this.loadedAssetCount/this.totalAssetCount*100;

            this.drawProgress(percentage);
        }
    },

    drawProgress: function(percentage){
        //update loading bar if exists
        if(this.data.label){
            this.data.label.innerHTML = this.data.labelText.format(percentage);
        }

        if(this.data.bar){
            this.data.bar.setAttribute(this.data.progressValueAttr,percentage);
            this.data.bar.setAttribute('style',this.data.progressStyle+':'+percentage+'%');
        }
    }
});