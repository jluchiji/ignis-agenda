/**
 * define.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = define;
// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _ignisUtil = require('ignis-util');

var Util = _interopRequireWildcard(_ignisUtil);

var debug = (0, _debug2['default'])('ignis:agenda:define');

/*!
 * Defines a task processor.
 */

function define(task) {
  // istanbul ignore next

  var _this = this;

  /* Allow ES6 modules */
  if (task.__esModule) {
    task = task['default'];
  }

  /* Setup wrapped task */
  var _task = task;
  var name = _task.name;
  var _task$options = _task.options;
  var options = _task$options === undefined ? {} : _task$options;
  var handler = _task.handler;

  /* Do not allow malformed tasks */
  if (typeof name !== 'string') {
    throw new Error('task.name must be a string.');
  }
  if (typeof handler !== 'function') {
    throw new Error('task.handler must be a function.');
  }

  /* Wrap tasks as appropriate */
  if (handler.length === 4) {
    /* handler(ignis, data, job, done): has an explicit callback */
    debug('[normal] ' + name);
    var callback = function callback(job, done) {
      return handler(_this, job.attrs.data, job, done);
    };
    this.agenda._define(name, options, callback);
  } else {
    /* handler(ignis, data, job): does not have an explicit callback */
    debug('[promised] ' + name);
    var callback = function callback(job, done) {
      return Util.unpromisify(handler)(_this, job.attrs.data, job, done);
    };
    this.agenda._define(name, options, callback);
  }
}

module.exports = exports['default'];
//# sourceMappingURL=define.js.map
