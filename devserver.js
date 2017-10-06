const express = require('express')
const livereload = require('livereload')
const {createInterface} = require('readline');
const app = express()

// fixme: using FAILURE here to match current ibazel
// should be SUCCEEDED
const IBAZEL_NOTIFY_BUILD_SUCCESS = 'IBAZEL_BUILD_COMPLETED FAILURE';

function ibazel_listen(callback) {
  const rl = createInterface({input: process.stdin, terminal: false});
  rl.on('line', chunk => {
    if (chunk === IBAZEL_NOTIFY_BUILD_SUCCESS) {
      var start = Date.now();
      callback();
    }
  });
  rl.on('close', () => {
    // Give ibazel 5s to kill our process, otherwise do it ourselves
    setTimeout(() => {
      console.error('ibazel failed to stop karma; probably a bug');
      process.exit(1);
    }, 5000);
  });
}

// listen on stdin
// -> "watch mode for express"
// -> livereload

app.use(express.static('.'))

const lrserver = livereload.createServer()
ibazel_listen(() => {
  lrserver.refresh('./bundle.js')
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
