function createPortHandlingJobsLib (execlib) {
  'use strict';
  var lib = execlib.lib,
    execSuite = execlib.execSuite,
    checkPort = execSuite.checkPort;

  var mylib = {};
  require('./utilscreator')(lib, mylib);
  require('./multibasecreator')(lib, checkPort, mylib);
  require('./anytakencreator')(lib, mylib);
  require('./allfreecreator')(lib, mylib);

  require('./repeatablecreator')(lib, mylib);

  return mylib;
}
module.exports = createPortHandlingJobsLib;
