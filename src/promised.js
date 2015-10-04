/**
 * promised.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Debug       from 'debug';
import * as Util   from 'ignis-util';

const debug = Debug('ignis:agenda:define');


/*!
 * Defines a promised task handler.
 * XXX Bind to Ignis instance, not agenda
 */
export function definePromised(task) {

  /* Allow ES6 modules */
  if (task.__esModule) { task = task.default; }

  /* Setup wrapped task */
  const { name, options = { }, handler } = task;
  debug(name);

  const callback = (job, done) => handler(this, job.attrs.data, job, done);
  this.agenda.define(name, options, Util.unpromisify(callback));

}


export default function(ignis) {
  ignis.agenda.definePromised = definePromised.bind(ignis);
}
