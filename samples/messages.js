/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/messages')
  .then(function (messages) {
    var promises = [];
    for(var index = 0; index < messages.length; index++) {
      promises.push(Hoist.event.raise('message:found', messages[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};