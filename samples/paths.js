/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/paths?user_ids=2,155&direction=following')
  .then(function (users) {
    var promises = [];
    for(var index = 0; index < users.length; index++) {
      promises.push(Hoist.event.raise('userConnection:found', users[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};