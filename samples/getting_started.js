/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/reservations')
  .then(function (reservations) {
    var promises = [];
    for(var index = 0; index < reservations.length; index++) {
      promises.push(Hoist.event.raise('reservation:found', reservations[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};