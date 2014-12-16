/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/startups/6702')
  .then(function (startup) {
     return Hoist.event.raise('startup:found', startup);
  })
  .then(done);
};