/**
 * promised.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.definePromised = definePromised;
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
 * Defines a promised task handler.
 * XXX Bind to Ignis instance, not agenda
 */

function definePromised(task) {
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

  debug(name);

  var callback = function callback(job, done) {
    return handler(_this, job.attrs.data, job, done);
  };
  this.agenda.define(name, options, Util.unpromisify(callback));
}

exports['default'] = function (ignis) {
  ignis.agenda.definePromised = definePromised.bind(ignis);
};
//# sourceMappingURL=promised.js.map
