/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/accreditation')
  .then(function (customers) {
    var promises = [];
    for(var index = 0; index < customers.length; index++) {
      promises.push(Hoist.event.raise('customer:found', customers[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};