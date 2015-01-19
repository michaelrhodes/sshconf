# parse-ssh-config
parse-ssh-config is a robust, streaming ssh config parser.

## Install
``` sh
$ npm install michaelrhodes/parse-ssh-config
```

### Usage
```js
var fs = require('fs')
var parse = require('parse-ssh-config')
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
var parse = require('parse-ssh-config')
var merge = require('parse-ssh-config/merge')

fs.createReadStream('/path/to/ssh_config')
  .pipe(parse())
  .pipe(merge(function (err, parsed) {
    console.log(JSON.stringify(parsed, null, 2))
  }))
```

### License
[MIT](http://opensource.org/licenses/MIT)
