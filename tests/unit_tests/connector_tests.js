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
          access_token: '<access_token>'
        }
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
  describe('#delete', function () {
    describe('with no data', function () {
      var response = {};
      var result;
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.delete('/comments/1');
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('DELETE', '/comments/1');
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
        result = connector.delete('/comments/1', data);
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('DELETE', '/comments/1', null, data);
      });
    });
  });

  describe('#request', function () {
    describe('GET', function () {
      describe('with authenticated connector type', function () {
        before(function () {
          connector.settings.authType = 'authenticated';
        });
        describe('sending an authenticated request', function () {
          var data = {
            authenticatedRequest: true
          }
          describe('with no queryParams', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var options = {
              method: 'GET',
              uri: 'https://api.angel.co/1/reservations',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations', null, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper with authorization headers', function () {
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

            var queryParams = {
              query: 'query'
            };
            var options = {
              method: 'GET',
              uri: 'https://api.angel.co/1/reservations?query=query',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations', queryParams, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper with authorization headers', function () {
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
              uri: 'https://api.angel.co/1/reservations?query=query',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations?query=query', null, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper with authorization headers', function () {
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
              uri: 'https://api.angel.co/1/reservations?querypath=querypath&query=query',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations?querypath=querypath', queryParams, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper with authorization headers', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
          });
          describe('with duplicate queryParams in path and object', function () {
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
              uri: 'https://api.angel.co/1/reservations?query=query',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations?query=queryfalse', queryParams, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper with authorization headers correctly', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
          });
        });

        describe('sending an unauthenticated request', function () {
          describe('with no queryParams', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var options = {
              method: 'GET',
              uri: 'https://api.angel.co/1/reservations',
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations', null);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper without authorization headers', function () {
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

            var queryParams = {
              query: 'query'
            };
            var options = {
              method: 'GET',
              uri: 'https://api.angel.co/1/reservations?query=query',
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations', queryParams);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper without authorization headers', function () {
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
              uri: 'https://api.angel.co/1/reservations?query=query',
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations?query=query', null);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper without authorization headers', function () {
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
              uri: 'https://api.angel.co/1/reservations?querypath=querypath&query=query',
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations?querypath=querypath', queryParams);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper without authorization headers', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
          });
          describe('with duplicate queryParams in path and object', function () {
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
              uri: 'https://api.angel.co/1/reservations?query=query',
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations?query=queryfalse', queryParams);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper without authorization headers', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
          });
        });
      });
      describe('with unauthenticated connector type', function () {

        before(function () {
          connector.settings.authType = 'unauthenticated';

        });
        describe('sending an authenticated request', function () {
          var data = {
            authenticatedRequest: true
          };
          it('rejects', function () {
            expect(function () {
              connector.request('GET', '/reservations', null, data);
            }).to.throw(errors.connector.request.UnauthorizedError);
          });
        });
        describe('sending an unauthenticated request', function () {
          describe('with no queryParams', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var data = {
              authenticatedRequest: false
            };
            var options = {
              method: 'GET',
              uri: 'https://api.angel.co/1/reservations',
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations', null);
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
            var queryParams = {
              query: 'query'
            };
            var options = {
              method: 'GET',
              uri: 'https://api.angel.co/1/reservations?query=query',
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations', queryParams);
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
              uri: 'https://api.angel.co/1/reservations?query=query',
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations?query=query', null);
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
              uri: 'https://api.angel.co/1/reservations?querypath=querypath&query=query',
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations?querypath=querypath', queryParams);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
          });
          describe('with duplicate queryParams in path and object', function () {
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
              uri: 'https://api.angel.co/1/reservations?query=query',
              json: true,
              resolveWithFullResponse: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('GET', '/reservations?query=queryfalse', queryParams);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper correctly', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
          });
        });
      });
    });


    describe('PUT', function () {
      describe('with no path', function () {
        it('rejects', function () {
          expect(function () {
            connector.request();
          }).to.throw(errors.connector.request.InvalidError);
        });
      });
      describe('with authenticated connector type', function () {
        before(function () {
          connector.settings.authType = 'authenticated';
        });
        describe('sending an authenticated request', function () {
          var data = {};
          describe('with json string', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var data = {
              authenticatedRequest: true,
              body: '{"Staff":{"Name":"John"}}'
            };
            // data.body = '{"Staff":{"Name":"John"}}';
            var options = {
              method: 'PUT',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              resolveWithFullResponse: true,
              uri: 'https://api.angel.co/1/reservations/12345',
              body: data.body,
              json: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('PUT', '/reservations/12345', null, data);
              return result;
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
            it('returns response', function () {
              return expect(result).to.become(response.body);
            });
          });
          describe('with object', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var data = {
              authenticatedRequest: true,
              body: {
                Staff: {
                  Name: "John"
                }
              }
            };
            var options = {
              method: 'PUT',
              headers: {
                Authorization: 'Bearer <access_token>'
              },
              resolveWithFullResponse: true,
              uri: 'https://api.angel.co/1/reservations/12345',
              body: data.body,
              json: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('PUT', '/reservations/12345', null, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
            it('returns response', function () {
              return expect(result).to.become(response.body);
            });
          });
        });
        describe('sending an unauthenticated request', function () {
          var data = {};
          describe('with json string', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var data = {
              authenticatedRequest: false,
              body: '{"Staff":{"Name":"John"}}'
            };
            var options = {
              method: 'PUT',
              resolveWithFullResponse: true,
              uri: 'https://api.angel.co/1/reservations/12345',
              body: data.body,
              json: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('PUT', '/reservations/12345', null, data);
              return result;
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
            it('returns response', function () {
              return expect(result).to.become(response.body);
            });
          });
          describe('with object', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var data = {
              authenticatedRequest: false,
              body: {
                Staff: {
                  Name: "John"
                }
              }
            };
            var options = {
              method: 'PUT',
              resolveWithFullResponse: true,
              uri: 'https://api.angel.co/1/reservations/12345',
              body: data.body,
              json: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('PUT', '/reservations/12345', null, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
            it('returns response', function () {
              return expect(result).to.become(response.body);
            });
          });
        });
      });
      
      describe('with unauthenticated connector type', function () {
        before(function () {
          connector.settings.authType = 'unauthenticated';
        });
        describe('sending an authenticated request', function () {
          var data = {
            authenticatedRequest: true
          };
          it('rejects', function () {
            expect(function () {
              connector.request('PUT', '/reservations', null, data);
            }).to.throw(errors.connector.request.UnauthorizedError);
          });
        });
        describe('sending an unauthenticated request', function () {
          var data = {};
          describe('with json string', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            var data =  {
              body: '{"Staff":{"Name":"John"}}'
            };
            var options = {
              method: 'PUT',
              resolveWithFullResponse: true,
              uri: 'https://api.angel.co/1/reservations/12345',
              body: data.body,
              json: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('PUT', '/reservations/12345', null, data);
              return result;
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
            it('returns response', function () {
              return expect(result).to.become(response.body);
            });
          });
          describe('with object', function () {
            var response = {
              body: {
                body: "some body"
              },
              statusCode: 200
            };
            data.body = {
              Staff: {
                Name: "John"
              }
            };
            var options = {
              method: 'PUT',
              resolveWithFullResponse: true,
              uri: 'https://api.angel.co/1/reservations/12345',
              body: data.body,
              json: true
            };
            var result;
            before(function () {
              sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
              result = connector.request('PUT', '/reservations/12345', null, data);
            });
            after(function () {
              connector.requestPromiseHelper.restore();
            });
            it('calls requestPromiseHelper', function () {
              expect(connector.requestPromiseHelper)
                .to.have.been.calledWith(options);
            });
            it('returns response', function () {
              return expect(result).to.become(response.body);
            });
          });
        });
      });
    });
  });
});