/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/follows/batch?ids=86500,173917')
  .then(function (followers) {
    var promises = [];
    for(var index = 0; index < followers.length; index++) {
      promises.push(Hoist.event.raise('follower:found', followers[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};