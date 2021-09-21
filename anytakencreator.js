function createAnyTakenJob (lib, mylib) {
  'use strict';

  function AnyTakenJob (descriptor, defer) {
    mylib.MultiBase.call(this, descriptor, defer);
  }
  lib.inherit(AnyTakenJob, mylib.MultiBase);

  AnyTakenJob.prototype.processPortCheck = function (isfree, descriptor, index) {
    if (!isfree) {
      this.resolve(true);
    }
  };
  AnyTakenJob.prototype.processPortCheckFail = function (reason, descriptor, index) {
  };
  AnyTakenJob.prototype.finalize = function () {
    this.resolve(false);
  };

  mylib.AnyTaken = AnyTakenJob;
}
module.exports = createAnyTakenJob;


