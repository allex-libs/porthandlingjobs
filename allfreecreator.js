function createAllFreeJob (lib, mylib) {
  'use strict';

  function AllFreeJob (descriptor, defer) {
    mylib.MultiBase.call(this, descriptor, defer);
  }
  lib.inherit(AllFreeJob, mylib.MultiBase);

  AllFreeJob.prototype.processPortCheck = function (isfree, descriptor, index) {
    if (!isfree) {
      this.resolve(false);
    }
  };
  AllFreeJob.prototype.processPortCheckFail = function (reason, descriptor, index) {
    this.resolve(false);
  };
  AllFreeJob.prototype.finalize = function () {
    this.resolve(true);
  };

  mylib.AllFree = AllFreeJob;
}
module.exports = createAllFreeJob;


