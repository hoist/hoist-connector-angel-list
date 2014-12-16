/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/startup_roles?v=1&startup_id=6702')
  .then(function (roles) {
    var promises = [];
    for(var index = 0; index < roles.length; index++) {
      promises.push(Hoist.event.raise('role:found', roles[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};