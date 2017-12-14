AFRAME.registerSystem('main', {
  schema: {
            total:  {type: 'int', default: 500},
            mergeEnabled: {type: 'boolean', default: true}
  },  // System schema. Parses into `this.data`.

  childCount: 0,

  init: function () {
    // Called on scene initialization.
    //do stuff here after scene initializes

    //wait for scene to be loaded before accessing objects
    this.el.addEventListener('loaded',function(){
      console.log('Loaded');

      var col = 0,
          row = 0,
          marginX = 6,
          marginZ = 4,
          maxCols = 10,
          originX = -4.5,
          originZ = -10;

      this.mainEl = document.createElement('a-entity');
      this.mainEl.setAttribute('material', 'color: #AAA');
      this.mainEl.setAttribute('position', originX +' 0 '+ originZ);
      this.mainEl.setAttribute('scale', '0.1 0.1 0.1');

      if (this.data.mergeEnabled) {
        this.mainEl.addEventListener('child-attached', this.onChildAttached.bind(this));
      }

      this.el.appendChild(this.mainEl);

      for (var i = 0; i < this.data.total; i++) {
        //var wrapperEl = document.createElement('a-entity');
        //wrapperEl.setAttribute('position', (col * marginX) +' 0 '+ (row * marginZ));

        var boxEl = document.createElement('a-entity');
        boxEl.setAttribute('geometry', 'primitive: box; buffer: false');
        boxEl.setAttribute('position', -1+(col * marginX)+ " 0.5 " + (-2 + (row * marginZ)));
        this.mainEl.appendChild(boxEl);

        var sphereEl = document.createElement('a-entity');
        sphereEl.setAttribute('geometry', 'primitive: sphere; buffer: false');
        sphereEl.setAttribute('position', 0 + (col * marginX) + " 0.5 " + (-2 + (row * marginZ)));
        this.mainEl.appendChild(sphereEl);

        var cylinderEl = document.createElement('a-entity');
        cylinderEl.setAttribute('geometry', 'primitive: cylinder; buffer: false');
        cylinderEl.setAttribute('position', 1 + (col * marginX) + " 0.5 " + (-2 + (row * marginZ)));
        cylinderEl.setAttribute('scale', "0.5 0.5 0.5");
        this.mainEl.appendChild(cylinderEl);

        this.childCount += 3;

        if (col > maxCols-2) {
          row++;
          col = 0;
        } else {
          col++;
        }
      }

    }.bind(this));
  },

  onChildAttached: function (e) {
    console.log('Child attached: ',e);
    //once all children are attached, add geometry-merger component
    //console.log(this.mainEl)

    var total = this.data.total * 3;

    //console.log(this.mainEl.children.length + '/' + total)
    if(this.mainEl.children.length === total) {
      //console.log('Added geometry merger');
      setTimeout(function(){
        this.mainEl.setAttribute('geometry-merger', 'preserveOriginal: false');
      }.bind(this),0);

    }
  }
});

