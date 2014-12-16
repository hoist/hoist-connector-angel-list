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
    describe('with no queryParams', function () {
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
          .to.have.been.calledWith('GET', '/customers');
      });
    });
    describe('with queryParams', function () {
      var response = {};
      var result;
      var queryParams = {
        query: 'query'
      };
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.get('/customers', queryParams);
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('GET', '/customers', queryParams);
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
        data: 'data'
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
        data: 'data'
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
    var response = {};
    var result;
    var data = {
      data: 'data'
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
        .to.have.been.calledWith('DELETE', '/comments/1');
    });
  });

  describe('#request', function () {
    describe('GET', function () {
      describe('with authenticated connector type', function () {
        before(function () {
          connector.settings.authType = 'authenticated';
        });
        describe('with no authSetting', function () {
          before(function () {
            connector.authSettings = null;
          });
          after(function () {
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
          it('rejects', function () {
            expect(function () {
              connector.request('GET', '/path');
            }).to.throw(errors.connector.request.UnauthorizedError);
          });
        });
        describe('with no queryParams', function () {
          var response = {
            body: {
              body: "some body"
            }
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
            result = connector.request('GET', '/reservations', null);
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
            }
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
            result = connector.request('GET', '/reservations', queryParams);
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
            }
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
            result = connector.request('GET', '/reservations?query=query', null);
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
            }
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
            result = connector.request('GET', '/reservations?querypath=querypath', queryParams);
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
            }
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
            result = connector.request('GET', '/reservations?query=queryfalse', queryParams);
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
      describe('with unauthenticated connector type', function () {
        before(function () {
          connector.settings.authType = 'unauthenticated';
        });
        describe('with no queryParams', function () {
          var response = {
            body: {
              body: "some body"
            }
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
            }
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
            }
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
            }
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
            }
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
        describe('with json string', function () {
          var response = {
            body: {
              body: "some body"
            }
          };
          var data = '{"Staff":{"Name":"John"}}'
          var options = {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer <access_token>'
            },
            resolveWithFullResponse: true,
            uri: 'https://api.angel.co/1/reservations/12345',
            body: data,
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
            }
          };
          var data = {
            Staff: {
              Name: "John"
            }
          };
          var options = {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer <access_token>'
            },
            resolveWithFullResponse: true,
            uri: 'https://api.angel.co/1/reservations/12345',
            body: data,
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

      describe('with unauthenticated connector type', function () {
        before(function () {
          connector.settings.authType = 'unauthenticated';
        });
        describe('with json string', function () {
          var response = {
            body: {
              body: "some body"
            }
          };
          var data = '{"Staff":{"Name":"John"}}'
          var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            uri: 'https://api.angel.co/1/reservations/12345',
            body: data,
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
            }
          };
          var data = {
            Staff: {
              Name: "John"
            }
          };
          var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            uri: 'https://api.angel.co/1/reservations/12345',
            body: data,
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
    describe('POST', function () {
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
        describe('with json string', function () {
          var response = {
            body: {
              body: "some body"
            }
          };
          var data = '{"Staff":{"Name":"John"}}'
          var options = {
            method: 'POST',
            headers: {
              Authorization: 'Bearer <access_token>'
            },
            resolveWithFullResponse: true,
            uri: 'https://api.angel.co/1/reservations',
            body: data,
            json: true
          };
          var result;
          before(function () {
            sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
            result = connector.request('POST', '/reservations', null, data);
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
            }
          };
          var data = {
            Staff: {
              Name: "John"
            }
          };
          var options = {
            method: 'POST',
            headers: {
              Authorization: 'Bearer <access_token>'
            },
            resolveWithFullResponse: true,
            uri: 'https://api.angel.co/1/reservations',
            body: data,
            json: true
          };
          var result;
          before(function () {
            sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
            result = connector.request('POST', '/reservations', null, data);
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

      describe('with unauthenticated connector type', function () {
        before(function () {
          connector.settings.authType = 'unauthenticated';
        });
        describe('with json string', function () {
          var response = {
            body: {
              body: "some body"
            }
          };
          var data = '{"Staff":{"Name":"John"}}'
          var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            uri: 'https://api.angel.co/1/reservations',
            body: data,
            json: true
          };
          var result;
          before(function () {
            sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
            result = connector.request('POST', '/reservations', null, data);
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
            }
          };
          var data = {
            Staff: {
              Name: "John"
            }
          };
          var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            uri: 'https://api.angel.co/1/reservations',
            body: data,
            json: true
          };
          var result;
          before(function () {
            sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
            result = connector.request('POST', '/reservations', null, data);
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
    describe('DELETE', function () {
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
        describe('with object', function () {
          var response = {
            body: {
              body: "some body"
            }
          };
          var options = {
            method: 'DELETE',
            headers: {
              Authorization: 'Bearer <access_token>'
            },
            resolveWithFullResponse: true,
            uri: 'https://api.angel.co/1/reservations/12345',
            json: true
          };
          var result;
          before(function () {
            sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
            result = connector.request('DELETE', '/reservations/12345');
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

      describe('with unauthenticated connector type', function () {
        before(function () {
          connector.settings.authType = 'unauthenticated';
        });
        describe('with object', function () {
          var response = {
            body: {
              body: "some body"
            }
          };
          var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            uri: 'https://api.angel.co/1/reservations/12345',
            json: true
          };
          var result;
          before(function () {
            sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
            result = connector.request('DELETE', '/reservations/12345');
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


  describe('#receiveBounce', function () {
    describe('with bounce.query', function () {
      var bounce = {
        query: {
          code: 'code'
        },
        proxy: {},
        get: function (name) {
          return this.proxy[name];
        },
        set: function (name, value) {
          this.proxy[name] = value;
          return BBPromise.resolve(this);
        },
        done: sinon.stub()
      };
      var response = {
        body: '{\n    "access_token": "accessToken"\n}'
      }
      before(function () {
        sinon.stub(connector, 'requestAccessToken').returns(BBPromise.resolve(response));
        return connector.receiveBounce(bounce);
      });
      after(function () {
        connector.requestAccessToken.restore();
      });
      it('calls requestAccessToken with correct arguments', function () {
        expect(connector.requestAccessToken).to.have.been.calledWith(bounce);
      });
      it('sets correct properties on bounce', function () {
        expect(bounce.get('code')).to.eql('code');
        expect(bounce.get('token')).to.eql(JSON.parse(response.body).access_token);
      });
      it('calls bounce.done', function () {
        expect(bounce.done).to.have.been.called;
      });
    });
    describe('without bounce.query', function () {
      var bounce = {
        proxy: {},
        get: function (name) {
          return this.proxy[name];
        },
        set: function (name, value) {
          this.proxy[name] = value;
          return BBPromise.resolve(this);
        },
        redirect: sinon.stub(),
        done: sinon.stub()
      };
      var response = {
        body: 'body'
      }
      before(function () {
        sinon.stub(connector, 'requestAccessToken').returns(BBPromise.resolve(response));
        return connector.receiveBounce(bounce);
      });
      after(function () {
        connector.requestAccessToken.restore();
      });
      it('does not call requestAccessToken', function () {
        expect(connector.requestAccessToken).to.have.not.been.called;
      });
      it('does not call bounce.done', function () {
        expect(bounce.done).to.have.not.been.called;
      });
      it('calls redirect with correct url', function () {
        expect(bounce.redirect)
          .to.have.been.calledWith('https://angel.co/api/oauth/authorize?client_id=clientId&scope=message%20email%20comment%20talent&response_type=code');
      });
    });
  });

  describe('#requestAccessToken', function () {
    var bounce = {
      proxy: {
        code: 'code'
      },
      get: function (name) {
        return this.proxy[name];
      }
    };
    var body = {
      code: 'code',
      client_id: 'clientId',
      client_secret: 'clientSecret',
      grant_type: 'authorization_code'
    };
    var options = {
      method: 'POST',
      resolveWithFullResponse: true,
      uri: 'https://angel.co/api/oauth/token',
      formData: body
    };
    before(function () {
      sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve());
      return connector.requestAccessToken(bounce)
    });
    it('calls requestPromiseHelper with correct arguments', function () {
      expect(connector.requestPromiseHelper).to.have.been.calledWith(options);
    })
  });
});