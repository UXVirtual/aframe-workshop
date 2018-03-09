AFRAME.registerComponent('pbr-skybox', {

  schema: {
    path: {type: 'string', required: true},
    format: {type: 'string', default: '.jpg'},
    crossorigin: { type: 'string', default: '' },
    entities: {type: 'array', default: []},
    setSkybox: {type: 'boolean', default: true}
  },

  init: function () {

    this.el.addEventListener('loaded',function(){
      this.updateEnvironment();
    }.bind(this))
  },

  convertToAbsoluteURL: function(base, relative) {
    var stack = base.split("/"),
      parts = relative.split("/");
    stack.pop();
    for (var i=0; i<parts.length; i++) {
      if (parts[i] == ".")
        continue;
      if (parts[i] == "..")
        stack.pop();
      else
        stack.push(parts[i]);
    }
    return stack.join("/");
  },

  updateEnvironment: function() {
    var pattern = /^((http|https|ftp):\/\/)/;
    var path;

    if(!pattern.test(this.data.src)) {
      path = this.convertToAbsoluteURL(document.baseURI,this.data.path);
    }else{
      path = this.data.src;
    }
    var format = this.data.format;

    var envMap = null;
    if (path) {

      var loader = new THREE.CubeTextureLoader()
      if (this.data.crossorigin) loader.setCrossOrigin(this.data.crossorigin);

      envMap = loader.load([
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
      ]);
      envMap.format = THREE.RGBFormat;
    }

    for(var i = 0; i < this.data.entities.length; i++) {

      var entity = document.querySelector(this.data.entities[i]);

      console.log('Entity: ',entity)

      entity.addEventListener('model-loaded', function (event) {
        console.log('Model loaded')
        event.target.object3D.traverse(function (node) {
          if (node.material && 'envMap' in node.material) {
            node.material.envMap = envMap;
            node.material.needsUpdate = true;
            console.log('Updated envmap')
          }
        });
      });

      entity.addEventListener('model-error', function (event) {
          console.log('There was a problem loading the model',event)
      });
    }

    if(this.data.setSkybox){
      this.el.object3D.background = envMap
    }
  }
});