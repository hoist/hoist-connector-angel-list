/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/likes?likable_type=Comment&likable_id=3800')
  .then(function (likes) {
    var promises = [];
    for(var index = 0; index < likes.length; index++) {
      promises.push(Hoist.event.raise('like:found', likes[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};