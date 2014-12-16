/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/users/155')
  .then(function (user) {
    Hoist.event.raise('user:found', user)
  })
  .then(done);
};