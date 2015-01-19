var fs = require('fs')
var path = require('path')
var test = require('tape')
var through = require('through2')
var splice = require('stream-splicer')
var parse = require('../parse')
var merge = require('../merge')

var configs = [
  path.join(__dirname, 'config/ssh_config'),
  path.join(__dirname, 'config/messy_ssh_config')
]
var parsed = [
  configs[0] + '.parsed',
  configs[1] + '.parsed'
]
var merged = [
  parsed[0] + '.merged',
  parsed[1] + '.merged'
]

test('it parses', function (assert) {
  run(assert, prepare(parsed))
})

test('it merges', function (assert) {
  run(assert, prepare(merged), true)
})


function run (assert, expected, shouldMerge) {
  configs.forEach(function (config, index) {
    var seq = splice([
      fs.createReadStream(config),
      parse()
    ])

    if (shouldMerge) {
      seq.push(merge())
    }

    var line = 0
    seq.push(through.obj(function (obj, enc, next) {
      assert.deepEqual(obj, expected[index][line++])
      next()
    }, function () {
      end(index + 1)
    }))
  })

  function end (count) {
    if (count === configs.length) {
      assert.end()
    }
  }
}

function prepare (files) {
  return files.map(function (file) {
    return fs.readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .map(toJSON)
  })
}

function toJSON (str) {
  if (str) return JSON.parse(str) 
}
