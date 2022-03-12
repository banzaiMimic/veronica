# veronica-js
custom dev scaffolding for node and react

## call globally [vjs]
```
yarn
npm install -g .
```
will install globally and add any 'bin' commands to PATH from package
to make sure things are working `vjs --version` should print a version correctly

## node

### endpoint
```
vjs create endpoint
```
- [method] : http method i.e. get, post, put, delete, patch
- [action] : *optional action : will be placed in filename i.e. <method><action><entity>
- [entity] : core object usually mapping to mongo i.e. cart
- i.e. get | all | users

### hook up route / endpoint [after scaffold]
- find expressCallBack.js code below
```
const expressCallBack = require('./expressCallBack')
const userControllers = require('./users/controllers')
app.get('/users/get', expressCallBack(userControllers.getAllUsers))
```

### expressCallBack
currently you need this in order to create your route(s)
not sure if it's actually needed (?) ... might make a public lib with things 
like this later
```
// expressCallBack.js
const expressCallBack = controller => {
  return (req, res) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      method: req.method,
      path: req.path,
      res,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent')
      }
    }
    return controller(httpRequest)
      .then(httpResponse => {
        if (httpResponse) {
          res.set({ 'Content-Type': 'application/json' })
          return res.status(httpResponse.statusCode).send(httpResponse.data)
        }
      })
      .catch(e => {
        console.error(e.message)
        return res.status(500).send({ error: e.message })
      })
  }
}

module.exports = expressCallBack
```

### references
[Create Your Own Yeoman-Style Scaffolding Tool with Caporal.js](https://www.sitepoint.com/scaffolding-tool-caporal-js/)

### secret-code
```
(>'.')> <('.'<)
"that's your work self fusing with your leisure self" - a wise man 2022
```