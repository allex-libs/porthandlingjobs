function createMultiBaseJob (lib, checkPort, mylib) {
  'use strict';
  var q = lib.q,
    qlib = lib.qlib,
    JobBase = qlib.JobBase;

  function MultiBaseJob (descriptor, defer) {
    JobBase.call(this, defer);
    this.descriptor = descriptor;
    this.index = 0;
  }
  lib.inherit(MultiBaseJob, JobBase);
  MultiBaseJob.prototype.destroy = function () {
    this.index = null;
    this.descriptor = null;
    JobBase.prototype.destroy.call(this);
  };
  MultiBaseJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    if (!(lib.isArray(this.descriptor) && this.descriptor.length>0)) {
      this.finalize();
      return ok.val;
    }
    this.doPortIpAddress();
    return ok.val;
  };
  MultiBaseJob.prototype.doPortIpAddress = function () {
    var desc;
    if (!lib.isNumber(this.index)) {
      return;
    }
    if (this.index >= this.descriptor.length) {
      this.finalize();
      return;
    }
    desc = this.descriptor[this.index];
    if (!lib.isNumber(desc.port)){
      lib.runNext(this.goToNext.bind(this));
      return;
    }
    checkPort(desc.port, desc.ipaddress).done(
      this.onPortChecked.bind(this),
      this.onPortCheckedFailed.bind(this)
    );
  };
  MultiBaseJob.prototype.onPortChecked = function (isfree) {
    try {
      qlib.thenableRead(this.processPortCheck(isfree, this.descriptor[this.index], this.index)).then(
        this.goToNext.bind(this),
        this.reject.bind(this)
      );
    } catch (e) {
      this.reject(e);
    }
  };
  MultiBaseJob.prototype.onPortCheckedFailed = function (reason) {
    try {
      qlib.thenableRead(this.processPortCheckFail(reason, this.descriptor[this.index], this.index)).then(
        this.goToNext.bind(this),
        this.reject.bind(this)
      );
    } catch (e) {
      this.reject(e);
    }
  };
  MultiBaseJob.prototype.goToNext = function () {
    if (!lib.isNumber(this.index)) {
      return;
    }
    this.index++;
    this.doPortIpAddress();
  };
  MultiBaseJob.prototype.finalize = function () {
    this.resolve(this.index);
  };
  MultiBaseJob.prototype.processPortCheck = function (isfree, descriptor, index) {
    throw new lib.Error('NOT_IMPLEMENTED', 'processPortCheck is not implemented in '+this.constructor.name);
  };
  MultiBaseJob.prototype.processPortCheckFail = function (reason, descriptor, index) {
    throw new lib.Error('NOT_IMPLEMENTED', 'processPortCheckFail is not implemented in '+this.constructor.name);
  };

  mylib.MultiBase = MultiBaseJob;
}
module.exports = createMultiBaseJob;
