/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  var parameters = {
    startup_id: 1
  };
  angelList.post('/intros', parameters)
  .then(function (intro) {
     return Hoist.event.raise('intro:found', intro);
  })
  .then(done);
};