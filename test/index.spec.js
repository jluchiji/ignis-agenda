/**
 * test/index.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Chai = require('chai');
Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));

const expect = Chai.expect;

const Sinon = require('sinon');
const Ignis = require('ignis');

const Emitter = require('events');

const target = require('../lib');


describe('setup', function() {

  beforeEach(function() {
    this.ignis = new Ignis();
  });

  it('should overwrite agenda.define()', function() {
    this.ignis.agenda = {
      on: function() { },
      stop: function() { },
      define: function() { }
    };

    target.setup(this.ignis);

    expect(this.ignis.agenda._define).to.be.a('function');
    expect(this.ignis.agenda.define).to.be.a('function');
  });

  it('should route agenda events to ignis', function() {
    this.ignis.agenda = new Emitter();
    this.ignis.agenda.on = Sinon.spy(this.ignis.agenda.on);
    this.ignis.agenda.stop = function() { };

    target.setup(this.ignis);

    expect(this.ignis.agenda.on).to.have.callCount(4)
      .calledWith('fail')
      .calledWith('start')
      .calledWith('success')
      .calledWith('complete');

    const f0 = Sinon.spy();
    this.ignis.on('agenda.fail', f0);
    this.ignis.agenda.emit('fail');

    const f1 = Sinon.spy();
    this.ignis.on('agenda.start', f1);
    this.ignis.agenda.emit('start');

    const f2 = Sinon.spy();
    this.ignis.on('agenda.success', f2);
    this.ignis.agenda.emit('success');

    const f3 = Sinon.spy();
    this.ignis.on('agenda.complete', f3);
    this.ignis.agenda.emit('complete');

    expect(f0).to.be.calledOnce;
    expect(f1).to.be.calledOnce;
    expect(f2).to.be.calledOnce;
    expect(f3).to.be.calledOnce;

  });

  it('should setup shutdown handlers', function() {
    process._on = process.on;
    process.on = Sinon.spy(process.on);

    this.ignis.agenda = {
      on: Sinon.spy(),
      define: function() { }
    };
    this.ignis.agenda.stop = Sinon.spy();

    process.removeAllListeners('SIGTERM');
    process.removeAllListeners('SIGINT');
    process.removeAllListeners('uncaughtException');
    target.setup(this.ignis);


    expect(process.on).to.have.callCount(3)
      .calledWith('SIGTERM')
      .calledWith('SIGINT')
      .calledWith('uncaughtException');

    process.emit('SIGTERM');
    expect(this.ignis.agenda.stop).to.be.calledOnce;

    process.emit('SIGINT');
    expect(this.ignis.agenda.stop).to.be.calledTwice;

    process.emit('uncaughtException');
    expect(this.ignis.agenda.stop).to.be.calledTrice;

    process.on = process._on;
  });

});

require('./define.spec.js');

describe('integration', function() {

  it('should mount extension, optionally with config key', function() {
    const ignis = new Ignis();
    ignis.config('agenda', { });
    ignis.use(target);

    return ignis.startup.then(() => {
      const agenda = ignis.agenda;
      expect(agenda).to.be.an('object');
      expect(agenda.define).to.be.a('function');
      expect(agenda.create).to.be.a('function');
      expect(agenda.schedule).to.be.a('function');
      expect(agenda.every).to.be.a('function');
      expect(agenda.now).to.be.a('function');
    });
  });

});
