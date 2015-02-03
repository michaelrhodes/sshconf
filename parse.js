var combine = require('stream-combiner2')
var split = require('split2')
var through = require('through2')

var blank = /^\s*$/
var comment = /^#/
var array = /,/
var numberish = /^[0-9\.\-\+e]*[0-9]$/
var bool = /^(true|false)$/
var kvp = /^([^\s]+)\s+(.+)$/

module.exports = function () {
  var inHostBlock = false
  var host = null

  return combine.obj([
    split(),
    through.obj(parse, end)
  ]) 

  function parse (line, enc, next) {
    line = trim(line)

    if (blank.test(line) || comment.test(line)) {
      dump.call(this)
      inHostBlock = false
      return next()
    }

    var kv = match(line, kvp)
    var key = kv[0]
    var value = coerce(kv[1])

    if (key === 'Host') {
      dump.call(this)
      host = {}
      inHostBlock = true
      value = value.split(/\s+/)
    }

    if (inHostBlock) {
      host[key] = value
    }
    else {
      var parsed = {}
      parsed[key] = value
      this.push(parsed)
    }

    next()
  }

  function dump () {
    if (inHostBlock && host) {
      this.push(host)
    }
  }

  function end (finish) {
    dump.call(this)
    finish()
  }
}

function coerce (value) {
  if (array.test(value)) {
    return value.split(array).map(coerce)
  }

  return (
    numberish.test(value) &&
    !isNaN(Number(value)) ?
      Number(value) :
    bool.test(value) ?
      value === 'true' :
    value
  )
}

function content (line) {
  return !comment.test(line.toString())
}

function trim (buf) {
  return buf.toString().trim()
}

function match (str, pattern) {
  return (str.match(pattern) || [])
    .slice(1)
}
