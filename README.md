# elog

ERS elog middleware

## Installation

```sh
$ npm i --save ersinfotech/elog
```

## API

```js
var express = require('express');
var Elog = require('elog');

var app = express();
var elog = Elog({baseUrl: 'http://logUrl'});

app.get(log('some name'), function(req, res, next){
    res.end();
});
```

## License

MIT