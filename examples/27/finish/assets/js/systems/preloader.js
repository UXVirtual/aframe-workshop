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
 * Visual preloader system for A-Frame.
 *
 * When applied to the <scene> will automatically display a preloader modal that reflects the current loading progress
 * of resources in <a-assets> that have been flagged for preloading and will auto-close the modal when it reaches 100%.
 * Alternately, the modal can be manually closed
 *
 * Emits a 'preloading-complete' event when done.
 */
AFRAME.registerSystem('preloader', {
    schema: {
        type: { type: 'string', default: 'bootstrap' }, //acceptable values are: 'bootstrap' or 'custom'
        autoInject: { type: 'boolean', default: true }, //whether or not to auto-inject the preloader html into the page
        target: { type: 'selector', default: '#preloader-modal'}, //the html target selector
        progressValueAttr:  { type: 'string', default: 'aria-valuenow' },//an attribute of the progress bar to set when progress is updated
        barProgressStyle: { type: 'string', default: 'width'}, //target css style to set as a percentage on the bar
        bar: { type: 'selector', default: '#preloader-modal .progress-bar'}, //html class of progress bar in preloader - used to set the width
        label: { type: 'selector', default: '#preloader-modal .progress-label'}, //html class of label in preloader - used to set the percentage
        labelText: { type: 'string', default: '{0}% Complete'}, //loading text format {0} will be replaced with the percent progress e.g. 30%
        autoClose: { type: 'boolean', default: true}, //automatically close preloader by default - not supported if clickToClose is set to 'true'
        clickToClose: { type: 'boolean', default: true}, //whether the user must click a button to close the modal when preloading is finished
        closeLabelText: { type: 'string', default: 'Continue'}, //default label text of click to close button
        title: { type: 'string', default: ''} //title of preloader modal
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

        if(this.data.type === 'bootstrap' && typeof $ === 'undefined'){
            console.error('jQuery is not present, cannot instantiate Bootstrap modal for preloader!');
        }

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

        if(!this.data.target && this.data.autoInject){
            console.log('No preloader html found, auto-injecting');

            this.injectHTML();
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

            if(this.data.autoClose && !this.data.clickToClose){
                this.triggerPreloadingComplete();
                this.closeModal();
            }else{
                if(this.data.clickToClose){
                    this.closeBtn.setAttribute('style','display: inline-block');
                }
            }
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
            this.data.bar.setAttribute('style',this.data.barProgressStyle+':'+percentage+'%');
        }
    },

    injectHTML: function(){

        console.log('Injecting html...');

        switch(this.data.type){
            case 'bootstrap':
                this.injectBootstrapModal();
                break;
            default:
                //do nothing
                break;
        }
    },

    injectBootstrapModal: function(){

        if(!this.data.title){
            //full screen modal
            var $modal = $('' +
                '<div id="preloader-modal" class="modal instructions-modal" tabindex="-1" role="dialog">'+
                    '<div class="modal-dialog modal-dialog__full" role="document">'+
                        '<div class="modal-content vertical-align text-center">'+
                            '<div class="col-md-6 col-md-offset-3">'+
                                '<div class="progress">'+
                                    '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'+
                                        '<span class="progress-label">Loading 0% Complete</span>'+
                                    '</div>'+
                                '</div>'+
                                ((this.data.clickToClose) ? '<button type="button" class="close-btn btn btn-default" data-dismiss="modal" style="display: none;">Continue</button>' : '' )+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '</div>'+
                '');

            var $modalStyle = $('<style>' +
                '.vertical-align {'+
                    'display: flex;'+
                    'align-items: center;'+
                '}'+
                '.modal-dialog__full {'+
                    'width: 100%;'+
                    'height: 100%;'+
                    'margin: 0;'+
                    'padding: 0;'+
                '}'+
                '.modal-dialog__full .modal-content {'+
                    'height: auto;'+
                    'min-height: 100%;'+
                    'border-radius: 0;'+
                '}' +
                '</style>');
            $('head').append($modalStyle);
        }else{
            //regular modal
            var $modal = $('' +
                '<div id="preloader-modal" class="modal instructions-modal" tabindex="-1" role="dialog">'+
                    '<div class="modal-dialog modal-dialog__full" role="document">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header">'+
                                '<h4 class="modal-title">'+this.data.title+'</h4>'+
                            '</div>'+
                            '<div class="modal-body">' +
                                '<div class="col-md-6 col-md-offset-3">'+
                                    '<div class="progress">'+
                                        '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'+
                                            '<span class="progress-label">Loading 0% Complete</span>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="modal-footer">'+
                                ((this.data.clickToClose) ? '<button type="button" class="close-btn btn btn-default" data-dismiss="modal" style="display: none;">Continue</button>' : '' )+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '');
        }

        $modal.modal({
            backdrop: 'static',
            keyboard: false
        });

        $('body').append($modal);



        this.data.target = $modal[0];
        this.data.label = $modal.find('.progress-label')[0];
        this.data.bar = $modal.find('.progress-bar')[0];
        var $closeBtn = $modal.find('[data-dismiss=modal]');

        if($closeBtn){
            this.closeBtn = $closeBtn[0];
            $modal.on('hidden.bs.modal', function (e) {
                this.triggerPreloadingComplete();
            }.bind(this))
        }
    },

    triggerPreloadingComplete: function(){
        this.el.emit('preloading-complete');
    },

    closeModal: function(){
        switch(this.data.type){
            case 'bootstrap':
                $(this.data.target).modal('hide');
                break;
            default:
                //do nothing
                break;
        }
    }
});