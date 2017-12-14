AFRAME.registerSystem('main', {
  schema: {},  // System schema. Parses into `this.data`.

  init: function () {
    // Called on scene initialization.
    //do stuff here after scene initializes

    //wait for scene to be loaded before accessing objects
    this.el.addEventListener('loaded',function(){
      console.log('Loaded')
    });
  }
});

