/**
 * index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.setup = setup;
exports['default'] = IgnisAgenda;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _agenda = require('agenda');

var _agenda2 = _interopRequireDefault(_agenda);

var _define = require('./define');

var _define2 = _interopRequireDefault(_define);

/*!
 * Setup agenda to play well with Ignis
 */

function setup(ignis) {
  var agenda = ignis.agenda;

  /* agenda.define() on steroids */
  agenda._define = agenda.define;
  agenda.define = _define2['default'].bind(ignis);

  /* Emit agenda events via Ignis dispatcher */
  agenda.on('fail', function (job) {
    return ignis.emit('agenda.fail', job);
  });
  agenda.on('start', function (job) {
    return ignis.emit('agenda.start', job);
  });
  agenda.on('success', function (job) {
    return ignis.emit('agenda.success', job);
  });
  agenda.on('complete', function (job) {
    return ignis.emit('agenda.complete', job);
  });

  /* Watch for process termination and gracefully shutdown */
  var stop = function stop() {
    agenda.stop(
    /* istanbul ignore next */
    function () {
      return process.exit();
    });
  };
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
  process.on('uncaughtException', stop);
}

/*!
 * Ignis extension function.
 */

function IgnisAgenda(Ignis) {
  var key = arguments.length <= 1 || arguments[1] === undefined ? 'agenda' : arguments[1];

  Ignis.init(function () {
    this.agenda = new _agenda2['default'](this.config(key));
    setup(this);
  });
}
//# sourceMappingURL=index.js.map
