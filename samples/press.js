/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/press?startup_id=6702')
  .then(function (press) {
    var promises = [];
    for(var index = 0; index < press.length; index++) {
      promises.push(Hoist.event.raise('presArticle:found', press[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};