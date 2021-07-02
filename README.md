# veronica-js
custom dev scaffolding for node and react

## call globally [vjs]
```
yarn
yarn link
```

## node

### endpoint
```
vjs create endpoint
```
- [method] : http method i.e. get, post, put, delete, patch
- [action] : *optional action : will be placed in filename i.e. <method><action><entity>
- [entity] : core object usually mapping to mongo i.e. cart

### references
[Create Your Own Yeoman-Style Scaffolding Tool with Caporal.js](https://www.sitepoint.com/scaffolding-tool-caporal-js/)