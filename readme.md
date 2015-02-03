# sshconf
sshconf is a robust, streaming ssh config parser.

[![Build status](https://travis-ci.org/michaelrhodes/sshconf.svg?branch=master)](https://travis-ci.org/michaelrhodes/sshconf)

## Install
``` sh
$ npm install sshconf
```

### Usage
```js
var fs = require('fs')
var parse = require('sshconf/parse')
var through = require('through2')

fs.createReadStream('/path/to/ssh_config')
  .pipe(parse())
  .pipe(stringify())
  .pipe(process.stdout)

function stringify () {
  return through.obj(function (json, enc, next) {
    next(null, JSON.stringify(json) + '\n')
  })
}
```

#### Get parsed data as a single object
```js
var fs = require('fs')
var parse = require('sshconf/parse')
var merge = require('sshconf/merge')

fs.createReadStream('/path/to/ssh_config')
  .pipe(parse())
  .pipe(merge(function (err, parsed) {
    console.log(JSON.stringify(parsed, null, 2))
  }))
```

### License
[MIT](http://opensource.org/licenses/MIT)
