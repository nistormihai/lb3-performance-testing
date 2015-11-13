var browserPerf = require('browser-perf');
var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'Performance check for liveblog client.'
});
parser.addArgument(
  [ '-u', '--url' ],
  {
    help: 'url to embed.',
    required: true
  }
);
var args = parser.parseArgs();
browserPerf(args.url, function(err, res) {
    // res - array of objects. Metrics for this URL
    if (err) {
        console.log('ERROR: ' + err);
    } else {
        console.log(res[0].meanFrameTime_raf + '\t' + res[0].loadTime + '\t' + res[0].domReadyTime);
    }
}, {
    selenium: 'http://localhost:4444/wd/hub',
    browsers: ['chrome']
});
