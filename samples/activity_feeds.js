/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/feed')
  .then(function (feed) {
    var promises = [];
    for(var index = 0; index < feed.length; index++) {
      promises.push(Hoist.event.raise('feed:found', feed[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};