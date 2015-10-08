const expect = require('chai').expect;
const Sinon = require('sinon');
const Bluebird = require('bluebird');

const target = require('../lib/define');

describe('define', function() {

  beforeEach(function() {
    this.agenda = {
      define: target.bind(this),
      _define: Sinon.spy(function(name, opt, cb) { this.jobs[name] = cb; }),
      jobs: {}
    };
  });

  it('should define a task', function() {
    const task = { name: 'test', handler: Sinon.spy() };

    this.agenda.define(task);

    expect(this.agenda.jobs).to.have.property('test');
  });

  it('should allow options', function() {
    const task = {
      name: 'test',
      options: { 'foo': 'bar' },
      handler: Sinon.spy()
    };

    this.agenda.define(task);

    expect(this.agenda._define).to.be.calledWith('test', task.options);
  });

  it('should throw when name is not a string', function() {
    const task = { name: 123, handler: Sinon.spy() };

    expect(() => { this.agenda.define(task); }).to.throw('task.name must be a string.');
  });

  it('should throw when handler is not a function', function() {
    const task = { name: 'test', handler: 123 };

    expect(() => { this.agenda.define(task); }).to.throw('task.handler must be a function.');
  });

  it('should handle an ES6 module', function() {
    const task = { __esModule: true, default: { name: 'test', handler: Sinon.spy() } };

    this.agenda.define(task);

    expect(this.agenda.jobs).to.have.property('test');
  });

  it('should handle task definition with callback', function() {
    const task = {
      name: 'test',
      handler: Sinon.spy(function(ignis, data, job, done) {
        expect(ignis).to.have.property('agenda');
        expect(data).to.deep.equal({ 'foo': 'bar' });
        expect(job).to.exist;
        expect(done).to.be.a('function');
        done();
      }) // eslint-disable-line
    };

    this.agenda.define(task);
    expect(this.agenda.jobs).to.have.property('test');

    const cb = Sinon.spy();
    this.agenda.jobs.test({ attrs: { data: { 'foo': 'bar' }}}, cb);

    expect(cb).to.be.calledOnce;
    expect(task.handler).to.be.calledOnce;
  });

  it('should handle a promised task', function() {
    const task = {
      name: 'test',
      handler: Sinon.spy(function(ignis, data, job) {
        expect(ignis).to.have.property('agenda');
        expect(data).to.deep.equal({ 'foo': 'bar' });
        expect(job).to.exist;
        return Bluebird.resolve();
      })
    };

    this.agenda.define(task);
    expect(this.agenda.jobs).to.have.property('test');
    const cb = Sinon.spy();
    const promise = this.agenda.jobs.test({ attrs: { data: { 'foo': 'bar' }}}, cb);

    return promise.then(() => {
      expect(cb).to.be.calledOnce;
      expect(task.handler).to.be.calledOnce;
    });
  });

  it('should handle a sync task', function() {
    const task = {
      name: 'test',
      handler: Sinon.spy(function(ignis, data, job) {
        expect(ignis).to.have.property('agenda');
        expect(data).to.deep.equal({ 'foo': 'bar' });
        expect(job).to.exist;
        return null;
      })
    };

    this.agenda.define(task);
    expect(this.agenda.jobs).to.have.property('test');
    const cb = Sinon.spy();
    const promise = this.agenda.jobs.test({ attrs: { data: { 'foo': 'bar' }}}, cb);

    return promise.then(() => {
      expect(cb).to.be.calledOnce;
      expect(task.handler).to.be.calledOnce;
    });
  });

});
