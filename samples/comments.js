/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  var queryParams = {
    commentable_type: 'Startup'
    commentable_id: '6702'
  };
  angelList.get('/comments', queryParams)
  .then(function (paymentTypes) {
    var promises = [];
    for(var index = 0; index < paymentTypes.length; index++) {
      promises.push(Hoist.event.raise('paymentType:found', paymentTypes[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};