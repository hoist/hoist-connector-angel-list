/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/reviews?user_id=155')
  .then(function (reviews) {
    var promises = [];
    for(var index = 0; index < reviews.length; index++) {
      promises.push(Hoist.event.raise('review:found', reviews[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};