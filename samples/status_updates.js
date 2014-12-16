/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/status_updates?startup_id=6702')
  .then(function (statusUpdates) {
    var promises = [];
    for(var index = 0; index < statusUpdates.length; index++) {
      promises.push(Hoist.event.raise('statusUpdate:found', statusUpdates[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};