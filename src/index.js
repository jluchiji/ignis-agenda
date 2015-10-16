/**
 * index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Agenda      from 'agenda';
import Define      from './define';


/*!
 * Setup agenda to play well with Ignis
 */
export function setup(ignis) {
  const agenda = ignis.agenda;

  /* agenda.define() on steroids */
  agenda._define = agenda.define;
  agenda.define = Define.bind(ignis);

  /* Emit agenda events via Ignis dispatcher */
  agenda.on('fail', job => ignis.emit('agenda.fail', job));
  agenda.on('start', job => ignis.emit('agenda.start', job));
  agenda.on('success', job => ignis.emit('agenda.success', job));
  agenda.on('complete', job => ignis.emit('agenda.complete', job));

  /* Watch for process termination and gracefully shutdown */
  const stop = function() {
    agenda.stop(
      /* istanbul ignore next */
      () => process.exit()
    );
  };
  process.on('SIGTERM',           stop);
  process.on('SIGINT',            stop);
  process.on('uncaughtException', stop);

}


/*!
 * Ignis extension function.
 */
export default function IgnisAgenda(ignis, key = 'agenda') {
  ignis.agenda = new Agenda(ignis.config(key));
  setup(ignis);
}
