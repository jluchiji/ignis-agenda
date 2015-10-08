/**
 * define.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Debug       from 'debug';
import * as Util   from 'ignis-util';

const debug = Debug('ignis:agenda:define');


/*!
 * Defines a task processor.
 */
export default function define(task) {

  /* Allow ES6 modules */
  if (task.__esModule) { task = task.default; }

  /* Setup wrapped task */
  const { name, options = { }, handler } = task;

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
    debug(`[normal] ${name}`);
    const callback = (job, done) => handler(this, job.attrs.data, job, done);
    this.agenda._define(name, options, callback);
  } else {
    /* handler(ignis, data, job): does not have an explicit callback */
    debug(`[promised] ${name}`);
    const callback = (job, done) =>
      Util.unpromisify(handler)(this, job.attrs.data, job, done);
    this.agenda._define(name, options, callback);
  }

}
