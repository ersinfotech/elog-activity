# elog-activity

ERS elog activity middleware

## Installation

```sh
$ npm i --save ersinfotech/elog-activity
```

## API

```js
var express = require('express');
var elogActivity = require('elog-activity');

var app = express();
var log = elogActivity({baseUrl: 'http://logUrl'});

app.get(log('type name'), function(req, res, next){
    res.end();
});
```

## License

MIT