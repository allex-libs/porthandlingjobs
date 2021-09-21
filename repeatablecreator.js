function createRepeatableJob (lib, mylib) {
  'use strict';

  var qlib = lib.qlib,
    JobBase = qlib.JobBase;

  function RepeatableJob (descriptor, jobclass, attempts, cooldowntime, critcb, defer) {
    if (!lib.isFunction(critcb)) {
      throw new lib.Error('NOT_A_FUNCTION', 'critcb provided to '+this.constructor.name+' has to be a function that returns a boolean');
    }
    JobBase.call(this, defer);
    this.descriptor = descriptor;
    this.jobclass = jobclass;
    this.attempts = attempts;
    this.cooldowntime = cooldowntime;
    this.critcb = critcb;
    this.current = 0;
    this.lastResult = null;
  }
  lib.inherit(RepeatableJob, JobBase);
  RepeatableJob.prototype.destroy = function () {
    this.lastResult = null;
    this.current = null;
    this.critcb = null;
    this.cooldowntime = null;
    this.attempts = null;
    this.jobclass = null;
    this.descriptor = null;
    JobBase.prototype.destroy.call(this);
  };
  RepeatableJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    this.doAttempt();
    return ok.val;
  };
  RepeatableJob.prototype.doAttempt = function () {
    if (!lib.isNumber(this.current)) {
      return;
    }
    if (this.current>=this.attempts) {
      this.resolve(this.lastResult);
    }
    try {
      (new this.jobclass(this.descriptor)).go().then(
        this.onAttemptDone.bind(this),
        this.reject.bind(this)
      );
    } catch (e) {
      this.reject(e);
    }
  };
  RepeatableJob.prototype.onAttemptDone = function (result) {
    if (!lib.isNumber(this.current)) {
      return;
    }
    try {
    this.lastResult = result;
    if (this.critcb(result)) {
      this.resolve(result);
      return;
    }
    lib.runNext(this.doAttempt.bind(this), this.cooldowntime);
    }
    catch (e) {
      this.reject(e);
    }
  };

  mylib.Repeatable = RepeatableJob;
}
module.exports = createRepeatableJob;


