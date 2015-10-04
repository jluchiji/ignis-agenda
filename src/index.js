/**
 * index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Agenda      from 'agenda';
import DefPromised from './promised';

export default function IgnisAgenda(Ignis, key = 'agenda') {
  Ignis.init(function() {

    /* Retrieve configuration and setup the client */
    const agenda = this.agenda = new Agenda(this.config(key));

    /* Route agenda events through Ignis dispatcher */
    agenda.on('success', job => this.emit('agenda.success', job));
    agenda.on('fail',    job => this.emit('agenda.fail',    job));

    /* Gracefully shutdown */
    const stop = function() { agenda.stop(() => process.exit(0)); };
    process.on('SIGTERM',           stop);
    process.on('SIGINT',            stop);
    process.on('uncaughtException', stop);

    DefPromised(this);
  });
}
