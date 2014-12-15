'use strict';
require('../bootstrap');
var AngelList = require('../../lib/connector');
var sinon = require('sinon');
var BBPromise = require('bluebird');
var expect = require('chai').expect;
var requestPromise = require('request-promise');
var config = require('config');
var errors = require('hoist-errors');

describe('AngelListConnector', function () {
  var connector;
  before(function () {
    connector = new AngelList({
      clientId: 'clientId',
      clientSecret: 'clientSecret'
    });
    connector.authSettings = {
      authProxy: {
        token: {
          access_token: '<access_token>',
          refresh_token: '<refresh_token>',
          expires: Date.now() + 10 * 60 * 1000,
          expires_in: '7200'
        },
        domainPrefix: 'test'
      },
      get: function (name) {
        return this.authProxy[name];
      },
      set: function (name, value) {
        this.authProxy[name] = value;
        return BBPromise.resolve(this);
      }
    };
  });
  describe('#get', function () {
    describe('with no queryParams or data', function () {
      var response = {};
      var result;
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.get('/customers');
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('GET', '/customers', undefined, undefined);
      });
    });
    describe('with queryParams and data', function () {
      var response = {};
      var result;
      var queryParams = {
        query: 'query'
      };
      var data = {
        authenticatedRequest: true
      };
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.get('/customers', queryParams, data);
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('GET', '/customers', queryParams, data);
      });
    });
  });
  describe('#post', function () {
    describe('with no data', function () {
      it('rejects', function () {
        expect(function () {
          connector.post('/path');
        }).to.throw(errors.connector.request.InvalidError);
      });
    });
    describe('with data', function () {
      var response = {};
      var result;
      var data = {
        authenticatedRequest: true
      };
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.post('/customers', data);
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('POST', '/customers', null, data);
      });
    });
  });
  describe('#put', function () {
    describe('with no data', function () {
      it('rejects', function () {
        expect(function () {
          connector.put('/path');
        }).to.throw(errors.connector.request.InvalidError);
      });
    });
    describe('with data', function () {
      var response = {};
      var result;
      var data = {
        authenticatedRequest: true
      };
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.put('/consignment/1', data);
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('PUT', '/consignment/1', null, data);
      });
    });
  });

  describe('#request', function () {
    describe('GET', function () {
      describe('with authenticated connector type', function () {
        
        before(function () {
          connector.settings.authType = 'authenticated';
         
        });
        describe('with authenticatedRequest false', function () {
          it('rejects', function () {
            expect(function () {
              connector.request('GET', '/product', null, null);
            }).to.throw(errors.connector.request.InvalidError);
          });
        });
        describe('with authenticatedRequest true', function () {
          
          describe('with no queryParams', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var data = {
              authenticatedRequest: true
            };
            var options = {
              method: 'GET',
              uri: 'https://api.angel.co/1/product',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              console.log('data: ', data)
              result = connector.request('GET', '/product', null, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
            it('returns the response body', function () {
              expect(result)
                .to.become(response.body);
            });
          });
          describe('with queryParams object', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var data = {
              authenticatedRequest: true
            };
            var queryParams = {
              query: 'query'
            };
            var options = {
              method: 'GET',
              uri: 'https://api.angel.co/1/product?query=query',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/product', queryParams, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
            it('returns the response body', function () {
              expect(result)
                .to.become(response.body);
            });
          });
          describe('with queryParams in path', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var options = {
              method: 'GET',
              uri: 'https://api.angel.co/1/product?query=query',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              json: true,
              resolveWithFullResponse: true
            };
            var data = {
              authenticatedRequest: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/product?query=query', null, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
          });
          describe('with queryParams in path and object', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var queryParams = {
              query: 'query'
            };
            var options = {
              method: 'GET',
              uri: 'https://api.angel.co/1/product?querypath=querypath&query=query',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              json: true,
              resolveWithFullResponse: true
            };
            var data = {
              authenticatedRequest: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              console.log('data: ', data)
              result = connector.request('GET', '/product?querypath=querypath', queryParams, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
          });
          describe.skip('with duplicate queryParams in path and object', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var queryParams = {
              query: 'query'
            };
            var options = {
              method: 'GET',
              uri: 'https://api.angel.co/1/product?query=query',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              json: true,
              resolveWithFullResponse: true
            };
            var data = {
              authenticatedRequest: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              sinon.stub(connector, 'refreshToken').returns(BBPromise.resolve());
              result = connector.request('GET', '/product?query=queryfalse', queryParams);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
              connector.refreshToken.restore();
            });
            it('calls requestPromiseHelper correctly', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
            it('calls refreshToken', function () {
              expect(connector.refreshToken)
                .to.have.been.called;
            });
          });
        });
      });
    });
  });
});