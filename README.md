# mediacontext.js
MediaContext.js - Add Dynamic contextual backgrounds and elements to your HTML5 Video/Audio players.

# Summary
MediaContext.js Library is written in Pure Javascript, it allows you to change background or an element based on the time of an HTML5 audio/video element. You also have the possibility to change a element to add some metadata information ... check the demo at https://glinford.github.io/mediacontext.js/

The library is built to be simple to use and light (3kb minimized)

#Installation
```shell
## NPM

npm install mediacontext

## Bower

bower install mediacontext

## Git
git clone https://github.com/glinford/mediacontext.js
```

# Demo
https://glinford.github.io/mediacontext.js/

# Usage/Example
```html

<script type="text/javascript" src="your/path/mediacontext.js"></script>

```

```javascript
MediaContext({

  mediaSelector: ".media-context", // Query Selector of video/audio HTML5 element

  backgroundSelector: ".media-context-background", // Query Selector of background element you want to dynamically change

  backgroundContext: {
    json: {
      path: "context/background.json" //load a JSON file with format like context/background.json file
    },
    manual: [ //enter manuallly your configuration, if time is also in the json file, the manual overrides it
      { src: "backgrounds/bg-46.jpg", time: 46 },
      { src: "backgrounds/bg-52.jpg", time: 52 }
    ]
  },

  metadataSelector: ".media-context-metadata", // Query Selector of element you wish to load dynamically
  
  metadataContext: {
    json: {
      path: "context/metadata.json" // load a json with format like context/metadata.json
    },
    manual: [] //Same than background you can override your json here
  }
});
```

# Information
Feel free to PR / Fork / Star

# License
MIT
