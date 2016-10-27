(function () {

  'use strict';

  var defaultConf = {
      mediaSelector: ".media-context",
      backgroundSelector: ".media-context-background",
      backgroundContext: {
        folder: {
          path: null,
          pattern: null
        },
        manual: {}
      },
      metadataSelector: ".media-context-metadata",
      metadataContext: {
        json: {
          path: null
        },
        manual: []
      }
  };

  var merge = function(obj1, obj2){
    var obj3 = {};
    for (var attrn in obj1) { obj3[attrn] = obj1[attrn]; }
    for (var attrnm in obj2) { obj3[attrnm] = obj2[attrnm]; }
    return obj3;
  }; // Function to merge two objects

  function MediaContext(opts) {
    var conf = merge(defaultConf, opts || {});
    this.init(conf);
  }

  MediaContext.prototype = {
    backgroundElement: null,
    mediaElement: null,
    metadatablockElement: null,
    events: {
      background: [],
      metadata: []
    },
    settings: null,

    imageExists: function(url, callback) {
        var img = new Image();
        img.onload = function() { callback(true); };
        img.onerror = function() { callback(false); };
        img.src = url;
    },

    loadJSON: function(url, callback) {
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', url, true);
      xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          callback(xobj.responseText);
        }
      };
      xobj.send(null);
    },

    init: function(opts){
      this.settings = opts;
      this.mediaElement = document.querySelector(opts.mediaSelector);
      this.backgroundElement = document.querySelector(opts.backgroundSelector);
      this.metadatablockElement = document.querySelector(opts.metadataSelector);
      if(this.mediaElement){
        this.mediaElement.addEventListener("canplay", function(){
            this.prepareBackground(function(){
                this.prepareMetadata(function(){
                  this.prepareMedia();
                }.bind(this));
            }.bind(this));
        }.bind(this));
      }
    },

    prepareBackground: function(callback){
      if(!this.backgroundElement){
        callback();
      }

      var doManual = function(){
        if(this.settings.backgroundContext.manual && this.settings.backgroundContext.manual.length){
          this.settings.backgroundContext.manual.forEach(function(e){
            this.imageExists(e.src, function(exists) {
              if(exists){
                this.events.background[e.time] = "url('" + e.src + "')";
              }
            }.bind(this));
          }.bind(this));
        }
        callback();
      }.bind(this);

      var recurs = function(i){
        if(i <= this.mediaElement.duration) {
          var src = this.settings.backgroundContext.folder.path + this.settings.backgroundContext.folder.pattern.replace("%", i);
          return this.imageExists(src, function(exists) {
            if(exists){
              this.events.background[i] = "url('" + src + "')";
            }
            recurs(i + 1);
          }.bind(this));
        } else {
          doManual();
        }
      }.bind(this);

      if(this.settings.backgroundContext.folder && this.settings.backgroundContext.folder.path && Object.keys(this.settings.backgroundContext.folder).length === 2){
        recurs(0);
      } else {
        doManual();
      }
    },

    prepareMetadata: function(callback){
      if(!this.metadatablockElement){
        callback();
      }
      if(this.settings.metadataContext.manual && this.settings.metadataContext.manual.length){
        this.settings.metadataContext.manual.forEach(function(e){
          if(typeof e.time !== 'undefined'){
            this.events.metadata[e.time] = e.content;
          }
        }.bind(this));
      }
      if(this.settings.metadataContext.json && this.settings.metadataContext.json.path){
        this.loadJSON(this.settings.metadataContext.json.path, function(response) {
          var obj_JSON = JSON.parse(response);
          obj_JSON.forEach(function(e){
            if(typeof e.time !== 'undefined'){
              this.events.metadata[e.time] = { html: e.content, duration: e.duration };
            }
          }.bind(this));
          callback();
        }.bind(this));
      } else {
        callback();
      }
    },

    prepareMedia: function(){
      this.mediaElement.addEventListener("timeupdate", function(){
        var t = Math.round(this.mediaElement.currentTime);
        var bgCss = this.events.background[t];
        if(bgCss){
          this.backgroundElement.style.backgroundImage = bgCss;
        }
        var metadata = this.events.metadata[t];
        if(metadata){
          this.metadatablockElement.style.opacity = 0;
          this.metadatablockElement.innerHTML = metadata.html;
          this.metadatablockElement.style.opacity = 1;
          if(metadata.duration){
            setTimeout(function(){
              this.metadatablockElement.style.opacity = 0;
            }.bind(this), metadata.duration * 1000);
          }
        }
      }.bind(this));
    }
  }

  var MediaContextClass = function(opts){
    return new MediaContext(opts);
  };

  //RequireJS Style
  if (typeof define === "function" && define.amd) {
    define("MediaContext", [], function() {
      return MediaContextClass;
    });
  }

  self.MediaContext = MediaContextClass;
  return MediaContextClass;

}());
