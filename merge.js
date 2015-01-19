var through = require('through2')

module.exports = function (cb) {
  var output = {
    hosts: []
  }

  return through.obj(concat, push)

  function concat (line, enc, next) {
    if (line.hasOwnProperty('Host')) {
      output.hosts.push(line)
      return next()
    }

    Object.keys(line).forEach(function (key) {
      output[key] = line[key]
    })

    next()
  }

  function push (end) {
    if (typeof cb === 'function') {
      cb(null, output)
    }
    this.push(output)
    end()
  }
}
