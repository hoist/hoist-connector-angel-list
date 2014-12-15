'use strict';
var BBPromise = require('bluebird');
var requestPromise = require('request-promise');
var logger = require('hoist-logger');
var url = require('url');
var errors = require('hoist-errors');
var _ = require('lodash');

var authGetTokenUrl = 'https://angel.co/api/oauth/token';
var authUrl = 'https://angel.co/api/oauth/authorize';
var apiUrl = ' https://api.angel.co/1';

/*jshint camelcase: false */

function AngelListConnector(settings) {
  logger.info({
    settings: settings
  }, 'constructed angel-list-connector');
  this.settings = settings;
}

AngelListConnector.prototype.get = function get(url, queryParams, data) {
  logger.info('inside hoist-connector-angel-list.get');
  return this.request('GET', url, queryParams, data);
};

AngelListConnector.prototype.post = function post(url, data) {
  logger.info('inside hoist-connector-angel-list.post');
  if (!data) {
    throw new errors.connector.request.InvalidError('no data specified in post');
  }
  return this.request('POST', url, null, data);
};

AngelListConnector.prototype.put = function put(url, data) {
  logger.info('inside hoist-connector-angel-list.put');
  if (!data) {
    throw new errors.connector.request.InvalidError('no data specified in put');
  }
  return this.request('PUT', url, null, data);
};

AngelListConnector.prototype.request = function request(method, path, queryParams, data) {
  if (!path) {
    throw new errors.connector.request.InvalidError('no path specified');
  }
  data = data ? data : null;
  logger.info({
    method: method,
    path: path
  }, 'inside hoist-connector-angel-list.request');
  var options = {
    method: method,
    json: true,
    resolveWithFullResponse: true,
    uri: apiUrl + path
  };
  var self = this;

  // check if connector is authenticated or not
  if (this.settings.authType === 'authenticated') {
    if (!data || !data.authenticatedRequest) {
      throw new errors.connector.request.InvalidError();
    }
    if (this.authSettings ) {
      var headers = {
        Authorization: 'Bearer ' + self.authSettings.get('token').access_token
      };
      options.headers = headers;
    } else {
      throw new errors.connector.request.UnauthorizedError();
    }
    //'unauthenticated'
  } else {
    if (data && data.authenticatedRequest) {
      throw new errors.connector.request.UnauthorizedError();
    }
  }

  if (method === 'PUT' || method === 'POST') {
    options.body = data;
  }

  if (method === 'GET') {
    var parsedUrl = url.parse(options.uri, true);
    parsedUrl.search = null;
    var query = parsedUrl.query;
    if (queryParams) {
      query = _.extend(query, queryParams);
    }
    options.uri = url.format(parsedUrl);
  }
  if (data ) {
    delete data.authenticatedRequest;
  }
  return self.requestPromiseHelper(options)
  .then(function(response) {
    logger.info({responseBody: response.body}, 'inside hoist-connector-angel-list.request');
    return response.body;
  });
};


/* istanbul ignore next */
AngelListConnector.prototype.authorize = function (authSettings) {
  this.authSettings = authSettings;
  return BBPromise.resolve({});
};

AngelListConnector.prototype.receiveBounce = function (bounce) {
  if (bounce.query && bounce.query.code) {
    return bounce.set('code', bounce.query.code)
      .then(function () {
        return bounce.set('code', bounce.query.code);
      })
      .bind(this)
      .then(function () {
        return this.requestAccessToken(bounce);
      })
      .then(function (response) {
        return bounce.set('token', JSON.parse(response.body.access_token));
      })
      .then(bounce.done);
  } else {
    return bounce.redirect(authUrl + '?client=' +this.settings.clientId+ '&response_type=code');
  }
};

AngelListConnector.prototype.requestAccessToken = function (bounce) {
  var body = {
    code: bounce.get('code'),
    client_id: this.settings.clientId,
    client_secret: this.settings.clientSecret,
    grant_type: 'authorization_code'
  };


  var options = {
    method: 'POST',
    uri: authGetTokenUrl,
    formData: body,
    resolveWithFullResponse: true
  };

  return this.requestPromiseHelper(options);
};

/* istanbul ignore next */
AngelListConnector.prototype.requestPromiseHelper = function requestPromiseHelper(options) {
  return BBPromise.resolve(requestPromise(options));
};

module.exports = AngelListConnector;